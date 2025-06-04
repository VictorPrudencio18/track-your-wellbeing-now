
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Enums } from '@/integrations/supabase/types';

export function SupabaseActivityTracker() {
  const { user } = useAuth();
  const createActivity = useCreateActivity();
  
  const [formData, setFormData] = useState({
    type: 'walking' as Enums<'activity_type'>,
    name: '',
    duration: '',
    distance: '',
    calories: '',
    notes: '',
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Faça login para registrar suas atividades
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createActivity.mutateAsync({
        type: formData.type,
        name: formData.name || undefined,
        duration: parseInt(formData.duration) * 60, // Convert minutes to seconds
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        notes: formData.notes || undefined,
      });
      
      toast.success('Atividade registrada com sucesso!');
      
      // Reset form
      setFormData({
        type: 'walking',
        name: '',
        duration: '',
        distance: '',
        calories: '',
        notes: '',
      });
    } catch (error: any) {
      toast.error('Erro ao registrar atividade: ' + error.message);
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
              <Label htmlFor="duration">Duração (min)</Label>
              <Input
                id="duration"
                type="number"
                required
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
