
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DayActivity } from '@/hooks/useDailyActivity';

interface MonthlyHeatmapProps {
  dailyData: DayActivity[];
  onDayClick: (day: DayActivity) => void;
}

export function MonthlyHeatmap({ dailyData, onDayClick }: MonthlyHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Preencher dias anteriores para completar a primeira semana
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (startDayOfWeek - i));
    return date;
  });
  
  // Preencher dias posteriores para completar a última semana
  const endDayOfWeek = getDay(monthEnd);
  const endPaddingDays = Array.from({ length: 6 - endDayOfWeek }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + (i + 1));
    return date;
  });
  
  const allDays = [...paddingDays, ...daysInMonth, ...endPaddingDays];
  
  const getDayData = (date: Date): DayActivity | null => {
    const dateStr = date.toISOString().split('T')[0];
    return dailyData.find(day => day.date === dateStr) || null;
  };
  
  const getIntensityColor = (wellnessScore: number, totalActivities: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return 'bg-navy-900/20 border-navy-700/10';
    if (wellnessScore === 0 && totalActivities === 0) return 'bg-navy-800/40 border-navy-700/30';
    
    const intensity = Math.max(wellnessScore / 20, totalActivities * 10); // 0-100 scale
    
    if (intensity >= 80) return 'bg-gradient-to-br from-green-500 to-green-600 border-green-400/50';
    if (intensity >= 60) return 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400/50';
    if (intensity >= 40) return 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400/50';
    if (intensity >= 20) return 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400/50';
    return 'bg-gradient-to-br from-red-500 to-red-600 border-red-400/50';
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Calcular estatísticas do mês
  const monthData = dailyData.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate.getMonth() === currentDate.getMonth() && 
           dayDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthStats = {
    totalActivities: monthData.reduce((sum, day) => sum + day.totalActivities, 0),
    avgWellness: monthData.length > 0 
      ? monthData.reduce((sum, day) => sum + day.wellnessScore, 0) / monthData.length 
      : 0,
    activeDays: monthData.filter(day => day.totalActivities > 0).length,
    totalCalories: monthData.reduce((sum, day) => sum + day.totalCalories, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="glass-card border-accent-orange/30 bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Hoje
        </Button>
      </div>

      {/* Estatísticas do mês */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card border-navy-600/30 bg-navy-800/50 p-4 rounded-xl">
          <div className="text-sm text-navy-400 mb-1">Atividades</div>
          <div className="text-2xl font-bold text-white">{monthStats.totalActivities}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-navy-800/50 p-4 rounded-xl">
          <div className="text-sm text-navy-400 mb-1">Bem-estar Médio</div>
          <div className="text-2xl font-bold text-white">{monthStats.avgWellness.toFixed(1)}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-navy-800/50 p-4 rounded-xl">
          <div className="text-sm text-navy-400 mb-1">Dias Ativos</div>
          <div className="text-2xl font-bold text-white">{monthStats.activeDays}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-navy-800/50 p-4 rounded-xl">
          <div className="text-sm text-navy-400 mb-1">Calorias</div>
          <div className="text-2xl font-bold text-white">{monthStats.totalCalories}</div>
        </div>
      </div>

      {/* Calendário */}
      <div className="glass-card border-navy-600/30 bg-navy-800/50 p-6 rounded-2xl">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-navy-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid do calendário */}
        <div className="grid grid-cols-7 gap-2">
          {allDays.map((date, index) => {
            const dayData = getDayData(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(date);
            const intensity = getIntensityColor(
              dayData?.wellnessScore || 0, 
              dayData?.totalActivities || 0, 
              isCurrentMonth
            );
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.01 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative h-12 rounded-lg border cursor-pointer transition-all duration-200
                  ${intensity}
                  ${isTodayDate ? 'ring-2 ring-accent-orange shadow-lg shadow-accent-orange/20' : ''}
                  ${!isCurrentMonth ? 'opacity-30' : 'hover:ring-2 hover:ring-white/20'}
                `}
                onClick={() => dayData && isCurrentMonth && onDayClick(dayData)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  <span className={`text-sm font-medium ${
                    isCurrentMonth ? 'text-white' : 'text-navy-500'
                  }`}>
                    {format(date, 'd')}
                  </span>
                  {isTodayDate && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 bg-accent-orange rounded-full animate-pulse" />
                    </div>
                  )}
                  {dayData && dayData.totalActivities > 0 && isCurrentMonth && (
                    <div className="text-xs text-white/80 font-medium">
                      {dayData.totalActivities}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legenda */}
        <div className="flex items-center justify-between text-xs text-navy-400 mt-6 pt-4 border-t border-navy-600/20">
          <span>Menos ativo</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-3 bg-navy-800/40 border border-navy-700/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-green-600 rounded-sm"></div>
          </div>
          <span>Mais ativo</span>
        </div>
      </div>
    </div>
  );
}
