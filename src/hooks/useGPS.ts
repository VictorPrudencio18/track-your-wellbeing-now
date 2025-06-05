import { useState, useEffect, useRef, useCallback } from 'react';

export interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

export interface GPSState {
  position: GPSPosition | null;
  isTracking: boolean;
  error: string | null;
  accuracy: number;
  isHighAccuracy: boolean;
  getPositionHistory: () => GPSPosition[];
  calculateTotalDistance: () => number;
  calculateCurrentSpeed: () => number;
  calculateDistance: (pos1: GPSPosition, pos2: GPSPosition) => number;
}

export function useGPS() {
  const [state, setState] = useState<Omit<GPSState, 'getPositionHistory' | 'calculateTotalDistance' | 'calculateCurrentSpeed' | 'calculateDistance'>>({
    position: null,
    isTracking: false,
    error: null,
    accuracy: 0,
    isHighAccuracy: false
  });

  const watchIdRef = useRef<number | null>(null);
  const positionHistoryRef = useRef<GPSPosition[]>([]);
  const initializationAttempted = useRef(false);
  const hasInitialPosition = useRef(false);

  const isValidPosition = useCallback((position: GeolocationPosition): boolean => {
    const { coords } = position;
    
    if (!coords || 
        isNaN(coords.latitude) || 
        isNaN(coords.longitude) ||
        coords.latitude === 0 && coords.longitude === 0) {
      return false;
    }
    
    if (coords.latitude < -90 || coords.latitude > 90 ||
        coords.longitude < -180 || coords.longitude > 180) {
      return false;
    }
    
    // Se ainda não temos posição inicial, aceitar qualquer precisão válida
    if (!hasInitialPosition.current) {
      console.log(`Primeira posição GPS: precisão=${coords.accuracy}m - aceitando para inicialização`);
      return true;
    }
    
    // Após ter posição inicial, ser mais seletivo com a precisão
    if (coords.accuracy > 100) {
      console.warn(`GPS precisão baixa durante tracking: ${coords.accuracy}m - rejeitando posição`);
      return false;
    }
    
    return true;
  }, []);

  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'GPS não está disponível neste dispositivo' }));
      return;
    }

    console.log('Iniciando rastreamento GPS...');
    setState(prev => ({ ...prev, error: null }));

    try {
      // Primeiro, obter posição inicial com configurações muito permissivas
      const initialPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout ao obter posição inicial'));
        }, 30000); // Aumentar timeout para 30s

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            console.log(`Posição GPS recebida: lat=${position.coords.latitude}, lng=${position.coords.longitude}, precisão=${position.coords.accuracy}m`);
            
            if (isValidPosition(position)) {
              hasInitialPosition.current = true;
              resolve(position);
            } else {
              reject(new Error('Posição GPS inválida'));
            }
          }, 
          (error) => {
            clearTimeout(timeoutId);
            console.error('Erro getCurrentPosition:', error);
            reject(error);
          }, 
          {
            enableHighAccuracy: false, // Começar com baixa precisão para obter posição mais rápido
            timeout: 25000,
            maximumAge: 600000 // Aceitar posições até 10 minutos antigas inicialmente
          }
        );
      });

      const gpsPosition: GPSPosition = {
        latitude: initialPosition.coords.latitude,
        longitude: initialPosition.coords.longitude,
        altitude: initialPosition.coords.altitude || undefined,
        accuracy: initialPosition.coords.accuracy,
        speed: initialPosition.coords.speed || undefined,
        heading: initialPosition.coords.heading || undefined,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        position: gpsPosition,
        isTracking: true,
        error: null,
        accuracy: gpsPosition.accuracy || 0,
        isHighAccuracy: (gpsPosition.accuracy || 100) < 20
      }));

      positionHistoryRef.current = [gpsPosition];
      console.log(`GPS inicializado com sucesso: lat=${gpsPosition.latitude}, lng=${gpsPosition.longitude}, precisão=${gpsPosition.accuracy?.toFixed(1)}m`);

      // Iniciar rastreamento contínuo com configurações progressivamente mais precisas
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          console.log(`Nova posição GPS: precisão=${position.coords.accuracy}m`);
          
          if (!isValidPosition(position)) {
            console.warn('Posição GPS inválida recebida - ignorando');
            return;
          }

          const newGpsPosition: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: Date.now()
          };

          // Filtrar movimentos muito pequenos apenas se temos alta precisão
          const lastPosition = positionHistoryRef.current[positionHistoryRef.current.length - 1];
          if (lastPosition && (newGpsPosition.accuracy || 100) < 50) {
            const distance = calculateDistance(lastPosition, newGpsPosition);
            if (distance < 0.003) { // 3 metros
              console.log('Movimento muito pequeno - ignorando');
              return;
            }
          }

          positionHistoryRef.current.push(newGpsPosition);
          
          // Manter apenas os últimos 1000 pontos
          if (positionHistoryRef.current.length > 1000) {
            positionHistoryRef.current = positionHistoryRef.current.slice(-1000);
          }

          setState(prev => ({
            ...prev,
            position: newGpsPosition,
            accuracy: newGpsPosition.accuracy || 0,
            isHighAccuracy: (newGpsPosition.accuracy || 100) < 20
          }));

          console.log(`GPS atualizado: precisão=${newGpsPosition.accuracy?.toFixed(1)}m, total de pontos=${positionHistoryRef.current.length}`);
        },
        (error) => {
          console.error('GPS Error durante tracking:', error);
          let errorMessage = 'Erro GPS durante rastreamento';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'GPS temporariamente indisponível.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout do GPS - continuando com última posição conhecida.';
              break;
          }
          
          // Não parar o tracking por timeouts ocasionais
          if (error.code !== error.TIMEOUT) {
            setState(prev => ({ 
              ...prev, 
              error: errorMessage 
            }));
          }
        },
        {
          enableHighAccuracy: true, // Alta precisão apenas no tracking contínuo
          timeout: 15000,
          maximumAge: 10000 // Aceitar posições até 10s antigas durante tracking
        }
      );

    } catch (error: any) {
      let errorMessage = 'Erro ao iniciar GPS';
      
      if (error.code === 1) {
        errorMessage = 'Permissão de localização necessária. Por favor, permita o acesso à localização.';
      } else if (error.code === 2) {
        errorMessage = 'GPS indisponível no dispositivo. Verifique se o GPS está ativado.';
      } else if (error.code === 3) {
        errorMessage = 'Timeout do GPS - tente novamente em uma área com melhor sinal.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Erro ao iniciar GPS:', error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isTracking: false
      }));
      hasInitialPosition.current = false;
    }
  }, [isValidPosition]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
    hasInitialPosition.current = false;
  }, []);

  // Auto-inicializar GPS quando o componente for montado
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      console.log('Auto-inicializando GPS...');
      // Aguardar um pouco antes de inicializar
      const timer = setTimeout(() => {
        startTracking();
      }, 1000);
      
      return () => clearTimeout(timer);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startTracking]);

  const getPositionHistory = useCallback(() => {
    return [...positionHistoryRef.current];
  }, []);

  const calculateDistance = useCallback((pos1: GPSPosition, pos2: GPSPosition): number => {
    const R = 6371;
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const calculateTotalDistance = useCallback(() => {
    const history = positionHistoryRef.current;
    if (history.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < history.length; i++) {
      totalDistance += calculateDistance(history[i-1], history[i]);
    }
    return totalDistance;
  }, [calculateDistance]);

  const calculateCurrentSpeed = useCallback(() => {
    const history = positionHistoryRef.current;
    if (history.length < 2) return 0;

    const recent = history.slice(-5);
    if (recent.length < 2) return 0;

    let totalDistance = 0;
    const timeDiff = (recent[recent.length - 1].timestamp - recent[0].timestamp) / 1000;

    for (let i = 1; i < recent.length; i++) {
      totalDistance += calculateDistance(recent[i-1], recent[i]);
    }

    const speedMs = timeDiff > 0 ? (totalDistance * 1000) / timeDiff : 0;
    return Math.max(0, speedMs);
  }, [calculateDistance]);

  return {
    ...state,
    startTracking,
    stopTracking,
    getPositionHistory,
    calculateTotalDistance,
    calculateCurrentSpeed,
    calculateDistance
  };
}
