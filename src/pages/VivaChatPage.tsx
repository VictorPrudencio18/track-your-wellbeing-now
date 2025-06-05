import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Share2,
  PieChart,
  Brain,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useUserScores } from '@/hooks/useSupabaseScores';

// Import the new components
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  category?: 'analysis' | 'suggestion' | 'coaching' | 'general' | 'emergency' | 'technical';
  reactions?: string[];
  attachments?: string[];
  voiceNote?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isBookmarked?: boolean;
  isPrivate?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  action: () => void;
}

interface ChatTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export default function VivaChatPage() {
  const { user } = useAuth();
  const { data: activities } = useActivities();
  const { data: userScores } = useUserScores();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'casual' | 'coaching' | 'analysis' | 'emergency' | 'technical'>('casual');
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [aiPersonality, setAiPersonality] = useState('friendly');
  const [responseSpeed, setResponseSpeed] = useState([1]);
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar fechada por padrão no mobile
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estatísticas do usuário
  const totalActivities = activities?.length || 0;
  const currentStreak = userScores?.current_streak || 0;
  const totalPoints = userScores?.total_points || 0;
  const currentLevel = userScores?.current_level || 1;

  // Templates de conversa
  const chatTemplates: ChatTemplate[] = [
    {
      id: '1',
      title: 'Análise Completa',
      content: 'Faça uma análise detalhada do meu progresso nas últimas 4 semanas, incluindo tendências, pontos fortes e áreas de melhoria.',
      category: 'analysis',
      tags: ['progresso', 'análise', 'relatório']
    },
    {
      id: '2',
      title: 'Plano de Treino',
      content: 'Crie um plano de treino personalizado para os próximos 7 dias, considerando meu nível atual e objetivos.',
      category: 'coaching',
      tags: ['treino', 'plano', 'exercícios']
    },
    {
      id: '3',
      title: 'Motivação Diária',
      content: 'Preciso de uma dose de motivação para manter minha rotina de exercícios. Me ajude a encontrar meu propósito.',
      category: 'coaching',
      tags: ['motivação', 'inspiração', 'mentalidade']
    },
    {
      id: '4',
      title: 'Dicas de Nutrição',
      content: 'Sugira um plano alimentar balanceado que complemente minha rotina de exercícios atual.',
      category: 'suggestion',
      tags: ['nutrição', 'alimentação', 'dieta']
    },
    {
      id: '5',
      title: 'Recuperação e Descanso',
      content: 'Como posso melhorar minha recuperação entre treinos e otimizar meu sono?',
      category: 'general',
      tags: ['recuperação', 'sono', 'descanso']
    }
  ];

