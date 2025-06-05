
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGPS, GPSPosition } from './useGPS';
import { useCreateActivity } from './useSupabaseActivities';
import { useCreateHealthMetric } from './useHealthMetrics';
import { useSetCache } from './useOfflineCache';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedActivityData {
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
  gpsPoints: GPSPosition[];
  metrics: ActivityMetric[];
  segments: ActivitySegment[];
}

interface ActivityMetric {
  timestamp: string;
  heart_rate?: number;
  cadence?: number;
  power?: number;
  speed: number;
  pace: number;
  distance_total: number;
  elevation_total: number;
  calories_total: number;
  temperature?: number;
}

interface ActivitySegment {
  segment_type: string;
  start_point?: GPSPosition;
  end_point?: GPSPosition;
  distance: number;
  duration: number;
  elevation_gain: number;
  elevation_loss: number;
  avg_speed: number;
  max_speed: number;
  avg_pace: number;
}

export function useEnhancedActivityTracker(activityType: 'running' | 'cycling' | 'walking') {
  const gps = useGPS();
  const createActivity = useCreateActivity();
  const createHealthMetric = useCreateHealthMetric();
  const setCache = useSetCache();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activityIdRef = useRef<string | null>(null);
  const metricsRef = useRef<ActivityMetric[]>([]);
  const segmentsRef = useRef<ActivitySegment[]>([]);

  const [state, setState] = useState({
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
      power: activityType === 'cycling' ? 200 : undefined,
      gpsPoints: [],
      metrics: [],
      segments: []
    } as EnhancedActivityData,
    startTime: null as number | null,
    pausedTime: 0
  });

  const saveGPSPoint = useCallback(async (activityId: string, position: GPSPosition) => {
    try {
      await supabase
        .from('activity_gps_points')
        .insert({
          activity_id: activityId,
          latitude: position.latitude,
          longitude: position.longitude,
          altitude: position.altitude,
          accuracy: position.accuracy,
          speed: position.speed,
          heading: position.heading,
          timestamp: new Date(position.timestamp).toISOString()
        });
    } catch (error) {
      console.error('Error saving GPS point:', error);
    }
  }, []);

  const saveMetric = useCallback(async (activityId: string, metric: ActivityMetric) => {
    try {
      await supabase
        .from('activity_metrics')
        .insert({
          activity_id: activityId,
          timestamp: metric.timestamp,
          heart_rate: metric.heart_rate,
          cadence: metric.cadence,
          power: metric.power,
          speed: metric.speed,
          pace: metric.pace,
          distance_total: metric.distance_total,
          elevation_total: metric.elevation_total,
          calories_total: metric.calories_total,
          temperature: metric.temperature
        });
    } catch (error) {
      console.error('Error saving metric:', error);
    }
  }, []);

  const detectSegment = useCallback((
    positionHistory: GPSPosition[], 
    currentMetrics: ActivityMetric[]
  ): ActivitySegment | null => {
    if (positionHistory.length < 10) return null;

    const recentPositions = positionHistory.slice(-10);
    const speeds = recentPositions.map(p => p.speed || 0);
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    
    // Detectar paradas (velocidade < 0.5 m/s por mais de 30 segundos)
    const isResting = avgSpeed < 0.5;
    
    // Detectar subidas/descidas significativas
    const elevationChange = recentPositions[recentPositions.length - 1].altitude! - recentPositions[0].altitude!;
    const isClimbing = elevationChange > 10;
    const isDescending = elevationChange < -10;

    let segmentType = 'normal';
    if (isResting) segmentType = 'rest';
    else if (isClimbing) segmentType = 'climb';
    else if (isDescending) segmentType = 'descent';
    else if (avgSpeed > 5) segmentType = 'sprint';

    return {
      segment_type: segmentType,
      start_point: recentPositions[0],
      end_point: recentPositions[recentPositions.length - 1],
      distance: gps.calculateDistance(recentPositions[0], recentPositions[recentPositions.length - 1]),
      duration: (recentPositions[recentPositions.length - 1].timestamp - recentPositions[0].timestamp) / 1000,
      elevation_gain: Math.max(0, elevationChange),
      elevation_loss: Math.max(0, -elevationChange),
      avg_speed: avgSpeed,
      max_speed: Math.max(...speeds),
      avg_pace: avgSpeed > 0 ? 1000 / avgSpeed : 0
    };
  }, [gps]);

  const updateMetrics = useCallback(async () => {
    if (!state.isActive || state.isPaused || !gps.position || !activityIdRef.current) return;

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

    // Simular métricas fisiológicas melhoradas
    const intensity = Math.min(currentSpeed / 5, 1);
    const heartRate = Math.round(120 + (intensity * 60) + (Math.random() - 0.5) * 10);
    const cadence = activityType === 'cycling' ? 
      Math.round(80 + (intensity * 20) + (Math.random() - 0.5) * 10) :
      Math.round(170 + (intensity * 10) + (Math.random() - 0.5) * 10);
    const power = activityType === 'cycling' ? 
      Math.round(200 + (intensity * 100) + (Math.random() - 0.5) * 30) : undefined;

    // Criar métrica atual
    const currentMetric: ActivityMetric = {
      timestamp: new Date().toISOString(),
      heart_rate: heartRate,
      cadence,
      power,
      speed: currentSpeed,
      pace: currentSpeed > 0 ? 1000 / currentSpeed : 0,
      distance_total: totalDistance,
      elevation_total: elevationGain,
      calories_total: Math.round(duration * 0.2 * (1 + intensity)),
      temperature: 22 + Math.random() * 6
    };

    metricsRef.current.push(currentMetric);

    // Salvar GPS point e métrica
    await saveGPSPoint(activityIdRef.current, gps.position);
    await saveMetric(activityIdRef.current, currentMetric);

    // Detectar segmentos
    const newSegment = detectSegment(positionHistory, metricsRef.current);
    if (newSegment && segmentsRef.current.length === 0 || 
        (segmentsRef.current.length > 0 && 
         segmentsRef.current[segmentsRef.current.length - 1].segment_type !== newSegment.segment_type)) {
      segmentsRef.current.push(newSegment);
    }

    // Atualizar state
    const newData: EnhancedActivityData = {
      ...state.data,
      duration,
      distance: totalDistance,
      avgSpeed,
      maxSpeed: Math.max(state.data.maxSpeed, currentSpeed),
      currentSpeed,
      pace: currentSpeed > 0 ? 1000 / currentSpeed : 0,
      avgPace: avgSpeed > 0 ? 1000 / avgSpeed : 0,
      calories: currentMetric.calories_total,
      elevationGain,
      heartRate,
      maxHeartRate: Math.max(state.data.maxHeartRate, heartRate),
      cadence,
      power,
      gpsPoints: positionHistory,
      metrics: [...metricsRef.current],
      segments: [...segmentsRef.current]
    };

    setState(prev => ({ ...prev, data: newData }));

    // Cache dos dados em tempo real
    await setCache.mutateAsync({
      cacheKey: `activity_${activityIdRef.current}`,
      data: newData,
      expiresInMinutes: 240 // 4 horas
    });

  }, [state, gps, saveGPSPoint, saveMetric, detectSegment, setCache, activityType]);

  const startActivity = useCallback(async () => {
    // Iniciar GPS primeiro se não estiver ativo
    if (!gps.isTracking) {
      console.log('Iniciando GPS para a atividade...');
      await gps.startTracking();
      
      // Aguardar um pouco para o GPS obter posição
      let attempts = 0;
      while (!gps.position && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      
      if (!gps.position) {
        throw new Error('Não foi possível obter posição GPS');
      }
    }

    activityIdRef.current = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    metricsRef.current = [];
    segmentsRef.current = [];

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

    console.log('Enhanced activity started:', activityType, activityIdRef.current);
  }, [gps, activityType, updateMetrics]);

  const stopActivity = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!activityIdRef.current) return;

    // Salvar segmentos finais
    for (const segment of segmentsRef.current) {
      try {
        await supabase
          .from('activity_segments')
          .insert({
            activity_id: activityIdRef.current,
            segment_type: segment.segment_type,
            distance: segment.distance,
            duration: segment.duration,
            elevation_gain: segment.elevation_gain,
            elevation_loss: segment.elevation_loss,
            avg_speed: segment.avg_speed,
            max_speed: segment.max_speed,
            avg_pace: segment.avg_pace
          });
      } catch (error) {
        console.error('Error saving segment:', error);
      }
    }

    // Salvar atividade principal
    try {
      await createActivity.mutateAsync({
        type: activityType,
        name: `${activityType === 'running' ? 'Corrida' : activityType === 'cycling' ? 'Ciclismo' : 'Caminhada'} GPS Avançada`,
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
          avgSpeed: state.data.avgSpeed,
          segments: segmentsRef.current.length,
          metrics: metricsRef.current.length
        }
      });

      // Salvar métricas de saúde
      if (state.data.heartRate > 0) {
        await createHealthMetric.mutateAsync({
          metric_type: 'heart_rate_avg',
          value: state.data.heartRate,
          unit: 'bpm',
          recorded_at: new Date().toISOString(),
          source: 'activity_tracker',
          device_info: { activity_id: activityIdRef.current, activity_type: activityType }
        });
      }

      console.log('Enhanced activity saved successfully!');
    } catch (error) {
      console.error('Error saving enhanced activity:', error);
    }

    // Reset
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
        power: activityType === 'cycling' ? 200 : undefined,
        gpsPoints: [],
        metrics: [],
        segments: []
      },
      startTime: null,
      pausedTime: 0
    });

    activityIdRef.current = null;
    gps.stopTracking();
  }, [state.data, activityType, createActivity, createHealthMetric, gps]);

  // Cleanup - remover auto-start do GPS
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    ...state,
    gpsState: gps,
    startActivity,
    pauseActivity: () => setState(prev => ({ ...prev, isPaused: true })),
    resumeActivity: () => setState(prev => ({ ...prev, isPaused: false })),
    stopActivity,
    isGPSReady: gps.position !== null && gps.isHighAccuracy
  };
}
