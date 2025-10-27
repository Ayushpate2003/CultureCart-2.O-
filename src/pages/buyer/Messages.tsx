import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Search,
  Paperclip,
  CheckCheck,
  Plus,
  Mic,
  Sparkles,
} from 'lucide-react';
import { useBuyerMessagesStore } from '@/stores/buyerMessagesStore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function BuyerMessages() {
  const { threads, addMessage, markAsResolved, createNewThread, getThreadById } =
    useBuyerMessagesStore();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    threads.length > 0 ? threads[0].id : null
  );
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newArtisanName, setNewArtisanName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedThread = selectedThreadId ? getThreadById(selectedThreadId) : null;

  const filteredThreads = threads.filter(
    (thread) =>
      thread.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickReplies = [
    'Thank you for your message!',
    'Is this customizable?',
    'Can you ship faster?',
    'What is the delivery time?',
  ];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThreadId) return;

    addMessage(selectedThreadId, {
      text: messageText,
      sender: 'buyer',
    });

    setMessageText('');
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent successfully',
    });
  };

  const handleMarkResolved = () => {
    if (!selectedThreadId) return;
    markAsResolved(selectedThreadId);
    toast({
      title: 'Conversation Resolved',
      description: 'This conversation has been marked as resolved',
    });
  };

  const handleCreateNewThread = () => {
    if (!newArtisanName.trim() || !newMessage.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    createNewThread(newArtisanName, newMessage);
    setIsNewDialogOpen(false);
    setNewArtisanName('');
    setNewMessage('');
    toast({
      title: 'Inquiry Created',
      description: 'Your new inquiry has been sent',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'replied':
        return 'bg-green-100 text-green-700';
      case 'resolved':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Messages</h1>
              <p className="text-muted-foreground">
                Chat with artisans about their crafts
              </p>
            </div>
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  New Inquiry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Inquiry</DialogTitle>
                  <DialogDescription>
                    Send a message to an artisan about their craft
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="artisan">Artisan Name</Label>
                    <Input
                      id="artisan"
                      placeholder="Enter artisan name"
                      value={newArtisanName}
                      onChange={(e) => setNewArtisanName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Input
                      id="message"
                      placeholder="Type your message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateNewThread}
                  className="w-full bg-gradient-hero"
                >
                  Send Inquiry
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Messages Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations Sidebar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedThreadId === thread.id
                          ? 'bg-gradient-hero text-primary-foreground'
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={thread.artisanAvatar} />
                          <AvatarFallback>
                            {thread.artisanName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold truncate">
                              {thread.artisanName}
                            </p>
                            <Badge
                              className={`${getStatusColor(thread.status)} text-xs`}
                            >
                              {thread.status}
                            </Badge>
                          </div>
                          <p className="text-sm truncate opacity-90">
                            {thread.lastMessage}
                          </p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(thread.timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              {selectedThread ? (
                <CardContent className="p-0 flex flex-col h-[700px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedThread.artisanAvatar} />
                        <AvatarFallback>
                          {selectedThread.artisanName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{selectedThread.artisanName}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedThread.status === 'replied'
                            ? 'Replied'
                            : selectedThread.status === 'resolved'
                            ? 'Resolved'
                            : 'Awaiting response'}
                        </p>
                      </div>
                    </div>
                    {selectedThread.status !== 'resolved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkResolved}
                      >
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {selectedThread.messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            message.sender === 'buyer'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              message.sender === 'buyer'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Quick Replies */}
                  <div className="px-4 py-2 border-t bg-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Quick Replies
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessageText(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        className="bg-gradient-hero"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex items-center justify-center h-[700px]">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Select a conversation to start chatting
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