  // Inicializar chat com mensagem personalizada avançada
  useEffect(() => {
    if (user && activities !== undefined && userScores !== undefined) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content: `🌟 **Olá ${user.email?.split('@')[0] || 'amigo'}!** Bem-vindo ao sistema avançado da IA VIVA!

Sou sua assistente pessoal de saúde e bem-estar com capacidades expandidas. Agora posso:

**💪 Seus Dados Atuais:**
• ${totalActivities} atividades registradas
• Sequência atual: ${currentStreak} dias
• ${totalPoints} pontos acumulados  
• Nível ${currentLevel}

**🚀 Novas Funcionalidades:**
• Análise avançada com IA
• Sugestões personalizadas em tempo real
• Coaching motivacional especializado
• Templates de conversa prontos
• Interação por voz
• Histórico inteligente e busca
• Modo privacidade e segurança

**🎯 Como posso te ajudar hoje?**
Explore os templates na barra lateral, use comandos de voz, ou simplesmente me conte como você está se sentindo. Estou aqui para uma experiência completa de bem-estar!`,
        timestamp: new Date().toISOString(),
        category: 'general',
        priority: 'medium'
      };

      setMessages([welcomeMessage]);
    }
  }, [user, activities, userScores, totalActivities, currentStreak, totalPoints, currentLevel]);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAdvancedAIResponse = (userMessage: string, mode: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      let category: ChatMessage['category'] = 'general';
      let priority: ChatMessage['priority'] = 'medium';

      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('emergência') || lowerMessage.includes('urgent') || lowerMessage.includes('ajuda')) {
        category = 'emergency';
        priority = 'urgent';
        response = `🚨 **Resposta de Emergência Ativada**

Entendo que você precisa de ajuda urgente. Estou aqui para te apoiar.

**Ações Imediatas:**
1. Respire fundo - inspire por 4s, segure por 4s, expire por 6s
2. Se for emergência médica, procure ajuda profissional
3. Para crise emocional, ligue 188 (CVV - Centro de Valorização da Vida)

**Seu Status Atual:**
• ${totalActivities} atividades te mostram que você é forte
• Você já superou desafios antes
• Estou monitorando nossa conversa em modo prioritário

Como posso te ajudar especificamente agora?`;
      }
      else if (lowerMessage.includes('análise') || lowerMessage.includes('progresso') || lowerMessage.includes('evolução')) {
        category = 'analysis';
        response = `📊 **Sistema de Análise Avançada Ativado**

🔍 **Análise Profunda dos Seus Dados:**

**Performance Geral:**
• ${totalActivities} atividades completadas (${totalActivities > 50 ? 'Alto Volume' : totalActivities > 20 ? 'Volume Moderado' : 'Iniciando Jornada'})
• Sequência atual: ${currentStreak} dias (${currentStreak >= 14 ? '🔥 Excelente!' : currentStreak >= 7 ? '⚡ Boa!' : '🚀 Crescendo'})
• Nível ${currentLevel} - ${totalPoints} pontos
• Taxa de crescimento: ${totalActivities > 0 ? '+' + Math.round((totalPoints / totalActivities) * 10) / 10 : '0'} pts/atividade

**Análise Comportamental:**
${currentStreak > 0 ? '✅ Padrão de consistência detectado' : '⚠️ Oportunidade de criar rotina'}
${totalActivities > 30 ? '✅ Alta aderência ao programa' : '💡 Potencial de crescimento identificado'}

**Recomendações IA:**
1. ${currentStreak < 7 ? 'Foque em manter 7 dias consecutivos' : 'Varie os tipos de atividade para evitar monotonia'}
2. ${totalPoints < 500 ? 'Aumente gradualmente a intensidade' : 'Defina metas mais desafiadoras'}
3. Implemente período de recuperação ativa

**Próxima Meta Sugerida:** ${totalActivities < 20 ? 'Alcançar 20 atividades' : totalPoints < 1000 ? 'Atingir 1000 pontos' : 'Manter consistência avançada'}

Quer análise específica de algum período ou métrica?`;
      }
      else if (lowerMessage.includes('sugest') || lowerMessage.includes('atividade') || lowerMessage.includes('exercício')) {
        category = 'suggestion';
        response = `🎯 **Centro de Sugestões Personalizadas**

🧠 **IA analisando seu perfil...**

**Sugestões para Hoje:**
${currentStreak > 0 ? '🔥 Mantenha o ritmo! Sugestões para continuar a sequência:' : '🚀 Vamos começar! Sugestões para iniciar:'}

• **Cardio Inteligente:** 25-35 min (${15 + Math.floor(totalActivities/10 * 5)} pontos)
• **Força Funcional:** 20 min (${12 + Math.floor(totalActivities/15 * 3)} pontos)
• **Mobilidade Ativa:** 15 min (${8 + Math.floor(totalActivities/20 * 2)} pontos)
• **Mindfulness:** 10 min (${6 + Math.floor(totalActivities/25 * 2)} pontos)

**Plano Semanal Inteligente:**
${totalActivities < 10 ? 
  `🌱 **Programa Iniciante:**
  - 3x atividades leves (20-30 min)
  - 2x exercícios de mobilidade
  - 1x atividade social esportiva
  - 1x dia de descanso ativo` :
  `💪 **Programa Avançado:**
  - 4x treinos variados (30-45 min)
  - 2x atividades cardiovasculares
  - 1x treino de força
  - Recuperação inteligente`
}

**Meta da Semana:** ${totalPoints < 200 ? 'Acumular 150 pontos' : 'Superar sua média atual em 20%'}

**Dica Especial:** Baseado em ${totalActivities} atividades, seu corpo responde melhor a ${totalActivities % 3 === 0 ? 'treinos intervalados' : totalActivities % 2 === 0 ? 'exercícios de resistência' : 'atividades aeróbicas'}.

Que tipo de atividade desperta mais seu interesse agora?`;
      }
      else if (lowerMessage.includes('motivação') || lowerMessage.includes('desânimo') || lowerMessage.includes('difícil')) {
        category = 'coaching';
        priority = 'high';
        response = `💪 **Centro de Coaching Avançado**

🎯 **Análise Motivacional Personalizada**

Entendo completamente esse momento. Todos os grandes atletas e pessoas de sucesso passaram por isso.

**Sua Jornada Até Agora:**
• ${totalActivities} atividades = ${totalActivities} vitórias pessoais! 🏆
• ${currentStreak > 0 ? `${currentStreak} dias consecutivos provam sua determinação 🔥` : 'Cada recomeço é uma nova oportunidade de vitória 🌅'}
• Nível ${currentLevel} = você já evoluiu ${currentLevel - 1} vezes!

**Estratégias de Coaching Personalizado:**

🧠 **Mental:**
- Foque no processo, não no resultado
- Celebre pequenas vitórias diárias
- ${totalActivities > 0 ? 'Você já provou que consegue!' : 'Você tem potencial inexplorado!'}

⚡ **Físico:**
- Comece com micro-hábitos (5 min)
- Progresso > Perfeição
- Movimento é medicina

🎯 **Estratégico:**
- Defina metas SMART específicas
- Track progress visualmente
- Crie sistema de recompensas

**Mantra do Dia:** "${totalActivities > 0 ? 'Eu já consegui antes, vou conseguir novamente!' : 'Hoje eu planto a semente do meu futuro eu!'}"

**Próximo Passo Micro:** ${currentStreak === 0 ? 'Apenas 10 minutos de movimento hoje' : 'Manter o momentum com atividade leve'}

Lembra-se: Eu estarei aqui em cada passo da sua jornada. Como posso te apoiar especificamente hoje?`;
      }
      else {
        response = `🤖 **VIVA - Sistema Avançado de IA**

Olá! Como sua assistente avançada, posso te ajudar com uma ampla gama de funcionalidades:

**🧠 Análise & Insights:**
• Análise profunda de dados e padrões
• Relatórios personalizados com IA
• Previsões e tendências

**🏃‍♂️ Coaching & Motivação:**
• Coaching personalizado baseado em comportamento
• Estratégias de motivação adaptativas
• Planos de ação específicos

**📋 Sugestões Inteligentes:**
• Atividades baseadas em seu perfil
• Recomendações contextuais
• Planos adaptativos

**🎯 Funcionalidades Avançadas:**
• Modo emergência 24/7
• Interação por voz
• Templates prontos
• Busca inteligente no histórico
• Análise de sentimentos

**💡 Dica:** Use os templates na barra lateral ou experimente comandos como:
- "Análise completa"
- "Sugestões para hoje" 
- "Preciso de motivação"
- "Modo emergência"

Baseado em seus ${totalActivities} atividades, vejo que você tem comprometimento real! Sobre o que você gostaria de conversar especificamente?`;
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString(),
        category,
        priority
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Notificação se habilitada
      if (notificationsEnabled && priority === 'urgent') {
        new Notification('VIVA - Resposta Urgente', {
          body: 'Nova resposta prioritária disponível',
          icon: '/favicon.ico'
        });
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      isPrivate: privacyMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    generateAdvancedAIResponse(inputValue, chatMode);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
        : msg
    ));
  };

  const handleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isBookmarked: !msg.isBookmarked }
        : msg
    ));
  };

  const handleFileUpload = () => {
    // File upload logic here
  };

  const handleTemplateUse = (template: ChatTemplate) => {
    setInputValue(template.content);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const filteredMessages = messages.filter(msg => {
    if (messageFilter === 'all') return true;
    if (messageFilter === 'bookmarked') return msg.isBookmarked;
    if (messageFilter === 'ai') return msg.type === 'ai';
    if (messageFilter === 'user') return msg.type === 'user';
    return msg.category === messageFilter;
  });

  const searchedMessages = filteredMessages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Análise 360°',
      description: 'Análise completa com IA',
      icon: PieChart,
      category: 'analysis',
      action: () => {
        setInputValue('Faça uma análise 360° completa do meu progresso com insights avançados de IA');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '2',
      title: 'Plano Smart',
      description: 'Plano inteligente personalizado',
      icon: Brain,
      category: 'planning',
      action: () => {
        setInputValue('Crie um plano smart personalizado para os próximos 7 dias com metas adaptativas');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '3',
      title: 'Boost Motivacional',
      description: 'Coaching intensivo',
      icon: Zap,
      category: 'motivation',
      action: () => {
        setInputValue('Preciso de um boost motivacional intensivo com estratégias de coaching avançado');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '4',
      title: 'Meta Desafio',
      description: 'Criar nova meta desafiadora',
      icon: Target,
      category: 'goals',
      action: () => {
        setInputValue('Me ajude a definir uma meta desafiadora e realista com cronograma detalhado');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '5',
      title: 'SOS Bem-estar',
      description: 'Suporte de emergência',
      icon: AlertCircle,
      category: 'emergency',
      action: () => {
        setChatMode('emergency');
        setInputValue('Preciso de suporte de emergência para bem-estar e saúde mental');
        setTimeout(handleSendMessage, 100);
      }
    },
    {
      id: '6',
      title: 'Insights IA',
      description: 'Descobertas com inteligência artificial',
      icon: Lightbulb,
      category: 'insights',
      action: () => {
        setInputValue('Mostre insights e padrões ocultos nos meus dados usando IA avançada');
        setTimeout(handleSendMessage, 100);
      }
    }
  ];

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-accent-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sistema Avançado VIVA</h2>
          <p className="text-gray-300">
            Faça login para acessar o sistema completo de IA com análises avançadas e funcionalidades personalizadas.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col bg-navy-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header Responsivo */}
      <div className="flex-shrink-0 relative z-10">
        <ChatHeader
          totalActivities={totalActivities}
          chatMode={chatMode}
          setChatMode={setChatMode}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex overflow-hidden relative z-10 min-h-0">
        {/* Área de Chat Principal */}
        <div className={`flex-1 flex flex-col transition-all duration-300 min-h-0 ${showSidebar ? 'lg:mr-80' : ''}`}>
          <Card className="flex-1 glass-card border-navy-700/30 m-2 lg:m-4 flex flex-col overflow-hidden min-h-0">
            {/* Controles do Chat */}
            <div className="flex-shrink-0 border-b border-navy-700/20 p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Input
                      placeholder="Buscar mensagens..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 sm:w-48 h-8 bg-navy-800/50 border-navy-600/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Select value={messageFilter} onValueChange={setMessageFilter}>
                    <SelectTrigger className="w-full sm:w-32 h-8 bg-navy-800/50 border-navy-600/30 text-gray-300">
                      <Filter className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-navy-600">
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="ai">IA</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="bookmarked">Favoritas</SelectItem>
                      <SelectItem value="analysis">Análises</SelectItem>
                      <SelectItem value="coaching">Coaching</SelectItem>
                      <SelectItem value="emergency">Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white text-xs">
                    <Share2 className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Área de Mensagens com Scroll */}
            <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 p-4 lg:p-6 min-h-full">
                  {searchedMessages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      index={index}
                      onReaction={handleReaction}
                      onBookmark={handleBookmark}
                    />
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-navy-900" />
                      </div>
                      <div className="bg-navy-800/50 p-4 rounded-2xl border border-navy-700/30">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-accent-orange rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">IA processando com modo {chatMode}...</div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex-shrink-0 border-t border-navy-700/20 bg-gradient-to-r from-navy-800/50 to-navy-700/30 backdrop-blur-sm">
                <ChatInput
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  chatMode={chatMode}
                  privacyMode={privacyMode}
                  setPrivacyMode={setPrivacyMode}
                  autoScroll={autoScroll}
                  setAutoScroll={setAutoScroll}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                  onFileUpload={handleFileUpload}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Responsiva */}
        {showSidebar && (
          <>
            {/* Overlay para mobile */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
            
            {/* Sidebar */}
            <div className={`
              fixed lg:absolute top-0 right-0 h-full w-80 z-50 lg:z-10
              transform transition-transform duration-300 ease-in-out
              ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
              <ChatSidebar
                sidebarTab={sidebarTab}
                setSidebarTab={setSidebarTab}
                totalActivities={totalActivities}
                currentStreak={currentStreak}
                totalPoints={totalPoints}
                currentLevel={currentLevel}
                quickActions={quickActions}
                chatTemplates={[]}
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
                voiceEnabled={voiceEnabled}
                setVoiceEnabled={setVoiceEnabled}
                responseSpeed={responseSpeed}
                setResponseSpeed={setResponseSpeed}
                aiPersonality={aiPersonality}
                setAiPersonality={setAiPersonality}
                onTemplateUse={handleTemplateUse}
                onClearChat={handleClearChat}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
