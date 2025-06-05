
import React from 'react';
import { ModernYogaActivity } from './modern/ModernYogaActivity';

interface YogaActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function YogaActivity({ onComplete, onCancel }: YogaActivityProps) {
  return <ModernYogaActivity onComplete={onComplete} onCancel={onCancel} />;
}
