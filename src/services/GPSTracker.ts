
import { supabase } from '@/integrations/supabase/client';
import { GPSPosition } from '@/hooks/useGPS';

export interface ActivityMetrics {
  heartRate?: number;
  cadence?: number;
  power?: number;
  speed: number;
  pace: number;
  distance: number;
  elevation: number;
  calories: number;
  temperature?: number;
}

export interface ActivitySegment {
  type: 'climb' | 'descent' | 'sprint' | 'interval' | 'flat';
  startTime: number;
  endTime: number;
  startPosition: GPSPosition;
  endPosition: GPSPosition;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  avgSpeed: number;
  maxSpeed: number;
  avgPace: number;
}

export class GPSTracker {
  private activityId: string;
  private gpsPoints: GPSPosition[] = [];
  private metrics: ActivityMetrics[] = [];
  private segments: ActivitySegment[] = [];
  private isRecording = false;
  private lastSaveTime = 0;
  private saveInterval = 10000; // Salvar a cada 10 segundos

  constructor(activityId: string) {
    this.activityId = activityId;
  }

  async startRecording() {
    this.isRecording = true;
    this.gpsPoints = [];
    this.metrics = [];
    this.segments = [];
    console.log('GPS Tracker iniciado para atividade:', this.activityId);
  }

  async stopRecording() {
    this.isRecording = false;
    await this.saveAllData();
    console.log('GPS Tracker parado. Total de pontos:', this.gpsPoints.length);
  }

  async addGPSPoint(position: GPSPosition) {
    if (!this.isRecording) return;

    this.gpsPoints.push(position);
    
    // Auto-save a cada intervalo
    const now = Date.now();
    if (now - this.lastSaveTime > this.saveInterval) {
      await this.saveGPSPoints();
      this.lastSaveTime = now;
    }
  }

  async addMetrics(metrics: ActivityMetrics, timestamp: number = Date.now()) {
    if (!this.isRecording) return;

    this.metrics.push({
      ...metrics,
      timestamp
    } as any);
  }

  calculateElevationGain(): number {
    if (this.gpsPoints.length < 2) return 0;
    
    let gain = 0;
    for (let i = 1; i < this.gpsPoints.length; i++) {
      const prev = this.gpsPoints[i - 1];
      const curr = this.gpsPoints[i];
      
      if (prev.altitude && curr.altitude && curr.altitude > prev.altitude) {
        gain += curr.altitude - prev.altitude;
      }
    }
    return gain;
  }

  calculateTotalDistance(): number {
    if (this.gpsPoints.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < this.gpsPoints.length; i++) {
      distance += this.calculateDistance(this.gpsPoints[i - 1], this.gpsPoints[i]);
    }
    return distance;
  }

  calculateAverageSpeed(): number {
    if (this.gpsPoints.length < 2) return 0;

    const totalDistance = this.calculateTotalDistance();
    const timeSpan = (this.gpsPoints[this.gpsPoints.length - 1].timestamp - this.gpsPoints[0].timestamp) / 1000;
    
    return timeSpan > 0 ? (totalDistance * 1000) / timeSpan : 0; // m/s
  }

  calculateCurrentPace(): number {
    if (this.gpsPoints.length < 2) return 0;

    const recentPoints = this.gpsPoints.slice(-10); // Últimos 10 pontos
    if (recentPoints.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < recentPoints.length; i++) {
      distance += this.calculateDistance(recentPoints[i - 1], recentPoints[i]);
    }

    const timeSpan = (recentPoints[recentPoints.length - 1].timestamp - recentPoints[0].timestamp) / 1000;
    const speed = timeSpan > 0 ? (distance * 1000) / timeSpan : 0; // m/s
    
    return speed > 0 ? 1000 / speed : 0; // segundos por km
  }

  detectSegments(): ActivitySegment[] {
    if (this.gpsPoints.length < 10) return [];

    const segments: ActivitySegment[] = [];
    let currentSegmentStart = 0;
    let currentSegmentType: ActivitySegment['type'] = 'flat';

    for (let i = 5; i < this.gpsPoints.length - 5; i++) {
      const elevationChange = this.calculateElevationChange(i - 5, i + 5);
      const speed = this.calculateSpeedAtIndex(i);

      let newSegmentType: ActivitySegment['type'] = 'flat';
      
      if (elevationChange > 2) {
        newSegmentType = 'climb';
      } else if (elevationChange < -2) {
        newSegmentType = 'descent';
      } else if (speed > this.calculateAverageSpeed() * 1.3) {
        newSegmentType = 'sprint';
      }

      if (newSegmentType !== currentSegmentType && i - currentSegmentStart > 10) {
        // Finalizar segmento anterior
        if (currentSegmentStart > 0) {
          const segment = this.createSegment(currentSegmentStart, i - 1, currentSegmentType);
          segments.push(segment);
        }
        
        currentSegmentStart = i;
        currentSegmentType = newSegmentType;
      }
    }

    return segments;
  }

