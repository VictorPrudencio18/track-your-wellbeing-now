import React from 'react';
import { ModernHITSActivity } from './modern/ModernHITSActivity';

interface HITSActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function HITSActivity({ onComplete, onCancel }: HITSActivityProps) {
  return <ModernHITSActivity onComplete={onComplete} onCancel={onCancel} />;
}