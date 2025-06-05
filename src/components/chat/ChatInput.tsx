
import React, { useRef } from 'react';
import { Send, Paperclip, Mic, Smile, Shield, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  chatMode: string;
  privacyMode: boolean;
  setPrivacyMode: (enabled: boolean) => void;
  autoScroll: boolean;
  setAutoScroll: (enabled: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
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
                  onSendMessage();
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
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-accent-orange hover:bg-accent-orange/90 text-navy-900 h-[60px] px-6 w-full sm:w-auto"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={onFileUpload}
      />
    </div>
  );
}
