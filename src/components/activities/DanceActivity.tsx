
import React from 'react';
import { ModernDanceActivity } from './modern/ModernDanceActivity';

interface DanceActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function DanceActivity({ onComplete, onCancel }: DanceActivityProps) {
  return <ModernDanceActivity onComplete={onComplete} onCancel={onCancel} />;
}
