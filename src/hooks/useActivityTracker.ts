
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGPS, GPSPosition } from './useGPS';
import { GPSTracker, ActivityMetrics } from '@/services/GPSTracker';
import { useCreateActivity } from './useSupabaseActivities';

export interface ActivityData {
  type: 'running' | 'cycling' | 'walking';
  duration: number;
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  currentSpeed: number;
  pace: number;
  avgPace: number;
  calories: number;
  elevationGain: number;
  heartRate: number;
  maxHeartRate: number;
  cadence?: number;
  power?: number;
}

export interface ActivityState {
  isActive: boolean;
  isPaused: boolean;
  data: ActivityData;
  startTime: number | null;
  pausedTime: number;
}

export function useActivityTracker(activityType: 'running' | 'cycling' | 'walking') {
  const gps = useGPS();
  const createActivity = useCreateActivity();
  const trackerRef = useRef<GPSTracker | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPositionRef = useRef<GPSPosition | null>(null);

  const [state, setState] = useState<ActivityState>({
    isActive: false,
    isPaused: false,
    data: {
      type: activityType,
      duration: 0,
      distance: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      currentSpeed: 0,
      pace: 0,
      avgPace: 0,
      calories: 0,
      elevationGain: 0,
      heartRate: 120,
      maxHeartRate: 120,
      cadence: activityType === 'cycling' ? 80 : 170,
      power: activityType === 'cycling' ? 200 : undefined
    },
    startTime: null,
    pausedTime: 0
  });

  const calculateCalories = useCallback((duration: number, avgSpeed: number, weight: number = 70) => {
    // Fórmulas baseadas em MET (Metabolic Equivalent of Task)
    let met = 1;
    
    if (activityType === 'running') {
      // METs baseados na velocidade de corrida
      const speedKmh = avgSpeed * 3.6;
      if (speedKmh < 8) met = 8.3;
      else if (speedKmh < 10) met = 9.8;
      else if (speedKmh < 12) met = 11.0;
      else if (speedKmh < 14) met = 12.3;
      else met = 14.5;
    } else if (activityType === 'cycling') {
      const speedKmh = avgSpeed * 3.6;
      if (speedKmh < 16) met = 6.8;
      else if (speedKmh < 20) met = 8.5;
      else if (speedKmh < 25) met = 10.0;
      else if (speedKmh < 30) met = 12.0;
      else met = 15.8;
    } else { // walking
      const speedKmh = avgSpeed * 3.6;
      if (speedKmh < 4) met = 3.0;
      else if (speedKmh < 5) met = 3.5;
      else if (speedKmh < 6) met = 4.3;
      else met = 5.0;
    }

    return Math.round(met * weight * (duration / 3600));
  }, [activityType]);

  const generateHeartRate = useCallback((baseHR: number, intensity: number) => {
    // Simula variação natural de frequência cardíaca
    const variation = (Math.random() - 0.5) * 10;
    const intensityFactor = 1 + (intensity * 0.5);
    return Math.round(baseHR * intensityFactor + variation);
  }, []);

  const generateCadence = useCallback((speed: number) => {
    if (activityType === 'running') {
      // Cadência de corrida (passos por minuto)
      const basecadence = 170;
      const speedFactor = speed * 3.6 / 10; // Normalizar velocidade
      return Math.round(basecadence + (speedFactor * 10) + (Math.random() - 0.5) * 10);
    } else if (activityType === 'cycling') {
      // Cadência de pedalada (RPM)
      const baseCadence = 80;
      const speedFactor = speed * 3.6 / 25; // Normalizar velocidade
      return Math.round(baseCadence + (speedFactor * 20) + (Math.random() - 0.5) * 10);
    }
    return undefined;
  }, [activityType]);

  const generatePower = useCallback((speed: number, weight: number = 70) => {
    if (activityType !== 'cycling') return undefined;
    
    // Estimativa simplificada de potência para ciclismo
    const speedKmh = speed * 3.6;
    const airResistance = 0.5 * 1.2 * 0.3 * Math.pow(speedKmh / 3.6, 2);
    const rollingResistance = 0.004 * weight * 9.81;
    const power = (airResistance + rollingResistance) * (speedKmh / 3.6);
    
    return Math.round(power * 1.2 + (Math.random() - 0.5) * 20); // Adicionar variação
  }, [activityType]);

  const updateMetrics = useCallback(async () => {
    if (!state.isActive || state.isPaused || !gps.position) return;

    const currentTime = Date.now();
    const duration = state.startTime ? Math.floor((currentTime - state.startTime - state.pausedTime) / 1000) : 0;
    const totalDistance = gps.calculateTotalDistance();
    const currentSpeed = gps.calculateCurrentSpeed();
    const avgSpeed = duration > 0 ? (totalDistance * 1000) / duration : 0;

    // Calcular pace (segundos por km)
    const currentPace = currentSpeed > 0 ? 1000 / currentSpeed : 0;
    const avgPace = avgSpeed > 0 ? 1000 / avgSpeed : 0;

    // Calcular elevação
    const positionHistory = gps.getPositionHistory();
    let elevationGain = 0;
    if (positionHistory.length > 1) {
      for (let i = 1; i < positionHistory.length; i++) {
        const prev = positionHistory[i - 1];
        const curr = positionHistory[i];
        if (prev.altitude && curr.altitude && curr.altitude > prev.altitude) {
          elevationGain += curr.altitude - prev.altitude;
        }
      }
    }

    // Simular métricas fisiológicas
    const intensity = Math.min(currentSpeed / 5, 1); // Normalizar intensidade
    const heartRate = generateHeartRate(120, intensity);
    const cadence = generateCadence(currentSpeed);
    const power = generatePower(currentSpeed);

    const newData: ActivityData = {
      ...state.data,
      duration,
      distance: totalDistance,
      avgSpeed,
      maxSpeed: Math.max(state.data.maxSpeed, currentSpeed),
      currentSpeed,
      pace: currentPace,
      avgPace,
      calories: calculateCalories(duration, avgSpeed),
      elevationGain,
      heartRate,
      maxHeartRate: Math.max(state.data.maxHeartRate, heartRate),
      cadence,
      power
    };

    setState(prev => ({ ...prev, data: newData }));

    // Adicionar ponto GPS e métricas ao tracker
    if (trackerRef.current && gps.position) {
      await trackerRef.current.addGPSPoint(gps.position);
      
      const metrics: ActivityMetrics = {
        heartRate,
        cadence,
        power,
        speed: currentSpeed,
        pace: currentPace,
        distance: totalDistance,
        elevation: elevationGain,
        calories: newData.calories
      };
      
      await trackerRef.current.addMetrics(metrics);
    }
  }, [state, gps, calculateCalories, generateHeartRate, generateCadence, generatePower]);

  const startActivity = useCallback(async () => {
    if (!gps.position) {
      await gps.startTracking();
      return;
    }

    // Criar uma nova atividade no banco
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    trackerRef.current = new GPSTracker(activityId);
    await trackerRef.current.startRecording();

    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      pausedTime: 0
    }));

    // Iniciar atualização de métricas
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateMetrics, 1000);

    console.log('Atividade iniciada:', activityType, activityId);
  }, [gps, activityType, updateMetrics]);

  const pauseActivity = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeActivity = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateMetrics, 1000);
  }, [updateMetrics]);

  const stopActivity = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (trackerRef.current) {
      await trackerRef.current.stopRecording();
    }

    // Salvar atividade final
    try {
      await createActivity.mutateAsync({
        type: activityType,
        name: `${activityType === 'running' ? 'Corrida' : activityType === 'cycling' ? 'Ciclismo' : 'Caminhada'} GPS`,
        duration: state.data.duration,
        distance: state.data.distance,
        calories: state.data.calories,
        avg_heart_rate: state.data.heartRate,
        max_heart_rate: state.data.maxHeartRate,
        elevation_gain: Math.round(state.data.elevationGain),
        pace: state.data.avgPace,
        completed_at: new Date().toISOString(),
        gps_data: {
          totalPoints: gps.getPositionHistory().length,
          avgAccuracy: gps.accuracy,
          maxSpeed: state.data.maxSpeed,
          avgSpeed: state.data.avgSpeed
        },
        route_summary: {
          startLocation: gps.getPositionHistory()[0],
          endLocation: gps.getPositionHistory()[gps.getPositionHistory().length - 1],
          waypoints: gps.getPositionHistory().length
        }
      });
      
      console.log('Atividade salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
    }

    // Reset state
    setState({
      isActive: false,
      isPaused: false,
      data: {
        type: activityType,
        duration: 0,
        distance: 0,
        avgSpeed: 0,
        maxSpeed: 0,
        currentSpeed: 0,
        pace: 0,
        avgPace: 0,
        calories: 0,
        elevationGain: 0,
        heartRate: 120,
        maxHeartRate: 120,
        cadence: activityType === 'cycling' ? 80 : 170,
        power: activityType === 'cycling' ? 200 : undefined
      },
      startTime: null,
      pausedTime: 0
    });

    gps.stopTracking();
  }, [state.data, activityType, createActivity, gps]);

  // Auto-start GPS quando componente for montado
  useEffect(() => {
    if (!gps.isTracking) {
      gps.startTracking();
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (trackerRef.current) trackerRef.current.stopRecording();
    };
  }, []);

  return {
    ...state,
    gpsState: gps,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    isGPSReady: gps.position !== null && gps.isHighAccuracy
  };
}
