
import { Progress } from '@/components/ui/progress';

interface CheckinProgressProps {
  current: number;
  total: number;
  currentStep: number;
}

export function CheckinProgress({ current, total, currentStep }: CheckinProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-navy-300">
          Pergunta {currentStep} de {total}
        </span>
        <span className="text-accent-orange">
          {current} / {total} concluídas
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
