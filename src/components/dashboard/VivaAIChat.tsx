
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
      <Card className="glass-card border-navy-700/30 h-[650px] flex flex-col overflow-hidden">
        <CardHeader className="pb-6 border-b border-navy-700/20">
          <CardTitle className="flex items-center gap-4 text-white">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-navy-900 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-navy-900 animate-pulse shadow-sm"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
                IA VIVA
              </h3>
              <p className="text-sm text-navy-400 font-medium">Sua assistente pessoal de bem-estar</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 space-y-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-br from-accent-orange/30 to-accent-orange-light/20 text-accent-orange border border-accent-orange/20' 
                        : 'bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 text-navy-900'
                    }`}>
                      {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    
                    <div className="space-y-3">
                      <div className={`relative px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-accent-orange/20 to-accent-orange-light/10 text-white border border-accent-orange/30'
                          : 'bg-gradient-to-br from-navy-800/80 to-navy-700/60 text-white border border-navy-600/40'
                      }`}>
                        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                        <div className={`absolute bottom-2 ${message.type === 'user' ? 'left-3' : 'right-3'}`}>
                          <p className="text-xs opacity-60 font-medium">{formatTime(message.timestamp)}</p>
                        </div>
                        <div className="mb-4"></div>
                      </div>
                      
                      {message.suggestions && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="flex flex-wrap gap-2"
                        >
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="glass-card-subtle border-navy-600/40 text-navy-300 hover:text-white hover:border-accent-orange/40 hover:bg-accent-orange/10 text-xs rounded-full px-4 py-2 transition-all duration-300 font-medium"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-navy-900" />
                    </div>
                    <div className="bg-gradient-to-br from-navy-800/80 to-navy-700/60 px-6 py-4 rounded-3xl border border-navy-600/40 shadow-lg">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-accent-orange rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2.5 h-2.5 bg-accent-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Bottom Section */}
          <div className="border-t border-navy-700/20 bg-gradient-to-r from-navy-800/50 to-navy-700/30 backdrop-blur-sm">
            <div className="p-6 space-y-4">
              {/* Quick Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-accent-orange" />
                  <span className="text-sm font-medium text-navy-300">Sugestões rápidas:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="glass-card-subtle border-navy-600/40 text-navy-400 hover:text-white hover:border-accent-orange/40 hover:bg-accent-orange/10 text-xs rounded-full px-4 py-2 transition-all duration-300 font-medium"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Enhanced Input Area */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua pergunta sobre saúde e bem-estar..."
                    className="w-full px-5 py-4 bg-navy-800/60 border border-navy-600/40 rounded-2xl text-white placeholder-navy-400 focus:outline-none focus:border-accent-orange/60 focus:bg-navy-800/80 text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-accent-orange to-accent-orange-light hover:from-accent-orange-dark hover:to-accent-orange text-navy-900 rounded-2xl px-6 py-4 shadow-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
