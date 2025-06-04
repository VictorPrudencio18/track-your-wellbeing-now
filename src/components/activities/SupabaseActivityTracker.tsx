
import { useState } from 'react';
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
import { AlertCircle } from 'lucide-react';

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
  });

  if (authLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Faça login para registrar suas atividades e acompanhar seu progresso.
        </AlertDescription>
      </Alert>
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
      });
    } catch (error: any) {
      // Error is handled by the mutation
      console.error('Activity creation failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Nova Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Atividade</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: Enums<'activity_type'>) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Corrida</SelectItem>
                  <SelectItem value="walking">Caminhada</SelectItem>
                  <SelectItem value="cycling">Ciclismo</SelectItem>
                  <SelectItem value="swimming">Natação</SelectItem>
                  <SelectItem value="gym">Academia</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="dance">Dança</SelectItem>
                  <SelectItem value="hiking">Trilha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome (opcional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Corrida matinal"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (min) *</Label>
              <Input
                id="duration"
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distância (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                placeholder="5.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories">Calorias</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Anotações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Como foi o treino..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createActivity.isPending}
          >
            {createActivity.isPending ? 'Registrando...' : 'Registrar Atividade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
