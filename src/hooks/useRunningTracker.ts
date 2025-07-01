import { useState, useEffect, useRef, useCallback } from 'react';
import { useGPS, GPSPosition } from './useGPS';
import { useCreateActivity } from './useSupabaseActivities';
import { useCreateHealthMetric } from './useHealthMetrics';

export interface RunningData {
  type: 'running';
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
  cadence: number;
  gpsPoints: GPSPosition[];
}

export interface RunningState {
  isActive: boolean;
  isPaused: boolean;
  data: RunningData;
  startTime: number | null;
  pausedTime: number;
}

export function useRunningTracker() {
  const gps = useGPS();
  const createActivity = useCreateActivity();
  const createHealthMetric = useCreateHealthMetric();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityIdRef = useRef<string | null>(null);

  const [state, setState] = useState<RunningState>({
    isActive: false,
    isPaused: false,
    data: {
      type: 'running',
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
      cadence: 170,
      gpsPoints: []
    },
    startTime: null,
    pausedTime: 0
  });

  // Auto-iniciar GPS quando o hook é montado
  useEffect(() => {
    if (!gps.isTracking) {
      gps.startTracking();
    }
  }, []);

  const updateMetrics = useCallback(() => {
    if (!state.isActive || state.isPaused || !gps.position) return;

    const currentTime = Date.now();
    const duration = state.startTime ? Math.floor((currentTime - state.startTime - state.pausedTime) / 1000) : 0;
    const totalDistance = gps.calculateTotalDistance();
    const currentSpeed = gps.calculateCurrentSpeed();
    const avgSpeed = duration > 0 ? (totalDistance * 1000) / duration : 0;
    const positionHistory = gps.getPositionHistory();

    // Calcular elevação
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

    // Simular métricas fisiológicas realistas
    const intensity = Math.min(currentSpeed / 4, 1); // Running intensity based on speed
    const heartRate = Math.round(120 + (intensity * 70) + (Math.random() - 0.5) * 8);
    const cadence = Math.round(170 + (intensity * 10) + (Math.random() - 0.5) * 8);
    const calories = Math.round(duration * 0.15 * (1 + intensity * 0.5));

    const newData: RunningData = {
      type: 'running',
      duration,
      distance: totalDistance,
      avgSpeed,
      maxSpeed: Math.max(state.data.maxSpeed, currentSpeed),
      currentSpeed,
      pace: currentSpeed > 0 ? 1000 / currentSpeed : 0,
      avgPace: avgSpeed > 0 ? 1000 / avgSpeed : 0,
      calories,
      elevationGain,
      heartRate,
      maxHeartRate: Math.max(state.data.maxHeartRate, heartRate),
      cadence,
      gpsPoints: positionHistory
    };

    setState(prev => ({ ...prev, data: newData }));
  }, [state, gps]);

  const startActivity = useCallback(async () => {
    // Aguardar GPS estar pronto
    if (!gps.position) {
      if (!gps.isTracking) {
        await gps.startTracking();
      }
      
      // Aguardar até 10 segundos pelo GPS
      let attempts = 0;
      while (!gps.position && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!gps.position) {
        throw new Error('GPS não está disponível. Verifique se a localização está ativada.');
      }
    }

    activityIdRef.current = `running_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime: Date.now(),
      pausedTime: 0,
      data: {
        ...prev.data,
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
        cadence: 170,
        gpsPoints: []
      }
    }));

    // Iniciar atualização de métricas a cada segundo
    intervalRef.current = setInterval(updateMetrics, 1000);

    console.log('Running activity started:', activityIdRef.current);
  }, [gps, updateMetrics]);

  const pauseActivity = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeActivity = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const stopActivity = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!activityIdRef.current || state.data.duration === 0) {
      // Reset para estado inicial se não houver dados
      setState(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        startTime: null,
        pausedTime: 0
      }));
      return state.data;
    }

    try {
      // Salvar atividade no Supabase
      await createActivity.mutateAsync({
        type: 'running',
        name: `Corrida GPS - ${new Date().toLocaleDateString()}`,
        duration: state.data.duration,
        distance: state.data.distance,
        calories: state.data.calories,
        avg_heart_rate: state.data.heartRate,
        max_heart_rate: state.data.maxHeartRate,
        elevation_gain: Math.round(state.data.elevationGain),
        pace: state.data.avgPace,
        completed_at: new Date().toISOString(),
        gps_data: {
          totalPoints: state.data.gpsPoints.length,
          avgAccuracy: gps.accuracy,
          maxSpeed: state.data.maxSpeed,
          avgSpeed: state.data.avgSpeed
        }
      });

      // Salvar métricas de saúde
      if (state.data.heartRate > 0) {
        await createHealthMetric.mutateAsync({
          metric_type: 'heart_rate_avg',
          value: state.data.heartRate,
          unit: 'bpm',
          recorded_at: new Date().toISOString(),
          source: 'running_tracker',
          device_info: { activity_id: activityIdRef.current, activity_type: 'running' }
        });
      }

      console.log('Running activity saved successfully!');
    } catch (error) {
      console.error('Error saving running activity:', error);
    }

    const finalData = { ...state.data };

    // Reset para estado inicial
    setState({
      isActive: false,
      isPaused: false,
      data: {
        type: 'running',
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
        cadence: 170,
        gpsPoints: []
      },
      startTime: null,
      pausedTime: 0
    });

    activityIdRef.current = null;
    return finalData;
  }, [state.data, createActivity, createHealthMetric, gps]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    gpsState: gps,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    isGPSReady: gps.position !== null && gps.isReady
  };
}