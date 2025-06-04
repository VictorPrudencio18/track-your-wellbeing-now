
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Olá! Eu sou a VIVA, sua assistente de saúde e bem-estar! 🌟 Estou aqui para te ajudar com dicas personalizadas baseadas em suas atividades e responder suas dúvidas sobre saúde mental e qualidade de vida.',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'ai',
    content: 'Vi que você já caminhou 8.750 passos hoje! Que tal uma caminhada mais longa para bater sua meta? Ou posso sugerir algumas técnicas de respiração para relaxar?',
    timestamp: new Date().toISOString(),
    suggestions: ['Técnicas de respiração', 'Dicas de caminhada', 'Exercícios de relaxamento']
  }
];

const quickSuggestions = [
  'Como melhorar meu sono?',
  'Dicas para reduzir estresse',
  'Exercícios para ansiedade',
  'Alimentação saudável'
];

export function VivaAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
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

      const newMessage: ChatMessage = {
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

    const userMessage: ChatMessage = {
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <Card className="glass-card border-navy-700/30 h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-orange-light rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-navy-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">IA VIVA</h3>
              <p className="text-sm text-navy-400 font-normal">Sua assistente de bem-estar</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4 pt-0 space-y-4">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-accent-orange/20 text-accent-orange' 
                        : 'bg-gradient-to-br from-accent-orange to-accent-orange-light text-navy-900'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-accent-orange/20 text-white border border-accent-orange/30'
                          : 'glass-card-subtle text-white border border-navy-700/30'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-60 mt-2">{formatTime(message.timestamp)}</p>
                      </div>
                      
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="glass-card-subtle border-navy-700/30 text-navy-300 hover:text-white hover:border-accent-orange/30 text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-orange to-accent-orange-light flex items-center justify-center">
                      <Bot className="w-4 h-4 text-navy-900" />
                    </div>
                    <div className="glass-card-subtle px-4 py-3 rounded-2xl border border-navy-700/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Suggestions */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="glass-card-subtle border-navy-700/30 text-navy-400 hover:text-white hover:border-accent-orange/30 text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua pergunta sobre saúde e bem-estar..."
                  className="w-full px-4 py-3 bg-navy-800/50 border border-navy-700/30 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-accent-orange/50 text-sm"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-accent-orange hover:bg-accent-orange-dark text-navy-900 rounded-xl px-4 py-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
