
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-start"
    >
      <div className="flex gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 flex items-center justify-center shadow-lg">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-navy-900" />
        </div>
        <div className="bg-gradient-to-br from-navy-800/80 to-navy-700/60 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-navy-600/40 shadow-lg">
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent-orange rounded-full animate-bounce"></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
