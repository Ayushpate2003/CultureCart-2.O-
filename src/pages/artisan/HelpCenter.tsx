import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Camera, DollarSign, Search, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function HelpCenter() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  const guides = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      description: 'Learn how to upload, edit, and manage your crafts effectively',
      articles: ['How to upload your first craft', 'Creating a compelling product listing', 'Managing inventory'],
    },
    {
      icon: Camera,
      title: 'Photography Basics',
      description: 'Take stunning photos that showcase your crafts',
      articles: ['Natural lighting tips', 'Best angles for craft photos', 'Photo editing basics'],
    },
    {
      icon: DollarSign,
      title: 'Pricing Tips',
      description: 'Price your crafts competitively while maintaining profitability',
      articles: ['Calculating material costs', 'Market research strategies', 'Seasonal pricing'],
    },
  ];

  const faqs = [
    {
      question: 'How do I increase my craft sales?',
      answer: 'Focus on high-quality photos, detailed descriptions, competitive pricing, and engaging with customers. Our AI assistant can provide personalized recommendations based on your shop performance.',
    },
    {
      question: 'How long does it take for my craft to be approved?',
      answer: 'Most crafts are reviewed within 24-48 hours. You\'ll receive a notification once your craft is approved or if any changes are needed.',
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We support bank transfers, UPI, and digital wallets. You can set up your payout preferences in the Profile & Settings page.',
    },
    {
      question: 'Can I edit my craft after it\'s published?',
      answer: 'Yes! You can edit your craft details, photos, and pricing anytime from the "My Products" page.',
    },
    {
      question: 'How do I handle custom orders?',
      answer: 'When a customer requests a custom order through messages, discuss the requirements, agree on pricing, and create a special listing for them.',
    },
  ];

  const handleSubmitSupport = () => {
    toast({
      title: 'Support ticket submitted',
      description: 'We\'ll get back to you within 24 hours.',
    });
    setSupportMessage('');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-muted-foreground mb-8">
              Find answers, learn best practices, and get support
            </p>

            {/* AI Search */}
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="font-medium">AI-Powered Search</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Ask anything... e.g., 'How do I increase my sales?'"
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guides */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Getting Started Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-warm transition-smooth">
                    <CardHeader>
                      <div className="p-3 bg-gradient-hero rounded-xl w-fit mb-4">
                        <guide.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle>{guide.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.articles.map((article) => (
                          <li key={article}>
                            <Button variant="link" className="p-0 h-auto text-sm">
                              {article}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-hero rounded-xl">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Still Need Help?</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Our support team is here to assist you
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What do you need help with?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question..."
                    rows={5}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-hero" onClick={handleSubmitSupport}>
                    Submit Ticket
                  </Button>
                  <Button variant="outline">
                    Chat with AI Assistant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
