
import { motion } from 'framer-motion';
import { useState } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDailyActivity, DayActivity } from '@/hooks/useDailyActivity';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Droplets, Moon, Dumbbell, Clock, Calendar } from 'lucide-react';

interface DayCardProps {
  day: DayActivity;
  onClick: () => void;
}

function DayCard({ day, onClick }: DayCardProps) {
  const date = parseISO(day.date);
  const dayName = format(date, 'EEE', { locale: ptBR });
  const dayNumber = format(date, 'd');
  
  const getDateLabel = () => {
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return dayName;
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    if (score > 0) return 'from-red-500 to-red-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift h-full min-h-[120px]">
        <CardContent className="p-3">
          <div className="text-center mb-2">
            <div className="text-xs text-navy-400 uppercase tracking-wider">
              {getDateLabel()}
            </div>
            <div className="text-lg font-bold text-white">
              {dayNumber}
            </div>
          </div>
          
          {/* Wellness Score */}
          {day.wellnessScore > 0 && (
            <div className="mb-2">
              <div className={`h-2 rounded-full bg-gradient-to-r ${getWellnessColor(day.wellnessScore)}`} />
              <div className="text-xs text-navy-400 text-center mt-1">
                {day.wellnessScore.toFixed(0)}/100
              </div>
            </div>
          )}
          
          {/* Resumo visual */}
          <div className="flex justify-center gap-1 mb-2">
            {day.summary.mood && <span className="text-sm">{day.summary.mood}</span>}
            {day.summary.energy && <span className="text-sm">{day.summary.energy}</span>}
            {day.summary.productivity && <span className="text-sm">{day.summary.productivity}</span>}
          </div>
          
          {/* Atividades */}
          {day.totalActivities > 0 && (
            <div className="flex items-center justify-center gap-1 text-xs text-navy-300">
              <Activity className="w-3 h-3" />
              <span>{day.totalActivities}</span>
            </div>
          )}
          
          {/* Highlight */}
          <div className="text-xs text-center text-navy-400 mt-1 truncate">
            {day.summary.highlight}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DayDetailsModalProps {
  day: DayActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

function DayDetailsModal({ day, isOpen, onClose }: DayDetailsModalProps) {
  if (!day) return null;

  const date = parseISO(day.date);
  const formattedDate = format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-navy-600/30 bg-navy-800/95 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-orange" />
            {formattedDate}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Score de Bem-estar */}
          {day.wellnessScore > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-orange" />
                Bem-estar Geral
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-accent-orange">
                  {day.wellnessScore.toFixed(1)}/100
                </div>
                <div className="flex gap-2">
                  {day.summary.mood && <Badge variant="outline">{day.summary.mood} Humor</Badge>}
                  {day.summary.energy && <Badge variant="outline">{day.summary.energy} Energia</Badge>}
                  {day.summary.productivity && <Badge variant="outline">{day.summary.productivity} Trabalho</Badge>}
                </div>
              </div>
            </div>
          )}

          {/* Atividades Físicas */}
          {day.activities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-accent-orange" />
                Atividades Físicas ({day.totalActivities})
              </h3>
              <div className="grid gap-3">
                {day.activities.map((activity, index) => (
                  <div key={index} className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white capitalize">
                          {activity.name || activity.type}
                        </div>
                        <div className="text-sm text-navy-300">
                          {Math.floor(activity.duration / 60)} min
                          {activity.distance && ` • ${activity.distance}km`}
                          {activity.calories && ` • ${activity.calories} cal`}
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                    {activity.notes && (
                      <div className="text-sm text-navy-400 mt-2 italic">
                        "{activity.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-navy-400 bg-navy-700/30 p-3 rounded-lg">
                📊 Total: {day.totalMinutes} minutos • {day.totalCalories} calorias queimadas
              </div>
            </div>
          )}

          {/* Check-in de Saúde */}
          {day.healthCheckin && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-orange" />
                Check-in de Saúde
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {day.healthCheckin.sleep_quality && (
                  <div className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-navy-300">Sono</span>
                    </div>
                    <div className="text-white font-medium">
                      {day.healthCheckin.sleep_quality}/5
                      {day.healthCheckin.sleep_hours && ` (${day.healthCheckin.sleep_hours}h)`}
                    </div>
                  </div>
                )}
                
                {day.healthCheckin.hydration_glasses > 0 && (
                  <div className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-navy-300">Hidratação</span>
                    </div>
                    <div className="text-white font-medium">
                      {day.healthCheckin.hydration_glasses} copos
                    </div>
                  </div>
                )}
                
                {day.healthCheckin.stress_level && (
                  <div className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-navy-300">Stress</span>
                    </div>
                    <div className="text-white font-medium">
                      {day.healthCheckin.stress_level}/10
                    </div>
                  </div>
                )}
                
                {day.healthCheckin.energy_level && (
                  <div className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-navy-300">Energia</span>
                    </div>
                    <div className="text-white font-medium">
                      {day.healthCheckin.energy_level}/10
                    </div>
                  </div>
                )}
              </div>
              
              {day.healthCheckin.notes && (
                <div className="glass-card border-navy-600/30 bg-navy-700/30 p-3 rounded-lg">
                  <div className="text-sm text-navy-300 mb-1">Anotações:</div>
                  <div className="text-white italic">"{day.healthCheckin.notes}"</div>
                </div>
              )}
            </div>
          )}

          {/* Métricas de Saúde */}
          {day.healthMetrics.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Métricas de Saúde</h3>
              <div className="grid gap-2">
                {day.healthMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center glass-card border-navy-600/30 bg-navy-700/30 p-2 rounded">
                    <span className="text-navy-300 capitalize">{metric.metric_type.replace('_', ' ')}</span>
                    <span className="text-white font-medium">
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dia sem dados */}
          {day.totalActivities === 0 && !day.healthCheckin && day.healthMetrics.length === 0 && (
            <div className="text-center py-8 text-navy-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma atividade registrada neste dia.</p>
              <p className="text-sm mt-1">Que tal começar a registrar suas atividades?</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DailyHistoryCarousel() {
  const { data: dailyData, isLoading } = useDailyActivity(30);
  const [selectedDay, setSelectedDay] = useState<DayActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (day: DayActivity) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Histórico dos Últimos Dias</h3>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-24 h-32 bg-navy-700/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Histórico dos Últimos Dias</h3>
        <div className="text-sm text-navy-400">
          Clique em um dia para ver detalhes
        </div>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {dailyData?.map((day) => (
            <CarouselItem key={day.date} className="pl-2 md:pl-4 basis-24 md:basis-28">
              <DayCard day={day} onClick={() => handleDayClick(day)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50" />
        <CarouselNext className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:bg-navy-700/50" />
      </Carousel>

      <DayDetailsModal 
        day={selectedDay}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
