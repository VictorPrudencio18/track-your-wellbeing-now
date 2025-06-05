
import React from 'react';
import { ModernCyclingActivity } from './modern/ModernCyclingActivity';

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
  return <ModernCyclingActivity onComplete={onComplete} onCancel={onCancel} />;
}
