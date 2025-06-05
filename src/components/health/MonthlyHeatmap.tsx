
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar, Target, Award } from 'lucide-react';
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
    
    if (intensity >= 80) return 'bg-gradient-to-br from-green-500 to-green-600 border-green-400/50 shadow-green-500/20';
    if (intensity >= 60) return 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400/50 shadow-blue-500/20';
    if (intensity >= 40) return 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400/50 shadow-yellow-500/20';
    if (intensity >= 20) return 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400/50 shadow-orange-500/20';
    return 'bg-gradient-to-br from-red-500 to-red-600 border-red-400/50 shadow-red-500/20';
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
      {/* Header melhorado com navegação */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between bg-gradient-to-r from-navy-800/60 to-navy-700/60 p-6 rounded-2xl border border-navy-600/30"
      >
        <div className="flex items-center gap-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <p className="text-navy-400 text-sm">
              {monthStats.activeDays} dias ativos este mês
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50 hover:border-navy-500/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50 hover:border-navy-500/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="glass-card border-accent-orange/30 bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20 hover:border-accent-orange/50"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Hoje
        </Button>
      </motion.div>

      {/* Estatísticas do mês melhoradas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 p-4 rounded-xl hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-accent-orange" />
            <div className="text-sm text-navy-400">Atividades</div>
          </div>
          <div className="text-2xl font-bold text-white">{monthStats.totalActivities}</div>
        </div>
        
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 p-4 rounded-xl hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div className="text-sm text-navy-400">Bem-estar Médio</div>
          </div>
          <div className="text-2xl font-bold text-white">{monthStats.avgWellness.toFixed(1)}</div>
        </div>
        
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 p-4 rounded-xl hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-400" />
            <div className="text-sm text-navy-400">Dias Ativos</div>
          </div>
          <div className="text-2xl font-bold text-white">{monthStats.activeDays}</div>
        </div>
        
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 p-4 rounded-xl hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 text-orange-400">🔥</div>
            <div className="text-sm text-navy-400">Calorias</div>
          </div>
          <div className="text-2xl font-bold text-white">{monthStats.totalCalories}</div>
        </div>
      </motion.div>

      {/* Calendário melhorado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/60 to-navy-700/40 p-6 rounded-2xl"
      >
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-bold text-navy-300 py-3 bg-navy-700/30 rounded-lg">
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
                transition={{ duration: 0.3, delay: index * 0.005 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative h-14 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${intensity}
                  ${isTodayDate ? 'ring-4 ring-accent-orange shadow-2xl shadow-accent-orange/40 z-10 scale-110 border-accent-orange' : ''}
                  ${!isCurrentMonth ? 'opacity-30' : 'hover:ring-2 hover:ring-white/30 hover:shadow-lg'}
                `}
                onClick={() => dayData && isCurrentMonth && onDayClick(dayData)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                  <span className={`text-sm font-bold ${
                    isTodayDate ? 'text-white' : isCurrentMonth ? 'text-white' : 'text-navy-500'
                  }`}>
                    {format(date, 'd')}
                  </span>
                  
                  {isTodayDate && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="w-3 h-3 bg-accent-orange rounded-full shadow-lg" />
                    </motion.div>
                  )}
                  
                  {dayData && dayData.totalActivities > 0 && isCurrentMonth && (
                    <div className="text-xs text-white/90 font-bold bg-black/20 rounded-full px-1 mt-1">
                      {dayData.totalActivities}
                    </div>
                  )}
                  
                  {isTodayDate && (
                    <div className="absolute -bottom-1 text-xs font-bold text-accent-orange">
                      HOJE
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Legenda melhorada */}
        <div className="flex items-center justify-between text-xs text-navy-400 mt-8 pt-6 border-t border-navy-600/30">
          <span className="font-medium">Menos ativo</span>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 bg-navy-800/40 border border-navy-700/30 rounded-md shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-md shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-md shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md shadow-sm"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-md shadow-sm"></div>
          </div>
          <span className="font-medium">Mais ativo</span>
        </div>
      </motion.div>
    </div>
  );
}
