
import React from 'react';
import { 
  TrendingUp, 
  Zap, 
  FileText, 
  Settings, 
  PieChart, 
  Brain, 
  Target, 
  AlertCircle, 
  Lightbulb, 
  RotateCcw 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

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

interface ChatSidebarProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  totalActivities: number;
  currentStreak: number;
  totalPoints: number;
  currentLevel: number;
  quickActions: QuickAction[];
  chatTemplates: ChatTemplate[];
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  responseSpeed: number[];
  setResponseSpeed: (speed: number[]) => void;
  aiPersonality: string;
  setAiPersonality: (personality: string) => void;
  onTemplateUse: (template: ChatTemplate) => void;
  onClearChat: () => void;
}

export function ChatSidebar({
  sidebarTab,
  setSidebarTab,
  totalActivities,
  currentStreak,
  totalPoints,
  currentLevel,
  quickActions,
  chatTemplates,
  notificationsEnabled,
  setNotificationsEnabled,
  voiceEnabled,
  setVoiceEnabled,
  responseSpeed,
  setResponseSpeed,
  aiPersonality,
  setAiPersonality,
  onTemplateUse,
  onClearChat
}: ChatSidebarProps) {
  return (
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
                onClick={() => onTemplateUse(template)}
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
                onClick={onClearChat}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar Chat
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
