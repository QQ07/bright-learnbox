
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// In a real app, this would come from an API
const demoMessages = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your educational assistant. How can I help you today?"
  }
];

export const ChatDialog = ({ open, onOpenChange }: ChatDialogProps) => {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (open && endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response (would be API call in real app)
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "This is a simulated educational AI response. In a real application, this would integrate with a proper educational AI service to provide helpful, educational content."
      };
      
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col p-0 gap-0 rounded-xl overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <DialogTitle className="text-center text-lg font-medium">Educational Assistant</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4 h-[400px]">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isUser={message.role === 'user'} 
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-center my-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            
            <div ref={endOfMessagesRef} />
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex p-4 border-t">
          <div className="relative w-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an educational question..."
              className="min-h-[80px] resize-none pr-12"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 bottom-2 h-8 w-8 p-0",
                "bg-primary text-white rounded-full"  
              )}
              size="icon"
            >
              <SendHorizontal size={16} />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
