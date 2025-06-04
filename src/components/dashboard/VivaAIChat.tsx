
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { QuickSuggestions } from "./chat/QuickSuggestions";
import { TypingIndicator } from "./chat/TypingIndicator";
import { initialMessages, quickSuggestions } from "./chat/data";
import { ChatMessage as ChatMessageType } from "./chat/types";

export function VivaAIChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = {
        'sono': 'Para melhorar seu sono, recomendo: 1) Manter horários regulares, 2) Evitar telas 1h antes de dormir, 3) Criar um ambiente escuro e fresco, 4) Praticar técnicas de relaxamento. Baseado em suas atividades, vejo que você tem sido ativo - isso é ótimo para o sono! 😴',
        'estresse': 'Para reduzir o estresse, experimente: 1) Respiração profunda (4-7-8), 2) Exercícios leves (que você já faz!), 3) Mindfulness por 10 min/dia, 4) Pausas regulares. Seus dados mostram boa atividade física - continue assim! 🧘‍♀️',
        'ansiedade': 'Para ansiedade, recomendo: 1) Técnica de aterramento 5-4-3-2-1, 2) Exercícios aeróbicos (continue caminhando!), 3) Journaling, 4) Respiração controlada. Vejo que você tem mantido regularidade nas atividades - isso é excelente! 💪',
        'alimentação': 'Para alimentação saudável: 1) Hidrate-se bem (baseado em sua atividade, precisa de mais água), 2) Coma de 3 em 3h, 3) Inclua proteínas magras, 4) Frutas e vegetais coloridos. Seu nível de atividade está ótimo para acelerar o metabolismo! 🥗'
      };

      const keyword = Object.keys(responses).find(key => 
        userMessage.toLowerCase().includes(key)
      );

      const response = keyword ? responses[keyword as keyof typeof responses] : 
        'Entendo sua pergunta! Como sua assistente de saúde, posso te ajudar com temas como sono, estresse, alimentação, exercícios e bem-estar mental. Baseado em seus dados, vejo que você tem sido consistente com as atividades - parabéns! 🎉 Pode me contar mais sobre o que especificamente te preocupa?';

      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString(),
        suggestions: ['Mais dicas', 'Exercícios específicos', 'Acompanhamento semanal']
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    simulateAIResponse(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="h-full"
    >
      <Card className="glass-card border-navy-700/30 h-full min-h-[50vh] max-h-[80vh] lg:h-[650px] flex flex-col overflow-hidden">
        <CardHeader className="pb-4 sm:pb-6 border-b border-navy-700/20 px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-white">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-navy-900 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-navy-900 animate-pulse shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
                IA VIVA
              </h3>
              <p className="text-xs sm:text-sm text-navy-400 font-medium">Sua assistente pessoal de bem-estar</p>
            </div>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 space-y-0 min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 sm:px-6 py-3 sm:py-4">
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  index={index}
                  onSuggestionClick={handleSuggestionClick}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          <div className="border-t border-navy-700/20 bg-gradient-to-r from-navy-800/50 to-navy-700/30 backdrop-blur-sm">
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <QuickSuggestions
                suggestions={quickSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />

              <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
