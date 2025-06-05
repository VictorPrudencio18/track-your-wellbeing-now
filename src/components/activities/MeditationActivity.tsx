
import { ModernMeditationActivity } from './modern/ModernMeditationActivity';

interface MeditationActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function MeditationActivity({ onComplete, onCancel }: MeditationActivityProps) {
  return <ModernMeditationActivity onComplete={onComplete} onCancel={onCancel} />;
}