  private calculateDistance(pos1: GPSPosition, pos2: GPSPosition): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
    const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateElevationChange(startIndex: number, endIndex: number): number {
    const start = this.gpsPoints[startIndex];
    const end = this.gpsPoints[endIndex];
    
    if (!start.altitude || !end.altitude) return 0;
    return end.altitude - start.altitude;
  }

  private calculateSpeedAtIndex(index: number): number {
    if (index < 2 || index >= this.gpsPoints.length - 2) return 0;

    const before = this.gpsPoints[index - 2];
    const after = this.gpsPoints[index + 2];
    const distance = this.calculateDistance(before, after);
    const timeSpan = (after.timestamp - before.timestamp) / 1000;

    return timeSpan > 0 ? (distance * 1000) / timeSpan : 0;
  }

  private createSegment(startIndex: number, endIndex: number, type: ActivitySegment['type']): ActivitySegment {
    const startPoint = this.gpsPoints[startIndex];
    const endPoint = this.gpsPoints[endIndex];
    
    let distance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    let maxSpeed = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    for (let i = startIndex + 1; i <= endIndex; i++) {
      distance += this.calculateDistance(this.gpsPoints[i - 1], this.gpsPoints[i]);
      
      const speed = this.calculateSpeedAtIndex(i);
      if (speed > maxSpeed) maxSpeed = speed;
      totalSpeed += speed;
      speedCount++;

      if (this.gpsPoints[i - 1].altitude && this.gpsPoints[i].altitude) {
        const elevChange = this.gpsPoints[i].altitude! - this.gpsPoints[i - 1].altitude!;
        if (elevChange > 0) elevationGain += elevChange;
        else elevationLoss += Math.abs(elevChange);
      }
    }

    const avgSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
    const duration = (endPoint.timestamp - startPoint.timestamp) / 1000;
    const avgPace = avgSpeed > 0 ? 1000 / avgSpeed : 0;

    return {
      type,
      startTime: startPoint.timestamp,
      endTime: endPoint.timestamp,
      startPosition: startPoint,
      endPosition: endPoint,
      distance,
      elevationGain,
      elevationLoss,
      avgSpeed,
      maxSpeed,
      avgPace
    };
  }

  private async saveGPSPoints() {
    if (this.gpsPoints.length === 0) return;

    try {
      const pointsToSave = this.gpsPoints.map(point => ({
        activity_id: this.activityId,
        latitude: point.latitude,
        longitude: point.longitude,
        altitude: point.altitude,
        accuracy: point.accuracy,
        speed: point.speed,
        heading: point.heading,
        timestamp: new Date(point.timestamp).toISOString()
      }));

      const { error } = await supabase
        .from('activity_gps_points')
        .insert(pointsToSave);

      if (error) {
        console.error('Erro ao salvar pontos GPS:', error);
      } else {
        console.log('Pontos GPS salvos:', pointsToSave.length);
      }
    } catch (error) {
      console.error('Erro ao salvar pontos GPS:', error);
    }
  }

  private async saveMetrics() {
    if (this.metrics.length === 0) return;

    try {
      const metricsToSave = this.metrics.map(metric => ({
        activity_id: this.activityId,
        timestamp: new Date((metric as any).timestamp).toISOString(),
        heart_rate: metric.heartRate,
        cadence: metric.cadence,
        power: metric.power,
        speed: metric.speed,
        pace: metric.pace,
        distance_total: metric.distance,
        elevation_total: metric.elevation,
        calories_total: metric.calories,
        temperature: metric.temperature
      }));

      const { error } = await supabase
        .from('activity_metrics')
        .insert(metricsToSave);

      if (error) {
        console.error('Erro ao salvar métricas:', error);
      } else {
        console.log('Métricas salvas:', metricsToSave.length);
      }
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
    }
  }

  private async saveSegments() {
    const segments = this.detectSegments();
    if (segments.length === 0) return;

    try {
      const segmentsToSave = segments.map(segment => ({
        activity_id: this.activityId,
        segment_type: segment.type,
        distance: segment.distance,
        elevation_gain: segment.elevationGain,
        elevation_loss: segment.elevationLoss,
        avg_speed: segment.avgSpeed,
        max_speed: segment.maxSpeed,
        avg_pace: segment.avgPace,
        duration: Math.round((segment.endTime - segment.startTime) / 1000)
      }));

      const { error } = await supabase
        .from('activity_segments')
        .insert(segmentsToSave);

      if (error) {
        console.error('Erro ao salvar segmentos:', error);
      } else {
        console.log('Segmentos salvos:', segmentsToSave.length);
      }
    } catch (error) {
      console.error('Erro ao salvar segmentos:', error);
    }
  }

  private async saveAllData() {
    await Promise.all([
      this.saveGPSPoints(),
      this.saveMetrics(),
      this.saveSegments()
    ]);
  }
}
