import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Bot,
  User,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'voice';
    url?: string;
    blob?: Blob;
  }[];
}

interface KalaMitraProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: 'buyer' | 'artisan' | 'admin';
}

export const KalaMitra: React.FC<KalaMitraProps> = ({
  isOpen,
  onToggle,
  userRole = 'buyer'
}) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: t('ai.welcome', 'Namaste! I\'m KalaMitra, your AI craft companion. How can I help you discover beautiful Indian crafts today?'),
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string, attachments?: Message['attachments']): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const currentLang = i18n.language;

    // Basic response logic based on user role and message content
    if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('madad')) {
      if (userRole === 'buyer') {
        return t('ai.helpBuyer', 'I can help you discover authentic Indian crafts! Ask me about specific crafts, artisans, or regions. I can also help with product recommendations and care instructions.');
      } else if (userRole === 'artisan') {
        return t('ai.helpArtisan', 'I can assist with product descriptions, pricing suggestions, and marketing ideas for your crafts. I can also help analyze your sales data.');
      }
      return t('ai.helpAdmin', 'I can provide insights on platform analytics, artisan performance, and market trends.');
    }

    if (userMessage.toLowerCase().includes('craft') || userMessage.toLowerCase().includes('product')) {
      return `Based on your interest in crafts, I recommend exploring our ${getRandomCraft()} collection from ${getRandomState()}. Would you like me to show you similar items or tell you more about this craft tradition?`;
    }

    if (attachments?.some(att => att.type === 'image')) {
      return 'I see you\'ve shared an image! I can help identify craft styles, suggest similar products, or provide care instructions for this type of artwork. What would you like to know?';
    }

    // Default contextual responses
    const responses = [
      'That\'s an interesting question! Let me help you explore the rich world of Indian craftsmanship.',
      'I\'d be happy to assist you with that. Indian crafts have such diverse traditions and techniques.',
      'Great question! Each Indian craft tells a unique story of heritage and skill.',
      'I can definitely help with that. Would you like recommendations based on region, material, or artisan?',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getRandomCraft = () => {
    const crafts = ['Madhubani paintings', 'Pattachitra art', 'Blue pottery', 'Banarasi silk', 'Kashmiri carpets', 'Tanjore paintings'];
    return crafts[Math.floor(Math.random() * crafts.length)];
  };

  const getRandomState = () => {
    const states = ['Bihar', 'Odisha', 'Rajasthan', 'Uttar Pradesh', 'Jammu & Kashmir', 'Tamil Nadu'];
    return states[Math.floor(Math.random() * states.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: selectedImage ? [{
        type: 'image',
        url: URL.createObjectURL(selectedImage)
      }] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const response = await generateResponse(inputValue, userMessage.attachments);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: t('ai.error', 'I\'m having trouble responding right now. Please try again.'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        console.log('Audio recorded:', audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const quickSuggestions = [
    t('ai.helpBuyer', 'Help me find products'),
    t('ai.helpArtisan', 'Help with product descriptions'),
    'Show me craft traditions',
    'Tell me about artisans',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-20 right-4 w-full max-w-sm mx-4 md:mx-0 md:right-6 md:bottom-6 z-50"
          >
            <Card className="h-[500px] flex flex-col shadow-2xl border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="relative">
                    <Bot className="h-6 w-6 text-primary" />
                    <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
                  </div>
                  <span>KalaMitra</span>
                  <Badge variant="secondary" className="text-xs">
                    {i18n.language.toUpperCase()}
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onToggle}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-4">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'assistant' && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        )}

                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                          <div className={`rounded-lg px-3 py-2 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>

                            {message.attachments?.map((attachment, index) => (
                              <div key={index} className="mt-2">
                                {attachment.type === 'image' && attachment.url && (
                                  <img
                                    src={attachment.url}
                                    alt="User uploaded"
                                    className="max-w-full h-auto rounded"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {message.type === 'user' && (
                          <div className="flex-shrink-0 order-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              {t('ai.thinking', 'Thinking...')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Quick Suggestions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInputValue(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t p-4 space-y-3">
                  {selectedImage && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm">{selectedImage.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('ai.askAnything', 'Ask me anything...')}
                      className="flex-1"
                    />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isRecording}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() && !selectedImage}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KalaMitra;
