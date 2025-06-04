
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatMessage({ message, index, onSuggestionClick }: ChatMessageProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          message.type === 'user' 
            ? 'bg-gradient-to-br from-accent-orange/30 to-accent-orange-light/20 text-accent-orange border border-accent-orange/20' 
            : 'bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 text-navy-900'
        }`}>
          {message.type === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
        </div>
        
        <div className="space-y-2 sm:space-y-3 min-w-0">
          <div className={`relative px-3 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-lg backdrop-blur-sm ${
            message.type === 'user'
              ? 'bg-gradient-to-br from-accent-orange/20 to-accent-orange-light/10 text-white border border-accent-orange/30'
              : 'bg-gradient-to-br from-navy-800/80 to-navy-700/60 text-white border border-navy-600/40'
          }`}>
            <p className="text-xs sm:text-sm leading-relaxed font-medium break-words">{message.content}</p>
            <div className={`absolute bottom-1 sm:bottom-2 ${message.type === 'user' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}`}>
              <p className="text-xs opacity-60 font-medium">{formatTime(message.timestamp)}</p>
            </div>
            <div className="mb-3 sm:mb-4"></div>
          </div>
          
          {message.suggestions && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-1.5 sm:gap-2"
            >
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="glass-card-subtle border-navy-600/40 text-navy-300 hover:text-white hover:border-accent-orange/40 hover:bg-accent-orange/10 text-xs rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 font-medium justify-start h-auto min-h-[32px] sm:min-h-[36px]"
                >
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
