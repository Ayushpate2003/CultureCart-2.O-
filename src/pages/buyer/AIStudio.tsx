import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles, Send, Mic, Lightbulb, Search, Package } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ProductRecommendation {
  id: number;
  title: string;
  price: string;
  image: string;
}

export default function AIStudio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI shopping assistant. I can help you find crafts, track orders, and answer questions about CultureCart. What would you like to know?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const suggestions = [
    'Find similar handcrafted ceramics under ₹2000',
    'Track my latest order',
    'Recommend gifts for festivals',
    'Show me trending crafts',
  ];

  const mockRecommendations: ProductRecommendation[] = [
    {
      id: 1,
      title: 'Blue Pottery Bowl',
      price: '₹1,799',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&q=80',
    },
    {
      id: 2,
      title: 'Terracotta Vase',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
    },
    {
      id: 3,
      title: 'Ceramic Tea Set',
      price: '₹1,899',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&q=80',
    },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let aiResponseText = '';
      let shouldShowRecommendations = false;

      if (inputMessage.toLowerCase().includes('find') || inputMessage.toLowerCase().includes('recommend')) {
        aiResponseText = 'I found some beautiful handcrafted ceramics for you! Here are my top recommendations:';
        shouldShowRecommendations = true;
      } else if (inputMessage.toLowerCase().includes('track') || inputMessage.toLowerCase().includes('order')) {
        aiResponseText = 'Your latest order (Order #12345) - Madhubani Painting is currently in transit. Expected delivery: 2 days. Would you like more details?';
      } else if (inputMessage.toLowerCase().includes('gift')) {
        aiResponseText = 'For festivals, I recommend traditional crafts like Diyas, Rangoli stencils, or handwoven textiles. They make thoughtful gifts that support artisans!';
      } else {
        aiResponseText = 'I\'ve analyzed your request. Based on your shopping history, I can suggest personalized recommendations. Would you like to see them?';
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setShowRecommendations(shouldShowRecommendations);
    }, 1000);

    setInputMessage('');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-hero rounded-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">AI Studio Assistant</h1>
                <p className="text-muted-foreground">
                  Your personal shopping companion powered by AI
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-warm transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-4">
                  <Search className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground">
                  Find crafts using natural language queries
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-4">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Order Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Check your order status with simple questions
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-4">
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Personalized</h3>
                <p className="text-sm text-muted-foreground">
                  Get recommendations based on your preferences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <Card className="shadow-warm border-2">
            <CardHeader className="bg-gradient-hero text-primary-foreground rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-white">AI Chat</CardTitle>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/90">Online</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="mr-2">
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Product Recommendations */}
                <AnimatePresence>
                  {showRecommendations && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4"
                    >
                      {mockRecommendations.map((product) => (
                        <Card
                          key={product.id}
                          className="cursor-pointer hover:shadow-warm transition-shadow"
                        >
                          <CardContent className="p-3">
                            <div className="aspect-square overflow-hidden rounded-lg mb-2">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                              />
                            </div>
                            <h4 className="font-semibold text-sm mb-1">
                              {product.title}
                            </h4>
                            <p className="text-primary font-bold">{product.price}</p>
                            <Button size="sm" className="w-full mt-2 bg-gradient-hero">
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Ask me anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button className="bg-gradient-hero" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
