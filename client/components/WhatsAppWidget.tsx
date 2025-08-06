import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showPulse, setShowPulse] = useState(true);
  const { t, dir, language } = useLanguage();

  // Hide pulse after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    const phoneNumber = '+1234567890'; // Replace with actual WhatsApp number
    const text = message || (language === 'fa' 
      ? 'سلام، در مورد محصولات استخر سوال دارم.'
      : 'Hello, I have a question about your pool products.');
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const quickMessages = [
    {
      text: language === 'fa' ? 'نیاز به مشاوره دارم' : 'I need consultation',
      icon: '💡'
    },
    {
      text: language === 'fa' ? 'قیمت محصولات چیست؟' : 'What are your prices?',
      icon: '💰'
    },
    {
      text: language === 'fa' ? 'زمان ارسال چقدر است؟' : 'What is delivery time?',
      icon: '🚚'
    },
    {
      text: language === 'fa' ? 'پشتیبانی فنی' : 'Technical support',
      icon: '🔧'
    }
  ];

  const widgetVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotate: -180 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      rotate: 180,
      transition: { duration: 0.3 }
    }
  };

  const chatVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      y: 20,
      x: dir === 'rtl' ? 20 : -20
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      y: 20,
      x: dir === 'rtl' ? 20 : -20,
      transition: { duration: 0.2 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <div className={`fixed bottom-6 z-50 ${dir === 'rtl' ? 'left-6' : 'right-6'}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${dir === 'rtl' ? 'mr-16' : 'ml-16'}`}
            dir={dir}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {language === 'fa' ? 'پشتیبانی آنلاین' : 'Online Support'}
                    </h3>
                    <div className="flex items-center space-x-2 text-green-100">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm">
                        {language === 'fa' ? 'آنلاین' : 'Online'}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="p-4 bg-gray-50">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">
                  {language === 'fa' 
                    ? '👋 سلام! چطور می‌تونم کمکتون کنم؟'
                    : '👋 Hello! How can I help you today?'
                  }
                </p>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-500 mb-3">
                {language === 'fa' ? 'پیام‌های سریع:' : 'Quick messages:'}
              </p>
              {quickMessages.map((msg, index) => (
                <motion.button
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMessage(msg.text);
                    handleSendMessage();
                  }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-all text-sm"
                >
                  <span className="mr-2">{msg.icon}</span>
                  {msg.text}
                </motion.button>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'fa' ? 'پیام خود را بنویسید...' : 'Type your message...'}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Call Option */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('tel:+1-800-POOL-PRO', '_blank')}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'fa' ? 'تماس مستقیم' : 'Call Us Now'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        variants={widgetVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all relative overflow-hidden"
        >
          {/* Pulse Animation */}
          <AnimatePresence>
            {showPulse && !isOpen && (
              <motion.div
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatType: "loop"
                }}
                className="absolute inset-0 bg-green-400 rounded-full"
              />
            )}
          </AnimatePresence>

          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </motion.div>

          {/* Notification Badge */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              1
            </motion.div>
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20, scale: 0.8 }}
              transition={{ delay: 1 }}
              className={`absolute top-1/2 transform -translate-y-1/2 ${dir === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'} bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg`}
            >
              {language === 'fa' ? 'چت آنلاین' : 'Chat with us'}
              <div className={`absolute top-1/2 transform -translate-y-1/2 ${dir === 'rtl' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-0 h-0 border-t-4 border-b-4 border-transparent ${dir === 'rtl' ? 'border-r-4 border-r-gray-900' : 'border-l-4 border-l-gray-900'}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
