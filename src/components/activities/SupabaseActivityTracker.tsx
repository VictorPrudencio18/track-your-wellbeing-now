import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Enums } from '@/integrations/supabase/types';
import { AlertCircle, Plus, Activity, Clock, MapPin, Zap, FileText } from 'lucide-react';

export function SupabaseActivityTracker() {
  const { user, loading: authLoading } = useAuth();
  const createActivity = useCreateActivity();
  
  const [formData, setFormData] = useState({
    type: 'walking' as Enums<'activity_type'>,
    name: '',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
    avg_heart_rate: '',
    max_heart_rate: '',
    pace: '',
    elevation_gain: ''
  });

  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-navy-700/30 rounded-xl"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Plus className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Registrar Nova Atividade</h3>
            <p className="text-navy-400 text-sm">Faça login para registrar atividades</p>
          </div>
        </div>
        <Alert className="glass-card border-accent-orange/20">
          <AlertCircle className="h-4 w-4 text-accent-orange" />
          <AlertDescription className="text-white">
            Faça login para registrar suas atividades e acompanhar seu progresso.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma duração válida.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createActivity.mutateAsync({
        type: formData.type,
        name: formData.name || undefined,
        duration: parseInt(formData.duration) * 60, // Convert minutes to seconds
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        avg_heart_rate: formData.avg_heart_rate ? parseInt(formData.avg_heart_rate) : undefined,
        max_heart_rate: formData.max_heart_rate ? parseInt(formData.max_heart_rate) : undefined,
        pace: formData.pace ? parseFloat(formData.pace) : undefined,
        elevation_gain: formData.elevation_gain ? parseInt(formData.elevation_gain) : undefined,
        notes: formData.notes || undefined,
      });
      
      // Reset form on success
      setFormData({
        type: 'walking',
        name: '',
        duration: '',
        distance: '',
        calories: '',
        notes: '',
        avg_heart_rate: '',
        max_heart_rate: '',
        pace: '',
        elevation_gain: ''
      });
    } catch (error: any) {
      // Error is handled by the mutation
      console.error('Activity creation failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
          <Plus className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Registrar Nova Atividade</h3>
          <p className="text-navy-400 text-sm">Adicione uma nova atividade ao seu histórico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type and Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="type" className="text-white font-medium">Tipo de Atividade</Label>
            </div>
            <Select 
              value={formData.type} 
              onValueChange={(value: Enums<'activity_type'>) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="glass-card border-navy-600/30 bg-navy-800/50 text-white hover:border-navy-500/50 focus:border-accent-orange/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-navy-600/30 bg-navy-800">
                <SelectItem value="running" className="text-white hover:bg-navy-700/50">Corrida</SelectItem>
                <SelectItem value="walking" className="text-white hover:bg-navy-700/50">Caminhada</SelectItem>
                <SelectItem value="cycling" className="text-white hover:bg-navy-700/50">Ciclismo</SelectItem>
                <SelectItem value="swimming" className="text-white hover:bg-navy-700/50">Natação</SelectItem>
                <SelectItem value="gym" className="text-white hover:bg-navy-700/50">Academia</SelectItem>
                <SelectItem value="yoga" className="text-white hover:bg-navy-700/50">Yoga</SelectItem>
                <SelectItem value="dance" className="text-white hover:bg-navy-700/50">Dança</SelectItem>
                <SelectItem value="hiking" className="text-white hover:bg-navy-700/50">Trilha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="name" className="text-white font-medium">Nome (opcional)</Label>
            </div>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Corrida matinal"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>
        </div>

        {/* Enhanced Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="duration" className="text-white font-medium">
                Duração (min) <span className="text-accent-orange">*</span>
              </Label>
            </div>
            <Input
              id="duration"
              type="number"
              required
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="30"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="distance" className="text-white font-medium">Distância (km)</Label>
            </div>
            <Input
              id="distance"
              type="number"
              step="0.1"
              min="0"
              value={formData.distance}
              onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
              placeholder="5.0"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="calories" className="text-white font-medium">Calorias</Label>
            </div>
            <Input
              id="calories"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
              placeholder="300"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-orange" />
              <Label htmlFor="avg_heart_rate" className="text-white font-medium">FC Média</Label>
            </div>
            <Input
              id="avg_heart_rate"
              type="number"
              min="0"
              max="220"
              value={formData.avg_heart_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, avg_heart_rate: e.target.value }))}
              placeholder="120"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="max_heart_rate" className="text-white font-medium">FC Máxima</Label>
            <Input
              id="max_heart_rate"
              type="number"
              min="0"
              max="220"
              value={formData.max_heart_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, max_heart_rate: e.target.value }))}
              placeholder="150"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="pace" className="text-white font-medium">Pace (min/km)</Label>
            <Input
              id="pace"
              type="number"
              step="0.1"
              min="0"
              value={formData.pace}
              onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value }))}
              placeholder="6.0"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="elevation_gain" className="text-white font-medium">Elevação (m)</Label>
            <Input
              id="elevation_gain"
              type="number"
              min="0"
              value={formData.elevation_gain}
              onChange={(e) => setFormData(prev => ({ ...prev, elevation_gain: e.target.value }))}
              placeholder="100"
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent-orange" />
            <Label htmlFor="notes" className="text-white font-medium">Anotações</Label>
          </div>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Como foi o treino..."
            rows={3}
            className="glass-card border-navy-600/30 bg-navy-800/50 text-white placeholder:text-navy-400 hover:border-navy-500/50 focus:border-accent-orange/50 resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/90 hover:to-accent-orange/70 text-white font-medium py-3 px-6 rounded-xl border border-accent-orange/20 shadow-lg hover:shadow-accent-orange/25 transition-all duration-300"
            disabled={createActivity.isPending}
          >
            {createActivity.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Registrar Atividade
              </div>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
