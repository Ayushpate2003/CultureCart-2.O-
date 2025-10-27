import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Search, Send, Mic, Sparkles } from 'lucide-react';
import { useMessagesStore } from '@/stores/messagesStore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Messages() {
  const { threads, addMessage, markAsRead } = useMessagesStore();
  const { toast } = useToast();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentThread = threads.find(t => t.id === selectedThread);

  const filteredThreads = threads.filter(thread =>
    thread.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return;

    addMessage(selectedThread, {
      text: newMessage,
      sender: 'artisan',
    });

    setNewMessage('');
    toast({
      title: 'Message sent',
      description: 'Your message has been delivered successfully.',
    });
  };

  const quickReplies = [
    'Thank you for your order!',
    'I\'ll ship it today.',
    'Custom orders are welcome!',
    'Let me check and get back to you.',
  ];

  const handleSelectThread = (threadId: string) => {
    setSelectedThread(threadId);
    markAsRead(threadId);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Connect with your customers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Threads List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredThreads.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No messages found</p>
                    </div>
                  ) : (
                    filteredThreads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => handleSelectThread(thread.id)}
                        className={`w-full text-left p-4 hover:bg-muted/50 transition-smooth ${
                          selectedThread === thread.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-hero text-primary-foreground">
                              {thread.buyerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold truncate">{thread.buyerName}</p>
                              {thread.status === 'new' && (
                                <Badge className="bg-primary text-primary-foreground">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {thread.lastMessage}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(thread.timestamp).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2">
              {!currentThread ? (
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No conversation selected</p>
                    <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-hero text-primary-foreground">
                          {currentThread.buyerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{currentThread.buyerName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {currentThread.status === 'new' ? 'New message' : 'Active conversation'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Messages */}
                    <div className="space-y-4 mb-6 h-[400px] overflow-y-auto">
                      {currentThread.messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.sender === 'artisan' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              message.sender === 'artisan'
                                ? 'bg-gradient-hero text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'artisan' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Quick Replies */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">AI Quick Replies</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply) => (
                          <Button
                            key={reply}
                            variant="outline"
                            size="sm"
                            onClick={() => setNewMessage(reply)}
                            className="text-xs"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button 
                        className="bg-gradient-hero"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
