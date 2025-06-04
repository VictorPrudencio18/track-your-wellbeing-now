
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export function QuickSuggestions({ suggestions, onSuggestionClick }: QuickSuggestionsProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent-orange" />
        <span className="text-xs sm:text-sm font-medium text-navy-300">Sugestões rápidas:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="glass-card-subtle border-navy-600/40 text-navy-400 hover:text-white hover:border-accent-orange/40 hover:bg-accent-orange/10 text-xs rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 font-medium justify-start h-auto min-h-[32px] sm:min-h-[36px]"
          >
            <span className="truncate">{suggestion}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
