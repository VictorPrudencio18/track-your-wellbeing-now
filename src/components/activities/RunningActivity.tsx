
import { motion } from "framer-motion";
import { PremiumGPSRunner } from "./PremiumGPSRunner";

interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PremiumGPSRunner onComplete={onComplete} onCancel={onCancel} />
    </motion.div>
  );
}
