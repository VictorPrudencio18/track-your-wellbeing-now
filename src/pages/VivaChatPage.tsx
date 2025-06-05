
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
  Search,
  Filter,
  Bookmark,
  Share2,
  Download,
  Upload,
  Camera,
  Paperclip,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Star,
  Flag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Bot,
  Users,
  FileText,
  PieChart,
  Calendar,
  Award,
  Lightbulb,
  Shield,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  Wifi,
  WifiOff,
  Bluetooth,
  Headphones,
  Keyboard,
  Mouse,
  Smartphone,
  Tablet,
  Monitor,
  Database,
  Server,
  Cloud,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Mail,
  Phone,
  Video,
  HelpCircle,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader
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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('stats');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('friendly');
  const [responseSpeed, setResponseSpeed] = useState([1]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [aiVoiceSpeed, setAiVoiceSpeed] = useState([1]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

**Dica Especial:** Baseado em ${totalActividades} atividades, seu corpo responde melhor a ${totalActivities % 3 === 0 ? 'treinos intervalados' : totalActivities % 2 === 0 ? 'exercícios de resistência' : 'atividades aeróbicas'}.

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
    fileInputRef.current?.click();
  };

  const handleTemplateUse = (template: ChatTemplate) => {
    setInputValue(template.content);
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
        className="min-h-[80vh] flex items-center justify-center p-4"
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`h-screen max-h-screen overflow-hidden p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-navy-900' : ''}`}
    >
      {/* Header Avançado */}
      <Card className="glass-card mb-4 border-navy-700/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-accent-orange via-accent-orange-light to-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-navy-900 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-400 rounded-full border-2 border-navy-900 animate-pulse flex items-center justify-center">
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-navy-900 rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white via-accent-orange to-yellow-400 bg-clip-text text-transparent">
                  IA VIVA - Sistema Avançado
                </h1>
                <p className="text-gray-300 text-xs lg:text-sm flex items-center gap-2 flex-wrap">
                  <Bot className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>Assistente com IA Completa</span>
                  <span className="hidden sm:inline">• Análise em Tempo Real</span>
                  <span className="hidden md:inline">• {totalActivities} Atividades Processadas</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
              {/* Status Indicators */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 text-xs">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  IA Ativa
                </Badge>
                {voiceEnabled && (
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400 text-xs">
                    <Mic className="w-3 h-3 mr-1" />
                    Voz
                  </Badge>
                )}
              </div>

              {/* Mode Selector */}
              <div className="flex gap-1 flex-wrap">
                {['casual', 'coaching', 'analysis', 'emergency', 'technical'].map((mode) => (
                  <Button
                    key={mode}
                    variant={chatMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setChatMode(mode as any)}
                    className={`text-xs lg:text-sm ${chatMode === mode ? "bg-accent-orange text-navy-900" : "text-gray-300 hover:text-white"} ${mode === 'emergency' ? 'hover:bg-red-500/20 hover:text-red-400' : ''}`}
                  >
                    {mode === 'casual' && <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />}
                    {mode === 'coaching' && <Heart className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />}
                    {mode === 'analysis' && <Brain className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />}
                    {mode === 'emergency' && <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />}
                    {mode === 'technical' && <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`text-xs lg:text-sm ${voiceEnabled ? "text-green-400" : "text-gray-400"}`}
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3 lg:w-4 lg:h-4" /> : <VolumeX className="w-3 h-3 lg:w-4 lg:h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="text-gray-300 hover:text-white hidden lg:flex"
                >
                  {showSidebar ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 className="w-3 h-3 lg:w-4 lg:h-4" /> : <Maximize2 className="w-3 h-3 lg:w-4 lg:h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className={`grid gap-4 h-[calc(100vh-200px)] ${showSidebar && !isFullscreen ? 'grid-cols-1 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {/* Área de Chat Principal */}
        <div className={showSidebar && !isFullscreen ? "xl:col-span-3" : "col-span-1"}>
          <Card className="glass-card h-full flex flex-col border-navy-700/30">
            {/* Chat Header com Controles */}
            <div className="border-b border-navy-700/20 p-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar mensagens..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 h-8 bg-navy-800/50 border-navy-600/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <Select value={messageFilter} onValueChange={setMessageFilter}>
                    <SelectTrigger className="w-full sm:w-32 h-8 bg-navy-800/50 border-navy-600/30 text-gray-300">
                      <Filter className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white text-xs lg:text-sm">
                    <Download className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white text-xs lg:text-sm">
                    <Share2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
              {/* Mensagens com Scroll */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                <div className="space-y-4 lg:space-y-6">
                  {searchedMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex gap-3 lg:gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-accent-orange to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-navy-900" />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] lg:max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                        {/* Message Content */}
                        <div className={`p-3 lg:p-4 rounded-2xl relative ${
                          message.type === 'user' 
                            ? 'bg-accent-orange text-navy-900' 
                            : `bg-navy-800/50 text-white border border-navy-700/30 ${
                                message.priority === 'urgent' ? 'border-red-500/50 bg-red-500/10' :
                                message.priority === 'high' ? 'border-yellow-500/50 bg-yellow-500/10' : ''
                              }`
                        }`}>
                          {message.priority === 'urgent' && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                          
                          <div className="whitespace-pre-wrap text-sm lg:text-base">{message.content}</div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 flex gap-2 flex-wrap">
                              {message.attachments.map((attachment, i) => (
                                <div key={i} className="bg-navy-700/30 p-2 rounded-lg flex items-center gap-2">
                                  <Paperclip className="w-3 h-3 lg:w-4 lg:h-4" />
                                  <span className="text-xs lg:text-sm">Anexo {i + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Message Actions */}
                        <div className={`flex items-center gap-2 mt-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {new Date(message.timestamp).toLocaleTimeString()}
                            {message.category && (
                              <Badge variant="outline" className="ml-2 text-xs text-gray-300 border-gray-600">
                                {message.category}
                              </Badge>
                            )}
                            {message.isPrivate && (
                              <Eye className="w-3 h-3 ml-1 text-yellow-400" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              onClick={() => handleReaction(message.id, '👍')}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              onClick={() => handleBookmark(message.id)}
                            >
                              <Bookmark className={`w-3 h-3 ${message.isBookmarked ? 'text-yellow-400' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {message.reactions.map((reaction, i) => (
                              <span key={i} className="text-sm bg-navy-700/30 px-2 py-1 rounded-full text-gray-300">
                                {reaction}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0 order-1 shadow-lg">
                          <User className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 lg:gap-4"
                    >
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-accent-orange to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-navy-900" />
                      </div>
                      <div className="bg-navy-800/50 p-3 lg:p-4 rounded-2xl border border-navy-700/30">
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
                  
                  {/* Div para scroll automático */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Avançado */}
              <div className="border-t border-navy-700/20 p-4 lg:p-6">
                <div className="space-y-4">
                  {/* Configurações Rápidas */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">Privacidade:</span>
                        <Switch 
                          checked={privacyMode} 
                          onCheckedChange={setPrivacyMode}
                          className="scale-75"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">Auto-scroll:</span>
                        <Switch 
                          checked={autoScroll} 
                          onCheckedChange={setAutoScroll}
                          className="scale-75"
                        />
                      </div>
                    </div>
                    <div className="text-gray-300">
                      Modo: <span className="text-accent-orange font-medium">{chatMode}</span>
                    </div>
                  </div>

                  {/* Input Principal */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Digite sua mensagem para a VIVA... (Modo: ${chatMode})`}
                        className="flex-1 bg-navy-800/50 border-navy-700/30 text-white resize-none min-h-[60px] pr-24 placeholder:text-gray-400"
                        rows={2}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      
                      {/* Input Controls */}
                      <div className="absolute right-2 bottom-2 flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={handleFileUpload}
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white"
                          onClick={() => setIsRecording(!isRecording)}
                        >
                          <Mic className={`w-4 h-4 ${isRecording ? 'text-red-400' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="bg-accent-orange hover:bg-accent-orange/90 text-navy-900 h-[60px] px-6 w-full sm:w-auto"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral Avançado */}
        {showSidebar && !isFullscreen && (
          <div className="space-y-4 lg:space-y-6">
            <Card className="glass-card border-navy-700/30">
              <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
                <TabsList className="grid w-full grid-cols-4 bg-navy-800/50">
                  <TabsTrigger value="stats" className="text-xs">
                    <TrendingUp className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="text-xs">
                    <Zap className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs">
                    <FileText className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Settings className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="p-4 lg:p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-orange" />
                    Analytics IA
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center bg-navy-800/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-accent-orange">{totalActivities}</div>
                      <div className="text-gray-400">Atividades</div>
                    </div>
                    <div className="text-center bg-navy-800/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-accent-orange">{currentStreak}</div>
                      <div className="text-gray-400">Sequência</div>
                    </div>
                    <div className="text-center bg-navy-800/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-accent-orange">{totalPoints}</div>
                      <div className="text-gray-400">Pontos</div>
                    </div>
                    <div className="text-center bg-navy-800/30 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-accent-orange">{currentLevel}</div>
                      <div className="text-gray-400">Nível</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progresso Semanal</span>
                      <span className="text-white">{Math.min(100, (currentStreak / 7) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-navy-800/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-accent-orange to-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="p-4 lg:p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent-orange" />
                    Ações Rápidas
                  </h3>
                  
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-accent-orange/10 group text-gray-300 hover:text-white"
                      onClick={action.action}
                    >
                      <action.icon className="w-5 h-5 mr-3 text-accent-orange flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-white text-sm">{action.title}</div>
                        <div className="text-gray-400 text-xs">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="templates" className="p-4 lg:p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent-orange" />
                    Templates
                  </h3>
                  
                  {chatTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-accent-orange/10 text-gray-300 hover:text-white"
                      onClick={() => handleTemplateUse(template)}
                    >
                      <div>
                        <div className="font-medium text-white text-sm">{template.title}</div>
                        <div className="text-gray-400 text-xs line-clamp-2">{template.content}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs text-gray-300 border-gray-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="p-4 lg:p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent-orange" />
                    Configurações IA
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Notificações</span>
                        <Switch 
                          checked={notificationsEnabled} 
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Modo Voz</span>
                        <Switch 
                          checked={voiceEnabled} 
                          onCheckedChange={setVoiceEnabled}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Velocidade da IA</label>
                      <Slider
                        value={responseSpeed}
                        onValueChange={setResponseSpeed}
                        max={3}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">
                        {responseSpeed[0]}x velocidade
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Personalidade da IA</label>
                      <Select value={aiPersonality} onValueChange={setAiPersonality}>
                        <SelectTrigger className="bg-navy-800/50 border-navy-600/30 text-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Amigável</SelectItem>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="motivational">Motivacional</SelectItem>
                          <SelectItem value="analytical">Analítica</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-navy-700/30" />

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-navy-700/30 text-gray-300 hover:text-white"
                      onClick={() => setMessages([])}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Limpar Chat
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </motion.div>
  );
}
