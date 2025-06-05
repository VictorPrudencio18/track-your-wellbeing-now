import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Activity {
  id: string;
  type: 'run' | 'walk' | 'cycle' | 'yoga' | 'swim' | 'gym' | 'dance' | 'meditation';
  name: string;
  duration: number; // em minutos
  distance?: number; // em km
  calories: number;
  date: Date;
  notes?: string;
  heartRate?: {
    avg: number;
    max: number;
    zones: { zone: string; time: number }[];
  };
  gpsData?: { lat: number; lng: number; timestamp: Date }[];
}

export interface HealthMetric {
  id: string;
  type: 'weight' | 'sleep' | 'heartRate' | 'bloodPressure' | 'hydration' | 'mood';
  value: number | { systolic: number; diastolic: number } | { hours: number; quality: number };
  date: Date;
  notes?: string;
}

export interface Goal {
  id: string;
  type: 'steps' | 'distance' | 'calories' | 'weight' | 'sleep' | 'workouts';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly';
  deadline?: Date;
}

interface HealthContextType {
  activities: Activity[];
  healthMetrics: HealthMetric[];
  goals: Goal[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  addHealthMetric: (metric: Omit<HealthMetric, 'id'>) => void;
  updateGoal: (goalId: string, progress: number) => void;
  getWeeklyStats: () => {
    totalDistance: number;
    totalCalories: number;
    totalWorkouts: number;
    avgHeartRate: number;
  };
  getActivityTrends: () => { date: string; activities: number; calories: number }[];
}

const HealthContext = createContext<HealthContextType | null>(null);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'run',
      name: 'Corrida Matinal',
      duration: 32,
      distance: 5.2,
      calories: 312,
      date: new Date(),
      heartRate: { avg: 145, max: 165, zones: [
        { zone: 'Aquecimento', time: 5 },
        { zone: 'Aeróbico', time: 20 },
        { zone: 'Anaeróbico', time: 7 }
      ]},
    },
    {
      id: '2',
      type: 'yoga',
      name: 'Hatha Yoga',
      duration: 45,
      calories: 180,
      date: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      type: 'cycle',
      name: 'Pedalada no Parque',
      duration: 75,
      distance: 15.8,
      calories: 450,
      date: new Date(Date.now() - 172800000),
    },
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      type: 'sleep',
      value: { hours: 7.5, quality: 8 },
      date: new Date(),
    },
    {
      id: '2',
      type: 'weight',
      value: 72.5,
      date: new Date(),
    },
    {
      id: '3',
      type: 'hydration',
      value: 2.1,
      date: new Date(),
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      type: 'steps',
      target: 10000,
      current: 8750,
      period: 'daily',
    },
    {
      id: '2',
      type: 'distance',
      target: 25,
      current: 18.2,
      period: 'weekly',
    },
    {
      id: '3',
      type: 'workouts',
      target: 5,
      current: 3,
      period: 'weekly',
    },
  ]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addHealthMetric = (metric: Omit<HealthMetric, 'id'>) => {
    const newMetric = {
      ...metric,
      id: Date.now().toString(),
    };
    setHealthMetrics(prev => [newMetric, ...prev]);
  };

  const updateGoal = (goalId: string, progress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, current: progress } : goal
    ));
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActivities = activities.filter(activity => activity.date >= weekAgo);
    
    return {
      totalDistance: weeklyActivities.reduce((sum, activity) => sum + (activity.distance || 0), 0),
      totalCalories: weeklyActivities.reduce((sum, activity) => sum + activity.calories, 0),
      totalWorkouts: weeklyActivities.length,
      avgHeartRate: weeklyActivities.reduce((sum, activity) => 
        sum + (activity.heartRate?.avg || 0), 0) / (weeklyActivities.length || 1),
    };
  };

  const getActivityTrends = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayActivities = activities.filter(activity => 
        activity.date.toISOString().split('T')[0] === date
      );
      return {
        date,
        activities: dayActivities.length,
        calories: dayActivities.reduce((sum, activity) => sum + activity.calories, 0),
      };
    });
  };

  const value: HealthContextType = {
    activities,
    healthMetrics,
    goals,
    addActivity,
    addHealthMetric,
    updateGoal,
    getWeeklyStats,
    getActivityTrends,
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};
