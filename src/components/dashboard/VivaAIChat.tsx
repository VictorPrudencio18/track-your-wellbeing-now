
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
import { generateGeminiResponse } from "@/integrations/gemini/client";
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

      let personalizedMessage = 'Olá! Eu sou a VIVA, sua assistente IA para saúde e bem-estar! 🌟 Estou aqui para te ajudar com insights sobre suas atividades, dicas personalizadas e responder suas dúvidas sobre qualidade de vida, saúde mental e como atingir seus objetivos. Como posso te ajudar hoje?';
      
      if (totalActivities > 0) {
        personalizedMessage += `\n\nVi que você já registrou ${totalActivities} atividade${totalActivities > 1 ? 's' : ''}`;
        if (currentStreak > 0) {
          personalizedMessage += ` e está em uma sequência de ${currentStreak} dia${currentStreak > 1 ? 's' : ''}! 🔥`;
        } else {
          personalizedMessage += ".";
        }
        if (totalPoints > 0) {
          personalizedMessage += ` Você acumulou ${totalPoints} pontos! 🏆`;
        }
        personalizedMessage += " Continue com o ótimo trabalho!";
      } else {
        personalizedMessage += '\n\nVejo que você ainda não registrou nenhuma atividade. Que tal explorar algumas dicas para começar ou definir suas primeiras metas? Estou aqui para ajudar! 🚀';
      }

      const initialMessage: ChatMessageType = {
        id: '1',
        type: 'ai',
        content: personalizedMessage,
        timestamp: new Date().toISOString(),
        suggestions: totalActivities > 0 
          ? ['Analise meu progresso', 'Dicas para melhorar', 'Como definir novas metas?']
          : ['Como começar?', 'Sugestões de atividades leves', 'Dicas de bem-estar']
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponseText = await generateGeminiResponse(currentInput);
      const aiMessage: ChatMessageType = {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        content: aiResponseText,
        timestamp: new Date().toISOString(),
        // Optional: Add suggestions if your Gemini setup can provide them
        // suggestions: ['Suggestion 1', 'Suggestion 2'],
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: ChatMessageType = {
        id: Date.now().toString() + '-error',
        type: 'ai',
        content: "Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.",
        timestamp: new Date().toISOString(),
        isError: true, // You might want to add an isError field to your ChatMessageType
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      // Ensure scrollToBottom is called after messages update
      // This might need a slight delay or to be called in the useEffect for messages
    }
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
