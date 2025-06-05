
import React from 'react';
import { ModernSwimmingActivity } from './modern/ModernSwimmingActivity';

interface SwimmingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function SwimmingActivity({ onComplete, onCancel }: SwimmingActivityProps) {
  return <ModernSwimmingActivity onComplete={onComplete} onCancel={onCancel} />;
}
