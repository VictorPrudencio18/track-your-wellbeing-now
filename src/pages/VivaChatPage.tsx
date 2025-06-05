
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  User, 
  Brain,
  Activity,
  Heart,
  TrendingUp,
  Settings,
  Mic,
  Send,
  RotateCcw,
  Zap,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useUserScores } from '@/hooks/useSupabaseScores';
import { Separator } from '@/components/ui/separator';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  category?: 'analysis' | 'suggestion' | 'coaching' | 'general';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

export default function VivaChatPage() {
  const { user } = useAuth();
  const { data: activities } = useActivities();
  const { data: userScores } = useUserScores();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'casual' | 'coaching' | 'analysis'>('casual');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Estatísticas do usuário
  const totalActivities = activities?.length || 0;
  const currentStreak = userScores?.current_streak || 0;
  const totalPoints = userScores?.total_points || 0;
  const currentLevel = userScores?.current_level || 1;

  // Inicializar chat com mensagem personalizada
  useEffect(() => {
    if (user && activities !== undefined && userScores !== undefined) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `Olá ${user.email?.split('@')[0] || 'amigo'}! 🌟 

Eu sou a VIVA, sua assistente pessoal de saúde e bem-estar! Estou aqui para te ajudar de forma completa e personalizada.

**Seus dados atuais:**
• ${totalActivities} atividades registradas
• Sequência atual: ${currentStreak} dias
• ${totalPoints} pontos acumulados
• Nível ${currentLevel}

Como posso te ajudar hoje? Posso analisar seu progresso, sugerir atividades personalizadas, te dar dicas de saúde mental, ou simplesmente conversar sobre seus objetivos! 💪✨`,
        timestamp: new Date().toISOString(),
        category: 'general'
      };

      setMessages([welcomeMessage]);
    }
  }, [user, activities, userScores, totalActivities, currentStreak, totalPoints, currentLevel]);

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

  const generateAIResponse = (userMessage: string, mode: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      let category: ChatMessage['category'] = 'general';

      // Análise de contexto baseada no input
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('análise') || lowerMessage.includes('progresso') || lowerMessage.includes('evolução')) {
        category = 'analysis';
        response = `📊 **Análise Detalhada do Seu Progresso**

Baseado em seus dados reais:

**Desempenho Geral:**
• ${totalActivities} atividades completadas
• Sequência atual: ${currentStreak} dias
• Nível atual: ${currentLevel}
• Total de pontos: ${totalPoints}

**Tendências:**
${currentStreak >= 7 ? '🔥 Excelente consistência! Você está mantendo uma rotina sólida.' : '⚡ Foque em manter regularidade para criar o hábito.'}
${totalActivities > 20 ? '💪 Você está muito ativo! Continue assim.' : '🚀 Que tal aumentar gradualmente suas atividades?'}

**Próximos Passos:**
1. ${currentStreak < 7 ? 'Mantenha a consistência por mais dias' : 'Varie os tipos de exercício'}
2. ${totalPoints < 500 ? 'Foque em atividades que geram mais pontos' : 'Defina metas mais desafiadoras'}
3. Monitore sua evolução semanalmente

Quer que eu analise algum aspecto específico?`;
      } 
      else if (lowerMessage.includes('sugest') || lowerMessage.includes('atividade') || lowerMessage.includes('exercício')) {
        category = 'suggestion';
        response = `🎯 **Sugestões Personalizadas para Você**

Com base no seu perfil e histórico:

**Para Hoje:**
• 30 min de caminhada rápida (15 pontos)
• Sessão de yoga de 20 min (12 pontos)
• Exercícios funcionais em casa (18 pontos)

**Esta Semana:**
• 2x corrida leve (25 min cada)
• 1x treino de força
• 3x atividades relaxantes (yoga/meditação)

**Dicas Especiais:**
${currentStreak > 0 ? '🔥 Você está em uma boa sequência! Mantenha o ritmo.' : '🚀 Comece devagar para criar o hábito.'}
${totalActivities < 10 ? '💡 Foque em atividades que você goste mais.' : '⚡ Experimente novos tipos de exercício.'}

**Meta da Semana:** ${totalPoints < 200 ? 'Acumular 100 pontos' : 'Manter sua média atual'}

Qual atividade te interessa mais?`;
      }
      else if (lowerMessage.includes('motivação') || lowerMessage.includes('desânimo') || lowerMessage.includes('difícil')) {
        category = 'coaching';
        response = `💪 **Coaching Personalizado**

Entendo que às vezes pode ser desafiador manter a constância. Vamos trabalhar juntos!

**Sua Jornada Até Agora:**
• Você já provou que consegue - ${totalActivities} atividades completadas!
• ${currentStreak > 0 ? `Você manteve ${currentStreak} dias de sequência - isso é incrível!` : 'Cada novo dia é uma oportunidade de recomeçar.'}

**Estratégias Motivacionais:**
1. **Micro-hábitos:** Comece com 5-10 minutos por dia
2. **Celebre pequenas vitórias:** Cada atividade conta
3. **Flexibilidade:** Adapte conforme sua energia
4. **Propósito:** Lembre-se do seu "porquê"

**Lembretes Importantes:**
• Progresso > Perfeição
• Consistência > Intensidade
• Autocompaixão é fundamental

${totalPoints > 100 ? 'Você já mostrou que é capaz - continue confiando em si!' : 'Você está no início de uma jornada incrível!'}

Como posso te apoiar mais hoje?`;
      }
      else {
        response = `Entendo! ${mode === 'coaching' ? '💪 Como seu coach pessoal,' : mode === 'analysis' ? '📊 Analisando seus dados,' : '😊'} posso te ajudar com várias coisas:

**Análises:** Progresso, tendências, estatísticas detalhadas
**Sugestões:** Atividades personalizadas, metas, desafios
**Coaching:** Motivação, estratégias, superação de obstáculos
**Conversas:** Dúvidas sobre saúde, bem-estar, qualidade de vida

${totalActivities > 0 ? `Baseado em suas ${totalActivities} atividades, vejo que você tem comprometimento!` : 'Vamos começar sua jornada de bem-estar juntos!'}

Sobre o que você gostaria de conversar especificamente?`;
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString(),
        category
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
    
    generateAIResponse(inputValue, chatMode);
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Análise Completa',
      description: 'Analisar todo meu progresso',
      icon: TrendingUp,
      action: () => {
        setInputValue('Faça uma análise completa do meu progresso');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '2',
      title: 'Sugestões Hoje',
      description: 'Atividades para hoje',
      icon: Zap,
      action: () => {
        setInputValue('Que atividades você sugere para hoje?');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '3',
      title: 'Motivação',
      description: 'Preciso de motivação',
      icon: Heart,
      action: () => {
        setInputValue('Estou desmotivado, pode me ajudar?');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '4',
      title: 'Definir Metas',
      description: 'Ajuda com objetivos',
      icon: Target,
      action: () => {
        setInputValue('Me ajude a definir metas realistas');
        setTimeout(handleSendMessage, 100);
      }
    }
  ];

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[80vh] flex items-center justify-center"
      >
        <Card className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-accent-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-navy-300">
            Faça login para conversar com a IA VIVA e ter acesso a análises personalizadas.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-2rem)] max-h-screen overflow-hidden"
    >
      {/* Header */}
      <Card className="glass-card mb-6 border-navy-700/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-navy-900 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-navy-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
                  IA VIVA - Chat Completo
                </h1>
                <p className="text-navy-400 text-sm">
                  Assistente pessoal com análise de dados reais
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
              <div className="flex gap-1">
                {['casual', 'coaching', 'analysis'].map((mode) => (
                  <Button
                    key={mode}
                    variant={chatMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChatMode(mode as any)}
                    className={chatMode === mode ? "bg-accent-orange text-navy-900" : ""}
                  >
                    {mode === 'casual' && <MessageSquare className="w-4 h-4 mr-1" />}
                    {mode === 'coaching' && <Heart className="w-4 h-4 mr-1" />}
                    {mode === 'analysis' && <Brain className="w-4 h-4 mr-1" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-120px)]">
        {/* Área de Chat Principal */}
        <div className="lg:col-span-3">
          <Card className="glass-card h-full flex flex-col border-navy-700/30">
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Mensagens */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-navy-900" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-accent-orange text-navy-900' 
                            : 'bg-navy-800/50 text-white border border-navy-700/30'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        
                        <div className={`flex items-center gap-2 mt-2 text-xs text-navy-400 ${
                          message.type === 'user' ? 'justify-end' : ''
                        }`}>
                          <Clock className="w-3 h-3" />
                          {new Date(message.timestamp).toLocaleTimeString()}
                          {message.category && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {message.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0 order-1">
                          <User className="w-5 h-5 text-navy-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-yellow-400 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-navy-900" />
                      </div>
                      <div className="bg-navy-800/50 p-4 rounded-2xl border border-navy-700/30">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-accent-orange rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input de Mensagem */}
              <div className="border-t border-navy-700/20 p-6">
                <div className="flex gap-3">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Digite sua mensagem para a VIVA... (Modo: ${chatMode})`}
                    className="flex-1 bg-navy-800/50 border-navy-700/30 text-white resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-accent-orange hover:bg-accent-orange/90 text-navy-900"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-navy-700/30">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Estatísticas Rápidas */}
          <Card className="glass-card border-navy-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-orange" />
                Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-orange">{totalActivities}</div>
                  <div className="text-navy-400">Atividades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-orange">{currentStreak}</div>
                  <div className="text-navy-400">Sequência</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-orange">{totalPoints}</div>
                  <div className="text-navy-400">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-orange">{currentLevel}</div>
                  <div className="text-navy-400">Nível</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card className="glass-card border-navy-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-orange" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-accent-orange/10"
                  onClick={action.action}
                >
                  <action.icon className="w-4 h-4 mr-3 text-accent-orange flex-shrink-0" />
                  <div>
                    <div className="font-medium text-white text-sm">{action.title}</div>
                    <div className="text-navy-400 text-xs">{action.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Configurações do Chat */}
          <Card className="glass-card border-navy-700/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent-orange" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-navy-700/30"
                onClick={() => setMessages([])}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
