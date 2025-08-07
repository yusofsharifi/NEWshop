import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Send, Paperclip, Smile, Phone, Video,
  User, Clock, Check, CheckCheck, Image as ImageIcon, File,
  Minimize2, Maximize2, MoreVertical, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_type: 'customer' | 'agent';
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachment?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };
}

interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  response_time: number;
  rating: number;
  active_chats: number;
}

interface ChatSession {
  id: string;
  agent?: ChatAgent;
  status: 'waiting' | 'connected' | 'ended';
  created_at: string;
  estimated_wait_time?: number;
  queue_position?: number;
}

export default function LiveChat() {
  const { language, dir } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock agent data
  const mockAgent: ChatAgent = {
    id: 'agent1',
    name: 'سارا احمدی',
    avatar: '/placeholder.svg',
    title: 'متخصص پشتیبانی',
    status: 'online',
    response_time: 2,
    rating: 4.8,
    active_chats: 3
  };

  // Mock initial messages
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender_id: 'system',
      sender_name: 'سیستم',
      sender_type: 'agent',
      message: language === 'fa' 
        ? 'سلام! خوش آمدید. چطور می‌توانم کمکتان کنم؟'
        : 'Hello! Welcome. How can I help you today?',
      message_type: 'system',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'delivered'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(initialMessages);
      setSession({
        id: 'session1',
        agent: mockAgent,
        status: 'connected',
        created_at: new Date().toISOString()
      });
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && unreadCount === 0) {
      setUnreadCount(messages.filter(m => m.sender_type === 'agent' && m.status !== 'read').length);
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender_id: user?.id.toString() || 'user',
      sender_name: user?.username || 'مهمان',
      sender_type: 'customer',
      message: newMessage,
      message_type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    setTimeout(() => {
      setIsTyping(false);
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender_id: mockAgent.id,
        sender_name: mockAgent.name,
        sender_avatar: mockAgent.avatar,
        sender_type: 'agent',
        message: language === 'fa' 
          ? 'ممنون از پیامتان. در حال بررسی سؤال شما هستم...'
          : 'Thank you for your message. I\'m looking into your question...',
        message_type: 'text',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 4000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender_id: user?.id.toString() || 'user',
      sender_name: user?.username || 'مهمان',
      sender_type: 'customer',
      message: `${language === 'fa' ? 'فایل ارسال شد:' : 'File sent:'} ${file.name}`,
      message_type: 'file',
      timestamp: new Date().toISOString(),
      status: 'sending',
      attachment: {
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    setMessages(prev => [...prev, message]);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent': return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isCustomer = message.sender_type === 'customer';
    const isSystem = message.message_type === 'system';

    if (isSystem) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
            {message.message}
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isCustomer ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isCustomer ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-[80%]`}>
          {!isCustomer && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender_avatar} />
              <AvatarFallback>{message.sender_name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
            {!isCustomer && (
              <span className="text-xs text-gray-500 mb-1">{message.sender_name}</span>
            )}
            
            <div className={`rounded-2xl px-4 py-2 max-w-full break-words ${
              isCustomer 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.message_type === 'file' && message.attachment ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4" />
                    <span className="text-sm font-medium">{message.attachment.name}</span>
                  </div>
                  <div className="text-xs opacity-75">
                    {formatFileSize(message.attachment.size)}
                  </div>
                </div>
              ) : (
                <p>{message.message}</p>
              )}
            </div>
            
            <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
              isCustomer ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {isCustomer && getMessageStatusIcon(message.status)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ChatButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
    >
      <MessageCircle className="w-6 h-6" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -left-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
          {unreadCount}
        </Badge>
      )}
    </motion.button>
  );

  const ChatWindow = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: isMinimized ? 0.3 : 1, 
        y: isMinimized ? 200 : 0,
        height: isMinimized ? 60 : 500
      }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all ${
        isMinimized ? 'cursor-pointer' : ''
      }`}
      onClick={isMinimized ? () => setIsMinimized(false) : undefined}
      dir={dir}
    >
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {session?.agent && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={session.agent.avatar} />
              <AvatarFallback>{session.agent.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h3 className="font-medium text-sm">
              {session?.agent?.name || (language === 'fa' ? 'پشتیبانی آنلاین' : 'Live Support')}
            </h3>
            <p className="text-xs opacity-75">
              {session?.agent ? (
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{language === 'fa' ? 'آنلاین' : 'Online'}</span>
                </span>
              ) : (
                language === 'fa' ? 'معمولاً در کمتر از ۲ دقیقه پاسخ می‌دهیم' : 'We typically reply in under 2 minutes'
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-600 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-80 p-4">
            <div>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 mb-4"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session?.agent?.avatar} />
                    <AvatarFallback>{session?.agent?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === 'fa' ? 'پیام خود را بنویسید...' : 'Type your message...'}
                  className="min-h-[40px] max-h-24 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 w-8 h-8 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {!isOpen && <ChatButton />}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpen && <ChatWindow />}
      </AnimatePresence>
    </>
  );
}

// Quick Support Links Component
export const QuickSupport = () => {
  const { language } = useLanguage();

  const supportOptions = [
    {
      icon: MessageCircle,
      title: language === 'fa' ? 'چت زنده' : 'Live Chat',
      description: language === 'fa' ? 'صحبت فوری با پشتیبانی' : 'Instant chat with support',
      action: () => {}, // Will be handled by LiveChat component
      color: 'blue'
    },
    {
      icon: Phone,
      title: language === 'fa' ? 'تماس تلفنی' : 'Phone Call',
      description: language === 'fa' ? '۰۲۱-۱۲۳۴۵۶۷۸' : '+98 21 12345678',
      action: () => window.open('tel:+982112345678'),
      color: 'green'
    },
    {
      icon: Video,
      title: language === 'fa' ? 'ویدیو کال' : 'Video Call',
      description: language === 'fa' ? 'مشاوره تصویری' : 'Video consultation',
      action: () => window.open('/consultation'),
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {supportOptions.map((option, index) => {
        const Icon = option.icon;
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={option.action}
            className="p-6 border rounded-xl cursor-pointer hover:shadow-lg transition-all bg-white"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              option.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              option.color === 'green' ? 'bg-green-100 text-green-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
