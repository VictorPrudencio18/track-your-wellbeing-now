
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

interface CheckinProgressProps {
  current: number;
  total: number;
  currentStep: number;
}

export function CheckinProgress({ current, total, currentStep }: CheckinProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-navy-400">
          Progresso do Check-in
        </span>
        <span className="text-sm text-white font-medium">
          {current} de {total} concluídos
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= current;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <motion.div
              key={stepNumber}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center"
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : isCurrent ? (
                <Circle className="w-4 h-4 text-accent-orange animate-pulse" />
              ) : (
                <Circle className="w-4 h-4 text-navy-600" />
              )}
              {index < total - 1 && (
                <div className={`w-4 h-0.5 mx-1 ${
                  stepNumber <= current ? 'bg-green-400' : 'bg-navy-600'
                }`} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
