
import { ModernWalkingActivity } from './modern/ModernWalkingActivity';

interface WalkingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function WalkingActivity({ onComplete, onCancel }: WalkingActivityProps) {
  return <ModernWalkingActivity onComplete={onComplete} onCancel={onCancel} />;
}
