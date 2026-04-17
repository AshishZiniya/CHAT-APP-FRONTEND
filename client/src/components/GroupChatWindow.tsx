import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Phone, Video, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import GroupInfo from '@/components/GroupInfo';

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

interface GroupChatWindowProps {
  groupId: string;
  groupName: string;
  memberCount: number;
  groupAvatar: string;
}

// Mock messages
const MOCK_GROUP_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Hey everyone! How\'s the project going?',
    sender: 'Alice Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    timestamp: '10:30 AM',
    isOwn: false,
    status: 'read',
  },
  {
    id: '2',
    content: 'We\'re making good progress on the design phase',
    sender: 'Bob Smith',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    timestamp: '10:32 AM',
    isOwn: false,
    status: 'read',
  },
  {
    id: '3',
    content: 'Great! Let me know if you need any resources',
    sender: 'You',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    timestamp: '10:34 AM',
    isOwn: true,
    status: 'read',
  },
  {
    id: '4',
    content: 'Thanks! We\'ll update you by EOD',
    sender: 'Alice Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    timestamp: '10:35 AM',
    isOwn: false,
    status: 'read',
  },
];

export default function GroupChatWindow({
  groupId,
  groupName,
  memberCount,
  groupAvatar,
}: GroupChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_GROUP_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
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
    <div className="flex h-full bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={groupAvatar}
              alt={groupName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-foreground">{groupName}</h3>
              <p className="text-xs text-muted-foreground">{memberCount} members</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGroupInfo(!showGroupInfo)}
              className="hover:bg-secondary"
            >
              <Info className="w-5 h-5" />
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
                placeholder="Message the group..."
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

      {/* Group Info Sidebar */}
      {showGroupInfo && (
        <GroupInfo
          groupName={groupName}
          memberCount={memberCount}
          onClose={() => setShowGroupInfo(false)}
        />
      )}
    </div>
  );
}
