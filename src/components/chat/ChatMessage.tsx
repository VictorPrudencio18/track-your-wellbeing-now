
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Sparkles, 
  User, 
  Paperclip,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface ChatMessageProps {
  message: ChatMessage;
  index: number;
  onReaction: (messageId: string, reaction: string) => void;
  onBookmark: (messageId: string) => void;
}

export function ChatMessage({ message, index, onReaction, onBookmark }: ChatMessageProps) {
  return (
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
              onClick={() => onReaction(message.id, '👍')}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => onBookmark(message.id)}
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
  );
}
