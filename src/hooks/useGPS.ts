
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
    
    if (coords.accuracy > 500) {
      console.warn(`GPS precisão muito baixa: ${coords.accuracy}m - rejeitando posição`);
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
      // Primeiro, obter posição inicial
      const initialPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout ao obter posição inicial'));
        }, 15000);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            if (isValidPosition(position)) {
              resolve(position);
            } else {
              reject(new Error('Posição GPS inválida'));
            }
          }, 
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          }, 
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 60000
          }
        );
      });

      const gpsPosition: GPSPosition = {
        latitude: initialPosition.coords.latitude,
        longitude: initialPosition.coords.longitude,
        altitude: initialPosition.coords.altitude || undefined,
        accuracy: Math.min(initialPosition.coords.accuracy, 100),
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
      console.log(`GPS inicializado: lat=${gpsPosition.latitude}, lng=${gpsPosition.longitude}, precisão=${gpsPosition.accuracy?.toFixed(1)}m`);

      // Iniciar rastreamento contínuo
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (!isValidPosition(position)) {
            console.warn('Posição GPS inválida recebida - ignorando');
            return;
          }

          const newGpsPosition: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: Math.min(position.coords.accuracy, 100),
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: Date.now()
          };

          // Filtrar posições com baixa precisão
          if ((newGpsPosition.accuracy || 100) > 50) {
            console.warn(`GPS com baixa precisão: ${newGpsPosition.accuracy}m - ignorando`);
            return;
          }

          // Filtrar movimentos muito pequenos
          const lastPosition = positionHistoryRef.current[positionHistoryRef.current.length - 1];
          if (lastPosition) {
            const distance = calculateDistance(lastPosition, newGpsPosition);
            if (distance < 0.003) {
              return;
            }
          }

          positionHistoryRef.current.push(newGpsPosition);
          
          if (positionHistoryRef.current.length > 100) {
            positionHistoryRef.current = positionHistoryRef.current.slice(-100);
          }

          setState(prev => ({
            ...prev,
            position: newGpsPosition,
            accuracy: newGpsPosition.accuracy || 0,
            isHighAccuracy: (newGpsPosition.accuracy || 100) < 20
          }));

          console.log(`GPS atualizado: precisão=${newGpsPosition.accuracy?.toFixed(1)}m`);
        },
        (error) => {
          console.error('GPS Error:', error);
          let errorMessage = 'Erro GPS desconhecido';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Verifique se o GPS está ativado.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout do GPS - tentando novamente...';
              break;
          }
          
          setState(prev => ({ 
            ...prev, 
            error: errorMessage 
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 5000
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
    }
  }, [isValidPosition]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  // Auto-inicializar GPS quando o componente for montado
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      console.log('Auto-inicializando GPS...');
      startTracking();
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
