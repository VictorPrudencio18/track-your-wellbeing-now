
import { RunningActivity } from "./activities/RunningActivity";
import { CyclingActivity } from "./activities/CyclingActivity";
import { SwimmingActivity } from "./activities/SwimmingActivity";
import { GymActivity } from "./activities/GymActivity";
import { YogaActivity } from "./activities/YogaActivity";
import { DanceActivity } from "./activities/DanceActivity";

interface ActivityTimerProps {
  activityType: string;
  onActivityComplete: (data: any) => void;
  onCancel?: () => void;
}

export function ActivityTimer({ activityType, onActivityComplete, onCancel }: ActivityTimerProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const renderActivityComponent = () => {
    const commonProps = {
      onComplete: onActivityComplete,
      onCancel: handleCancel,
    };

    switch (activityType) {
      case "run":
        return <RunningActivity {...commonProps} />;
      case "cycle":
        return <CyclingActivity {...commonProps} />;
      case "swim":
        return <SwimmingActivity {...commonProps} />;
      case "gym":
        return <GymActivity {...commonProps} />;
      case "yoga":
        return <YogaActivity {...commonProps} />;
      case "dance":
        return <DanceActivity {...commonProps} />;
      case "walk":
        return <RunningActivity {...commonProps} />; // Reutiliza corrida com velocidade menor
      case "meditation":
        return <YogaActivity {...commonProps} />; // Reutiliza yoga focado em meditação
      default:
        return <RunningActivity {...commonProps} />;
    }
  };

  return renderActivityComponent();
}
