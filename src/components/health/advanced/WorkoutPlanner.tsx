
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Target, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell,
  Edit3,
  Trash2
} from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty_level: number;
  duration_weeks: number;
  workout_data: any[];
  progress_tracking: any;
  is_active: boolean;
}

interface WorkoutSession {
  id: string;
  session_name: string;
  exercises: any[];
  duration: number;
  calories_burned: number;
  intensity_level: number;
  completed_at: string;
}

export function WorkoutPlanner() {
  const [activeTab, setActiveTab] = useState('plans');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    difficulty_level: 1,
    duration_weeks: 4,
  });

  // Mock data - substituir pelos hooks reais
  const workoutPlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Plano de Força Iniciante',
      description: 'Programa focado no desenvolvimento de força básica',
      difficulty_level: 2,
      duration_weeks: 8,
      workout_data: [],
      progress_tracking: { completed_sessions: 12, total_sessions: 24 },
      is_active: true,
    },
    {
      id: '2',
      name: 'Cardio Intensivo',
      description: 'Treinos de alta intensidade para queima de gordura',
      difficulty_level: 4,
      duration_weeks: 6,
      workout_data: [],
      progress_tracking: { completed_sessions: 8, total_sessions: 18 },
      is_active: false,
    },
  ];

  const recentSessions: WorkoutSession[] = [
    {
      id: '1',
      session_name: 'Treino de Peito e Tríceps',
      exercises: [
        { name: 'Supino Reto', sets: 4, reps: 10, weight: 80 },
        { name: 'Supino Inclinado', sets: 3, reps: 12, weight: 70 },
        { name: 'Flexões', sets: 3, reps: 15, weight: 0 },
      ],
      duration: 3600, // 1 hora
      calories_burned: 450,
      intensity_level: 7,
      completed_at: new Date().toISOString(),
    },
  ];

  const handleCreatePlan = () => {
    console.log('Criando plano:', newPlan);
    setIsCreatingPlan(false);
    setNewPlan({ name: '', description: '', difficulty_level: 1, duration_weeks: 4 });
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['Muito Fácil', 'Fácil', 'Moderado', 'Difícil', 'Muito Difícil'];
    return labels[level - 1] || 'Desconhecido';
  };

  const getDifficultyColor = (level: number) => {
    const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
    return colors[level - 1] || 'bg-gray-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Planejador de Treinos
        </h1>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Crie planos personalizados, acompanhe seu progresso e registre suas sessões de treino
        </p>
      </motion.div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border border-navy-600/30">
          <TabsTrigger value="plans" className="data-[state=active]:bg-accent-orange">
            <Dumbbell className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-accent-orange">
            <Play className="w-4 h-4 mr-2" />
            Treino Ativo
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-accent-orange">
            <Calendar className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-accent-orange">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progresso
          </TabsTrigger>
        </TabsList>

        {/* Planos de Treino */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Meus Planos de Treino</h2>
            <Button 
              onClick={() => setIsCreatingPlan(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          {isCreatingPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
            >
              <h3 className="text-xl font-bold text-white mb-4">Criar Novo Plano</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-navy-300 text-sm">Nome do Plano</label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="Ex: Hipertrofia Avançada"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Descrição</label>
                  <Textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Descreva os objetivos e características do plano"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-navy-300 text-sm">Nível de Dificuldade</label>
                    <select
                      value={newPlan.difficulty_level}
                      onChange={(e) => setNewPlan({ ...newPlan, difficulty_level: Number(e.target.value) })}
                      className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>
                          {level} - {getDifficultyLabel(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-navy-300 text-sm">Duração (semanas)</label>
                    <Input
                      type="number"
                      value={newPlan.duration_weeks}
                      onChange={(e) => setNewPlan({ ...newPlan, duration_weeks: Number(e.target.value) })}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCreatePlan} className="bg-accent-orange hover:bg-accent-orange/80">
                    Criar Plano
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingPlan(false)}
                    className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{plan.name}</CardTitle>
                        <p className="text-navy-400 text-sm mt-1">{plan.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-navy-600/30 p-2">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600/30 text-red-400 p-2">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge 
                        className={`${getDifficultyColor(plan.difficulty_level)} text-white`}
                      >
                        {getDifficultyLabel(plan.difficulty_level)}
                      </Badge>
                      <div className="flex items-center gap-2 text-navy-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {plan.duration_weeks} semanas
                      </div>
                      {plan.is_active && (
                        <Badge className="bg-green-500/20 text-green-400">
                          Ativo
                        </Badge>
                      )}
                    </div>

                    {plan.progress_tracking && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-navy-300">Progresso</span>
                          <span className="text-white">
                            {plan.progress_tracking.completed_sessions}/{plan.progress_tracking.total_sessions} sessões
                          </span>
                        </div>
                        <Progress 
                          value={(plan.progress_tracking.completed_sessions / plan.progress_tracking.total_sessions) * 100}
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                        onClick={() => setActiveTab('active')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Treino
                      </Button>
                      <Button variant="outline" className="border-navy-600/30 text-navy-300">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Treino Ativo */}
        <TabsContent value="active" className="space-y-6">
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-8 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum Treino Ativo</h3>
              <p className="text-navy-400 mb-6">
                Selecione um plano e inicie uma sessão de treino
              </p>
              <Button 
                onClick={() => setActiveTab('plans')}
                className="bg-accent-orange hover:bg-accent-orange/80"
              >
                Ver Planos
              </Button>
            </motion.div>
          </div>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Histórico de Treinos</h2>
          
          <div className="space-y-4">
            {recentSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{session.session_name}</h3>
                        <p className="text-navy-400 text-sm">
                          {new Date(session.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Concluído
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-navy-400 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          Duração
                        </div>
                        <div className="text-white font-semibold">
                          {Math.floor(session.duration / 60)}min
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-navy-400 text-sm mb-1">
                          <Flame className="w-4 h-4" />
                          Calorias
                        </div>
                        <div className="text-white font-semibold">
                          {session.calories_burned}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-navy-400 text-sm mb-1">
                          <Target className="w-4 h-4" />
                          Intensidade
                        </div>
                        <div className="text-white font-semibold">
                          {session.intensity_level}/10
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-navy-300 text-sm font-medium">Exercícios</h4>
                      {session.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-3 bg-navy-900/30 rounded-lg">
                          <span className="text-white text-sm">{exercise.name}</span>
                          <span className="text-navy-400 text-sm">
                            {exercise.sets}x{exercise.reps}
                            {exercise.weight > 0 && ` • ${exercise.weight}kg`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Progresso */}
        <TabsContent value="progress" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Análise de Progresso</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Análises em Desenvolvimento</h3>
              <p className="text-navy-400">
                Gráficos e estatísticas detalhadas do seu progresso estarão disponíveis em breve
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
