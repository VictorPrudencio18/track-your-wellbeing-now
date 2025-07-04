
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
  isReady: boolean;
  getPositionHistory: () => GPSPosition[];
  calculateTotalDistance: () => number;
  calculateCurrentSpeed: () => number;
  calculateDistance: (pos1: GPSPosition, pos2: GPSPosition) => number;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

export function useGPS(autoStart: boolean = false) {
  const [state, setState] = useState<Omit<GPSState, 'getPositionHistory' | 'calculateTotalDistance' | 'calculateCurrentSpeed' | 'calculateDistance' | 'startTracking' | 'stopTracking'>>({
    position: null,
    isTracking: false,
    error: null,
    accuracy: 0,
    isHighAccuracy: false,
    isReady: false
  });

  const watchIdRef = useRef<number | null>(null);
  const positionHistoryRef = useRef<GPSPosition[]>([]);
  const lastUpdateRef = useRef<number>(0);

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
    
    if (coords.accuracy && coords.accuracy > 200) {
      console.warn(`GPS precisão baixa: ${coords.accuracy}m - mas aceitando posição`);
    }
    
    return true;
  }, []);

  const updatePosition = useCallback((position: GeolocationPosition) => {
    if (!isValidPosition(position)) {
      console.warn('Posição GPS inválida recebida - ignorando');
      return;
    }

    const now = Date.now();
    
    // Evitar atualizações muito frequentes (mínimo 1 segundo)
    if (now - lastUpdateRef.current < 1000) {
      return;
    }

    const newGpsPosition: GPSPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude || undefined,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined,
      timestamp: now
    };

    // Filtrar posições muito próximas para evitar ruído
    const lastPosition = positionHistoryRef.current[positionHistoryRef.current.length - 1];
    if (lastPosition && (newGpsPosition.accuracy || 100) < 30) {
      const distance = calculateDistance(lastPosition, newGpsPosition);
      if (distance < 0.002) { // menos de 2 metros
        return;
      }
    }

    positionHistoryRef.current.push(newGpsPosition);
    lastUpdateRef.current = now;
    
    // Manter histórico limitado
    if (positionHistoryRef.current.length > 500) {
      positionHistoryRef.current = positionHistoryRef.current.slice(-500);
    }

    setState(prev => ({
      ...prev,
      position: newGpsPosition,
      accuracy: newGpsPosition.accuracy || 0,
      isHighAccuracy: (newGpsPosition.accuracy || 100) < 50,
      isReady: true,
      error: null
    }));

    console.log(`GPS atualizado: lat=${newGpsPosition.latitude.toFixed(6)}, lng=${newGpsPosition.longitude.toFixed(6)}, precisão=${newGpsPosition.accuracy?.toFixed(1)}m, pontos=${positionHistoryRef.current.length}`);
  }, [isValidPosition]);

  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'GPS não está disponível neste dispositivo', isReady: false }));
      return;
    }

    if (state.isTracking) {
      console.log('GPS já está em rastreamento');
      return;
    }

    console.log('Iniciando rastreamento GPS...');
    setState(prev => ({ ...prev, error: null, isTracking: true, isReady: false }));

    try {
      // Obter posição inicial
      const initialPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout ao obter posição inicial - verifique se o GPS está ativado'));
        }, 15000);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            console.log(`Posição GPS inicial obtida: lat=${position.coords.latitude.toFixed(6)}, lng=${position.coords.longitude.toFixed(6)}, precisão=${position.coords.accuracy?.toFixed(1)}m`);
            
            if (isValidPosition(position)) {
              resolve(position);
            } else {
              reject(new Error('Posição GPS inicial inválida'));
            }
          }, 
          (error) => {
            clearTimeout(timeoutId);
            console.error('Erro getCurrentPosition:', error);
            
            let errorMessage = 'Erro ao obter localização';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'GPS indisponível. Verifique se o GPS está ativado.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Timeout do GPS. Tente novamente em uma área com melhor sinal.';
                break;
            }
            reject(new Error(errorMessage));
          }, 
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 30000
          }
        );
      });

      // Processar posição inicial
      updatePosition(initialPosition);
      console.log('GPS inicializado e pronto');

      // Iniciar rastreamento contínuo
      watchIdRef.current = navigator.geolocation.watchPosition(
        updatePosition,
        (error) => {
          console.error('GPS Error durante tracking:', error);
          
          if (error.code !== error.TIMEOUT) {
            let errorMessage = 'Erro GPS durante rastreamento';
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permissão de localização foi revogada.';
                setState(prev => ({ ...prev, isTracking: false, isReady: false }));
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'GPS temporariamente indisponível - continuando...';
                break;
            }
            
            setState(prev => ({ ...prev, error: errorMessage }));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );

    } catch (error: any) {
      console.error('Erro ao iniciar GPS:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Erro desconhecido ao iniciar GPS',
        isTracking: false,
        isReady: false
      }));
    }
  }, [isValidPosition, state.isTracking, updatePosition]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ 
      ...prev, 
      isTracking: false,
      error: null,
      isReady: false
    }));
    console.log('GPS tracking parado');
  }, []);

  const getPositionHistory = useCallback(() => {
    return [...positionHistoryRef.current];
  }, []);

  const calculateDistance = useCallback((pos1: GPSPosition, pos2: GPSPosition): number => {
    const R = 6371; // Raio da Terra em km
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

    const recent = history.slice(-3);
    if (recent.length < 2) return 0;

    let totalDistance = 0;
    const timeDiff = (recent[recent.length - 1].timestamp - recent[0].timestamp) / 1000;

    for (let i = 1; i < recent.length; i++) {
      totalDistance += calculateDistance(recent[i-1], recent[i]);
    }

    const speedMs = timeDiff > 0 ? (totalDistance * 1000) / timeDiff : 0;
    return Math.max(0, speedMs);
  }, [calculateDistance]);

  // Auto-start GPS se solicitado
  useEffect(() => {
    if (autoStart && !state.isTracking && !state.isReady) {
      console.log('Auto-iniciando GPS...');
      startTracking();
    }
  }, [autoStart, state.isTracking, state.isReady, startTracking]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

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
