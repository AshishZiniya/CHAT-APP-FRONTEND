import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';

interface Message {
  id: string;
  content: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
}

interface ChatWindowProps {
  chatId: string;
}

// Mock messages
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    sender: 'Alice Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    timestamp: '10:30 AM',
    isOwn: false,
    status: 'read',
  },
  {
    id: '2',
    content: 'I\'m doing great! Just finished the project.',
    sender: 'You',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    timestamp: '10:32 AM',
    isOwn: true,
    status: 'read',
  },
  {
    id: '3',
    content: 'That\'s awesome! Can\'t wait to see it.',
    sender: 'Alice Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    timestamp: '10:33 AM',
    isOwn: false,
    status: 'read',
  },
  {
    id: '4',
    content: 'Let me send you the preview',
    sender: 'You',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    timestamp: '10:34 AM',
    isOwn: true,
    status: 'delivered',
  },
];

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      content: inputValue,
      sender: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
            alt="Alice"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-foreground">Alice Johnson</h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-secondary">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary">
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            showAvatar={
              index === 0 ||
              messages[index - 1].sender !== message.sender
            }
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 shadow-lg">
        <div className="flex gap-3 items-end">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 flex gap-2 items-center bg-secondary rounded-full px-4 py-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary flex-shrink-0"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] hover:from-[#E55A3A] hover:to-[#CC4A2A] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
