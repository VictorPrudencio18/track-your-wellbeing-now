
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { Calendar, ChevronLeft, ChevronRight, Target, Activity, Flame, Clock } from 'lucide-react';

export function WeeklyCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { goals } = useWeeklyGoals();
  const { progress } = useDailyProgress();
  const { data: activities } = useActivities();

  const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonthStart);
    const lastDay = new Date(currentMonthEnd);
    
    // Adicionar dias do mês anterior para completar a primeira semana
    const startWeekDay = firstDay.getDay();
    for (let i = startWeekDay - 1; i >= 0; i--) {
      const day = new Date(firstDay);
      day.setDate(day.getDate() - i - 1);
      days.push(day);
    }
    
    // Adicionar todos os dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
    
    // Adicionar dias do próximo mês para completar a última semana
    const endWeekDay = lastDay.getDay();
    for (let i = 1; i <= 6 - endWeekDay; i++) {
      const day = new Date(lastDay);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  }, [currentMonth]);

  const getActivitiesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return activities?.filter(activity => 
      activity.completed_at?.split('T')[0] === dateStr
    ) || [];
  };

  const getProgressForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return progress.filter(p => p.progress_date === dateStr);
  };

  const getGoalsForDate = (date: Date) => {
    return goals.filter(goal => {
      const startDate = new Date(goal.week_start_date);
      const endDate = new Date(goal.week_end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const getDateIntensity = (date: Date) => {
    const dayActivities = getActivitiesForDate(date);
    const dayProgress = getProgressForDate(date);
    
    if (dayActivities.length === 0 && dayProgress.length === 0) return 0;
    if (dayActivities.length === 1 || dayProgress.length <= 2) return 1;
    if (dayActivities.length === 2 || dayProgress.length <= 4) return 2;
    return 3;
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-navy-800/30 border-navy-700/30';
      case 1: return 'bg-green-500/20 border-green-500/30';
      case 2: return 'bg-green-500/40 border-green-500/50';
      case 3: return 'bg-green-500/60 border-green-500/70';
      default: return 'bg-navy-800/30 border-navy-700/30';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-orange" />
              Calendário de Atividades e Metas
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="glass-card border-navy-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-white font-medium px-4">
                {currentMonth.toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="glass-card border-navy-600"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-navy-400 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const dayActivities = getActivitiesForDate(date);
                const dayProgress = getProgressForDate(date);
                const dayGoals = getGoalsForDate(date);
                const intensity = getDateIntensity(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDate = isToday(date);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.01 }}
                    className={`
                      relative min-h-[80px] p-2 rounded-lg border transition-all duration-300 hover:scale-105
                      ${getIntensityColor(intensity)}
                      ${!isCurrentMonthDay ? 'opacity-30' : ''}
                      ${isTodayDate ? 'ring-2 ring-accent-orange' : ''}
                    `}
                  >
                    {/* Date number */}
                    <div className={`
                      text-sm font-medium mb-1
                      ${isTodayDate ? 'text-accent-orange' : isCurrentMonthDay ? 'text-white' : 'text-navy-500'}
                    `}>
                      {date.getDate()}
                    </div>
                    
                    {/* Activities indicators */}
                    <div className="space-y-1">
                      {dayActivities.slice(0, 2).map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="flex items-center gap-1 text-xs"
                        >
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300 truncate">
                            {activity.type}
                          </span>
                        </div>
                      ))}
                      
                      {dayActivities.length > 2 && (
                        <div className="text-xs text-navy-400">
                          +{dayActivities.length - 2} mais
                        </div>
                      )}
                      
                      {/* Goals indicators */}
                      {dayGoals.length > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Target className="w-3 h-3 text-accent-orange" />
                          <span className="text-accent-orange/80">
                            {dayGoals.length} meta{dayGoals.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Intensity indicator */}
                    {intensity > 0 && (
                      <div className="absolute bottom-1 right-1">
                        <div className={`
                          w-2 h-2 rounded-full
                          ${intensity === 1 ? 'bg-green-400' : intensity === 2 ? 'bg-green-300' : 'bg-green-200'}
                        `} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-navy-700/30">
            <div className="flex items-center gap-2 text-sm text-navy-400">
              <div className="w-3 h-3 rounded bg-navy-800/30 border border-navy-700/30"></div>
              <span>Sem atividade</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy-400">
              <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30"></div>
              <span>Baixa atividade</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy-400">
              <div className="w-3 h-3 rounded bg-green-500/40 border border-green-500/50"></div>
              <span>Média atividade</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy-400">
              <div className="w-3 h-3 rounded bg-green-500/60 border border-green-500/70"></div>
              <span>Alta atividade</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
