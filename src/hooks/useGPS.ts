
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
}

export function useGPS() {
  const [state, setState] = useState<GPSState>({
    position: null,
    isTracking: false,
    error: null,
    accuracy: 0,
    isHighAccuracy: false
  });

  const watchIdRef = useRef<number | null>(null);
  const positionHistoryRef = useRef<GPSPosition[]>([]);

  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'GPS não está disponível neste dispositivo' }));
      return;
    }

    try {
      // Primeiro, obter permissão e posição inicial
      const initialPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
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
        accuracy: initialPosition.coords.accuracy,
        isHighAccuracy: initialPosition.coords.accuracy < 10
      }));

      positionHistoryRef.current = [gpsPosition];

      // Iniciar rastreamento contínuo
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newGpsPosition: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
            timestamp: Date.now()
          };

          // Filtrar posições com baixa precisão
          if (position.coords.accuracy > 50) return;

          // Adicionar ao histórico
          positionHistoryRef.current.push(newGpsPosition);
          
          // Manter apenas as últimas 100 posições para performance
          if (positionHistoryRef.current.length > 100) {
            positionHistoryRef.current = positionHistoryRef.current.slice(-100);
          }

          setState(prev => ({
            ...prev,
            position: newGpsPosition,
            accuracy: position.coords.accuracy,
            isHighAccuracy: position.coords.accuracy < 10
          }));
        },
        (error) => {
          console.error('GPS Error:', error);
          setState(prev => ({ 
            ...prev, 
            error: `Erro GPS: ${error.message}` 
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      );

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: `Erro ao iniciar GPS: ${error.message}` 
      }));
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
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

    const recent = history.slice(-5); // Últimas 5 posições
    if (recent.length < 2) return 0;

    let totalDistance = 0;
    const timeDiff = (recent[recent.length - 1].timestamp - recent[0].timestamp) / 1000; // em segundos

    for (let i = 1; i < recent.length; i++) {
      totalDistance += calculateDistance(recent[i-1], recent[i]);
    }

    return timeDiff > 0 ? (totalDistance * 1000) / timeDiff : 0; // m/s
  }, [calculateDistance]);

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
