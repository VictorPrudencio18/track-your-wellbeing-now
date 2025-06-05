
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Shield, 
  Settings,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  chatMode: string;
  privacyMode: boolean;
  setPrivacyMode: (value: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  onFileUpload: () => void;
}

export function ChatInput({
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  chatMode,
  privacyMode,
  setPrivacyMode,
  autoScroll,
  setAutoScroll,
  isRecording,
  setIsRecording,
  onFileUpload
}: ChatInputProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Aqui implementaria a lógica de gravação de voz
  };

  return (
    <div className="p-3 lg:p-4 space-y-3">
      {/* Configurações Rápidas */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center gap-4 p-3 bg-navy-800/30 rounded-xl border border-navy-600/30"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <Label htmlFor="privacy" className="text-sm text-gray-300">Modo Privado</Label>
            <Switch
              id="privacy"
              checked={privacyMode}
              onCheckedChange={setPrivacyMode}
              className="scale-75"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-gray-400" />
            <Label htmlFor="autoscroll" className="text-sm text-gray-300">Auto Scroll</Label>
            <Switch
              id="autoscroll"
              checked={autoScroll}
              onCheckedChange={setAutoScroll}
              className="scale-75"
            />
          </div>
        </motion.div>
      )}

      {/* Input Principal */}
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Digite sua mensagem para a IA VIVA (modo ${chatMode})...`}
            className="min-h-[60px] max-h-32 resize-none bg-navy-800/60 border-navy-600/40 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-accent-orange/60 focus:bg-navy-800/80 text-sm leading-relaxed pr-12"
            disabled={isTyping}
          />
          
          {/* Contador de caracteres */}
          {inputValue.length > 100 && (
            <div className="absolute bottom-2 right-2 text-xs text-navy-500">
              {inputValue.length}/1000
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          {/* Botão de Anexo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onFileUpload}
            className="h-12 w-12 p-0 text-navy-400 hover:text-white hover:bg-navy-700/50 rounded-xl"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* Botão de Voz */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={`h-12 w-12 p-0 rounded-xl transition-all ${
              isRecording 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'text-navy-400 hover:text-white hover:bg-navy-700/50'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Botão de Configurações */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={`h-12 w-12 p-0 rounded-xl transition-all ${
              showSettings 
                ? 'bg-accent-orange/20 text-accent-orange' 
                : 'text-navy-400 hover:text-white hover:bg-navy-700/50'
            }`}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Botão de Enviar */}
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="h-12 px-6 bg-gradient-to-r from-accent-orange to-accent-orange-light hover:from-accent-orange-dark hover:to-accent-orange text-navy-900 rounded-xl shadow-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar
          </Button>
        </div>
      </div>

      {/* Indicador de Status */}
      {isTyping && (
        <div className="flex items-center gap-2 text-xs text-navy-400">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-accent-orange rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          IA VIVA está digitando...
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <motion.div
            className="w-2 h-2 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          Gravando áudio... Clique no microfone para parar
        </div>
      )}
    </div>
  );
}
