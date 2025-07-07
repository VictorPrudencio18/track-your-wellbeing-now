
import { motion } from "framer-motion";
import { UnifiedCyclingInterface } from "./UnifiedCyclingInterface";

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UnifiedCyclingInterface onComplete={onComplete} onCancel={onCancel} />
    </motion.div>
  );
}
