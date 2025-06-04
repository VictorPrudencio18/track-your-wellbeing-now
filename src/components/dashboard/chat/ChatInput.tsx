
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
}

export function ChatInput({ inputValue, setInputValue, onSendMessage, isTyping }: ChatInputProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-end">
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Digite sua pergunta sobre saúde e bem-estar..."
          className="w-full px-3 sm:px-5 py-3 sm:py-4 bg-navy-800/60 border border-navy-600/40 rounded-xl sm:rounded-2xl text-white placeholder-navy-400 focus:outline-none focus:border-accent-orange/60 focus:bg-navy-800/80 text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm min-h-[44px]"
        />
      </div>
      <Button
        onClick={onSendMessage}
        disabled={!inputValue.trim() || isTyping}
        className="bg-gradient-to-r from-accent-orange to-accent-orange-light hover:from-accent-orange-dark hover:to-accent-orange text-navy-900 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[44px] min-w-[44px] flex-shrink-0"
      >
        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
}
