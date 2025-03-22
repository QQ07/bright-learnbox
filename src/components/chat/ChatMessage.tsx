
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: string;
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isUser: boolean;
}

export const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div 
      className={cn(
        "flex items-start gap-2.5",
        isUser ? "justify-end" : "justify-start",
        "animate-scale-in"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 rounded-full bg-primary/20 items-center justify-center">
          <Bot size={16} className="text-primary" />
        </div>
      )}
      
      <div 
        className={cn(
          "rounded-lg px-4 py-2.5 max-w-[80%]",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
      
      {isUser && (
        <div className="flex h-8 w-8 rounded-full bg-primary items-center justify-center">
          <User size={16} className="text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
