
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayActivity } from '@/hooks/useDailyActivity';

interface YearlyHeatmapProps {
  dailyData: DayActivity[];
  onDayClick: (day: DayActivity) => void;
}

export function YearlyHeatmap({ dailyData, onDayClick }: YearlyHeatmapProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  const getDayData = (date: Date): DayActivity | null => {
    const dateStr = date.toISOString().split('T')[0];
    return dailyData.find(day => day.date === dateStr) || null;
  };
  
  const getIntensityLevel = (wellnessScore: number, totalActivities: number): number => {
    if (wellnessScore === 0 && totalActivities === 0) return 0;
    const intensity = Math.max(wellnessScore / 20, totalActivities * 10);
    return Math.ceil(intensity / 25); // 0-4 levels
  };
  
  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-navy-800/40';
      case 1: return 'bg-red-500/60';
      case 2: return 'bg-orange-500/70';
      case 3: return 'bg-blue-500/80';
      case 4: return 'bg-green-500';
      default: return 'bg-navy-800/40';
    }
  };
  
  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };
  
  const goToCurrentYear = () => {
    setCurrentYear(new Date().getFullYear());
  };
  
  // Calcular estatísticas anuais
  const yearData = dailyData.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate.getFullYear() === currentYear;
  });
  
  const yearStats = {
    totalActivities: yearData.reduce((sum, day) => sum + day.totalActivities, 0),
    avgWellness: yearData.length > 0 
      ? yearData.reduce((sum, day) => sum + day.wellnessScore, 0) / yearData.length 
      : 0,
    activeDays: yearData.filter(day => day.totalActivities > 0).length,
    totalCalories: yearData.reduce((sum, day) => sum + day.totalCalories, 0),
    bestMonth: monthsInYear.reduce((best, month) => {
      const monthData = yearData.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate.getMonth() === month.getMonth();
      });
      const monthTotal = monthData.reduce((sum, day) => sum + day.totalActivities, 0);
      return monthTotal > best.total ? { month, total: monthTotal } : best;
    }, { month: monthsInYear[0], total: 0 })
  };

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-white">{currentYear}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('prev')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateYear('next')}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToCurrentYear}
          className="glass-card border-accent-orange/30 bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().getFullYear()}
        </Button>
      </div>

      {/* Estatísticas anuais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <div className="text-sm text-navy-400">Total Atividades</div>
          </div>
          <div className="text-2xl font-bold text-white">{yearStats.totalActivities}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-green-500/10 to-green-600/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-400" />
            <div className="text-sm text-navy-400">Dias Ativos</div>
          </div>
          <div className="text-2xl font-bold text-white">{yearStats.activeDays}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-orange-400" />
            <div className="text-sm text-navy-400">Bem-estar Médio</div>
          </div>
          <div className="text-2xl font-bold text-white">{yearStats.avgWellness.toFixed(1)}</div>
        </div>
        <div className="glass-card border-navy-600/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <div className="text-sm text-navy-400">Melhor Mês</div>
          </div>
          <div className="text-lg font-bold text-white">
            {format(yearStats.bestMonth.month, 'MMM', { locale: ptBR })}
          </div>
        </div>
      </div>

      {/* Grid de mini calendários */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {monthsInYear.map((month, monthIndex) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
          
          // Calcular estatísticas do mês
          const monthData = yearData.filter(day => {
            const dayDate = new Date(day.date);
            return dayDate.getMonth() === month.getMonth();
          });
          
          const monthTotal = monthData.reduce((sum, day) => sum + day.totalActivities, 0);
          
          return (
            <motion.div
              key={monthIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: monthIndex * 0.05 }}
              className="glass-card border-navy-600/30 bg-navy-800/50 p-4 rounded-xl"
            >
              <div className="text-center mb-3">
                <h4 className="text-sm font-semibold text-white">
                  {format(month, 'MMMM', { locale: ptBR })}
                </h4>
                <p className="text-xs text-navy-400">{monthTotal} atividades</p>
              </div>
              
              {/* Mini grid do mês */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((date, dayIndex) => {
                  const dayData = getDayData(date);
                  const intensityLevel = getIntensityLevel(
                    dayData?.wellnessScore || 0,
                    dayData?.totalActivities || 0
                  );
                  
                  return (
                    <motion.div
                      key={dayIndex}
                      whileHover={{ scale: 1.2 }}
                      className={`
                        w-3 h-3 rounded-sm cursor-pointer transition-all duration-200
                        ${getIntensityColor(intensityLevel)}
                        hover:ring-1 hover:ring-white/40
                      `}
                      onClick={() => dayData && onDayClick(dayData)}
                      title={`${format(date, 'd/M/y')} - ${dayData?.totalActivities || 0} atividades`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Legenda */}
      <div className="flex items-center justify-center gap-4 text-xs text-navy-400">
        <span>Menos</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
            />
          ))}
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}
