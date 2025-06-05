
import React from 'react';
import { ModernGymActivity } from './modern/ModernGymActivity';

interface GymActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function GymActivity({ onComplete, onCancel }: GymActivityProps) {
  return <ModernGymActivity onComplete={onComplete} onCancel={onCancel} />;
}
