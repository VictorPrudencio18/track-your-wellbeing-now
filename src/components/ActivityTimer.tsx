
import { RunningActivity } from "./activities/RunningActivity";
import { PremiumCyclingActivity } from "./activities/PremiumCyclingActivity";
import { SwimmingActivity } from "./activities/SwimmingActivity";
import { GymActivity } from "./activities/GymActivity";
import { YogaActivity } from "./activities/YogaActivity";
import { DanceActivity } from "./activities/DanceActivity";
import { WalkingActivity } from "./activities/WalkingActivity";
import { MeditationActivity } from "./activities/MeditationActivity";
import { HITSActivity } from "./activities/HITSActivity";

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
        return <PremiumCyclingActivity {...commonProps} />;
      case "swim":
        return <SwimmingActivity {...commonProps} />;
      case "gym":
        return <GymActivity {...commonProps} />;
      case "yoga":
        return <YogaActivity {...commonProps} />;
      case "dance":
        return <DanceActivity {...commonProps} />;
      case "walk":
        return <WalkingActivity {...commonProps} />;
      case "meditation":
        return <MeditationActivity {...commonProps} />;
      case "hits":
        return <HITSActivity {...commonProps} />;
      default:
        return <RunningActivity {...commonProps} />;
    }
  };

  return renderActivityComponent();
}
