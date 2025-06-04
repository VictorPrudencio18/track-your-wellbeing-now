
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { QuickSuggestions } from "./chat/QuickSuggestions";
import { TypingIndicator } from "./chat/TypingIndicator";
import { quickSuggestions } from "./chat/data";
import { ChatMessage as ChatMessageType } from "./chat/types";
import { useActivities } from "@/hooks/useSupabaseActivities";
import { useUserScores } from "@/hooks/useSupabaseScores";
import { useAuth } from "@/hooks/useAuth";

export function VivaAIChat() {
  const { user } = useAuth();
  const { data: activities } = useActivities();
  const { data: userScores } = useUserScores();
  
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize chat with personalized message based on real data
  useEffect(() => {
    if (user && activities !== undefined && userScores !== undefined) {
      const totalActivities = activities?.length || 0;
      const currentStreak = userScores?.current_streak || 0;
      const totalPoints = userScores?.total_points || 0;

      let personalizedMessage = 'Olá! Eu sou a VIVA, sua assistente de saúde e bem-estar! 🌟 Estou aqui para te ajudar com dicas personalizadas baseadas em suas atividades e responder suas dúvidas sobre saúde mental e qualidade de vida.';
      
      if (totalActivities > 0) {
        personalizedMessage += ` \n\nVi que você já registrou ${totalActivities} atividade${totalActivities > 1 ? 's' : ''}! 💪`;
        
        if (currentStreak > 0) {
          personalizedMessage += ` Você está em uma sequência de ${currentStreak} dia${currentStreak > 1 ? 's' : ''}! Continue assim! 🔥`;
        }
        
        if (totalPoints > 0) {
          personalizedMessage += ` Você já acumulou ${totalPoints} pontos! 🏆`;
        }
      } else {
        personalizedMessage += '\n\nVejo que você ainda não registrou nenhuma atividade. Que tal começar hoje mesmo? Posso te ajudar com dicas para começar! 🚀';
      }

      const initialMessage: ChatMessageType = {
        id: '1',
        type: 'ai',
        content: personalizedMessage,
        timestamp: new Date().toISOString(),
        suggestions: totalActivities > 0 
          ? ['Análise do meu progresso', 'Dicas para melhorar', 'Próximos objetivos']
          : ['Como começar', 'Sugestões de atividades', 'Definir metas']
      };

      setMessages([initialMessage]);
    }
  }, [user, activities, userScores]);

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
      const totalActivities = activities?.length || 0;
      const currentStreak = userScores?.current_streak || 0;
      const totalDistance = activities?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0;
      const totalCalories = activities?.reduce((sum, activity) => sum + (activity.calories || 0), 0) || 0;

      const responses = {
        'sono': `Para melhorar seu sono, recomendo: 1) Manter horários regulares, 2) Evitar telas 1h antes de dormir, 3) Criar um ambiente escuro e fresco, 4) Praticar técnicas de relaxamento. ${totalActivities > 0 ? `Baseado em suas ${totalActivities} atividades registradas, vejo que você tem sido ativo - isso é ótimo para o sono!` : 'Exercícios regulares podem ajudar muito com o sono!'} 😴`,
        
        'estresse': `Para reduzir o estresse, experimente: 1) Respiração profunda (4-7-8), 2) Exercícios leves, 3) Mindfulness por 10 min/dia, 4) Pausas regulares. ${totalActivities > 0 ? `Seus dados mostram ${totalActivities} atividades registradas - continue assim!` : 'Que tal começar com uma caminhada leve?'} 🧘‍♀️`,
        
        'ansiedade': `Para ansiedade, recomendo: 1) Técnica de aterramento 5-4-3-2-1, 2) Exercícios aeróbicos, 3) Journaling, 4) Respiração controlada. ${currentStreak > 0 ? `Vejo que você tem uma sequência de ${currentStreak} dias - isso é excelente para controlar a ansiedade!` : 'Atividade física regular pode ajudar muito!'} 💪`,
        
        'alimentação': `Para alimentação saudável: 1) Hidrate-se bem, 2) Coma de 3 em 3h, 3) Inclua proteínas magras, 4) Frutas e vegetais coloridos. ${totalCalories > 0 ? `Baseado em suas atividades, você já queimou ${totalCalories} calorias - seu metabolismo está ativo!` : 'Exercícios ajudam a acelerar o metabolismo!'} 🥗`,
        
        'progresso': totalActivities > 0 
          ? `Analisando seu progresso: 📊\n\n• ${totalActivities} atividades registradas\n• ${currentStreak} dias de sequência atual\n• ${totalDistance.toFixed(1)} km percorridos\n• ${totalCalories} calorias queimadas\n\nVocê está indo muito bem! Continue assim! 🎉`
          : 'Você ainda não tem atividades registradas para analisar. Que tal começar hoje mesmo? Posso te ajudar a definir suas primeiras metas! 🚀',
        
        'análise': totalActivities > 0
          ? `Baseado em seus dados reais:\n\n✅ ${totalActivities} atividades completadas\n✅ Sequência atual: ${currentStreak} dias\n✅ Total de pontos: ${userScores?.total_points || 0}\n\n${currentStreak >= 7 ? 'Excelente consistência!' : 'Foque em manter regularidade para criar o hábito!'} 💪`
          : 'Para fazer uma análise personalizada, preciso que você registre algumas atividades primeiro. Vamos começar? 📈'
      };

      const keyword = Object.keys(responses).find(key => 
        userMessage.toLowerCase().includes(key)
      );

      const response = keyword ? responses[keyword as keyof typeof responses] : 
        `Entendo sua pergunta! Como sua assistente de saúde, posso te ajudar com temas como sono, estresse, alimentação, exercícios e bem-estar mental. ${totalActivities > 0 ? `Baseado em seus dados, vejo que você tem ${totalActivities} atividades registradas - parabéns!` : 'Vamos começar registrando suas primeiras atividades?'} 🎉 Pode me contar mais sobre o que especificamente te preocupa?`;

      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString(),
        suggestions: totalActivities > 0 
          ? ['Mais dicas', 'Análise detalhada', 'Próximos passos']
          : ['Como começar', 'Definir metas', 'Sugestões de atividades']
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

  if (!user) {
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
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
                  IA VIVA
                </h3>
                <p className="text-xs sm:text-sm text-navy-400 font-medium">Faça login para chat personalizado</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-accent-orange/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Chat IA Personalizado</h3>
              <p className="text-navy-400 text-sm">
                Faça login para ter acesso ao chat com análise baseada em suas atividades reais.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
              <p className="text-xs sm:text-sm text-navy-400 font-medium">
                Assistente com seus dados reais
              </p>
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
