
import { useEnhancedActivityTracker } from './useEnhancedActivityTracker';

// Re-export da versão aprimorada para manter compatibilidade
export const useActivityTracker = useEnhancedActivityTracker;

// Re-export dos tipos para compatibilidade
export type { EnhancedActivityData as ActivityData } from './useEnhancedActivityTracker';

// Manter interface de estado para compatibilidade
export interface ActivityState {
  isActive: boolean;
  isPaused: boolean;
  data: any;
  startTime: number | null;
  pausedTime: number;
}
