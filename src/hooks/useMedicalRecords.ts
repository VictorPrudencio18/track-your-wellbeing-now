
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface MedicalRecord {
  id: string;
  user_id: string;
  record_type: string;
  title: string;
  description?: string;
  healthcare_provider?: string;
  appointment_date?: string;
  results: any;
  attachments: any[];
  follow_up_required: boolean;
  follow_up_date?: string;
  privacy_level: string;
  created_at: string;
  updated_at: string;
}

export function useMedicalRecords() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar registros médicos
  const { data: medicalRecords, isLoading } = useQuery({
    queryKey: ['medical-records', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MedicalRecord[];
    },
    enabled: !!user,
  });

  // Criar registro médico
  const createMedicalRecord = useMutation({
    mutationFn: async (record: {
      record_type: string;
      title: string;
      description?: string;
      healthcare_provider?: string;
      appointment_date?: string;
      results?: any;
      attachments?: any[];
      follow_up_required?: boolean;
      follow_up_date?: string;
      privacy_level?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id,
          record_type: record.record_type,
          title: record.title,
          description: record.description,
          healthcare_provider: record.healthcare_provider,
          appointment_date: record.appointment_date,
          results: record.results || {},
          attachments: record.attachments || [],
          follow_up_required: record.follow_up_required || false,
          follow_up_date: record.follow_up_date,
          privacy_level: record.privacy_level || 'private',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast({
        title: "Registro criado!",
        description: "Seu registro médico foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o registro.",
        variant: "destructive",
      });
    }
  });

  return {
    medicalRecords: medicalRecords || [],
    isLoading,
    createMedicalRecord,
  };
}
