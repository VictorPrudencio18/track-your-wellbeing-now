
import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Wifi, 
  Brain, 
  Mic, 
  MessageSquare, 
  Heart, 
  AlertCircle, 
  Settings, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  totalActivities: number;
  chatMode: string;
  setChatMode: (mode: string) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
}

export function ChatHeader({
  totalActivities,
  chatMode,
  setChatMode,
  voiceEnabled,
  setVoiceEnabled,
  showSidebar,
  setShowSidebar,
  isFullscreen,
  setIsFullscreen
}: ChatHeaderProps) {
  return (
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
                  onClick={() => setChatMode(mode)}
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
  );
}
