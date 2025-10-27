import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  HelpCircle,
  MessageCircle,
  FileText,
  Send,
  Sparkles,
  Package,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportIssue, setSupportIssue] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const { toast } = useToast();

  const guides = [
    {
      icon: ShoppingBag,
      title: 'Getting Started',
      description: 'Learn how to browse and purchase crafts',
      topics: [
        'Creating an account',
        'Browsing the catalog',
        'Adding items to cart',
        'Completing checkout',
      ],
    },
    {
      icon: Package,
      title: 'Order Management',
      description: 'Track, modify, and manage your orders',
      topics: [
        'Tracking your order',
        'Canceling an order',
        'Modifying delivery address',
        'Order history',
      ],
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      description: 'Payment methods and refund process',
      topics: [
        'Accepted payment methods',
        'Secure checkout',
        'Refund policy',
        'Transaction issues',
      ],
    },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order by going to Dashboard > Orders. Click on the order to view detailed tracking information. You will also receive email updates at each stage of delivery.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 7 days of delivery for most items. The product must be unused and in original packaging. Handmade items are non-returnable unless damaged or defective.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Shipping times vary by location and product. Typically, orders are delivered within 5-10 business days. Handcrafted items may take longer as they are made to order.',
    },
    {
      question: 'Can I cancel my order?',
      answer:
        'Yes, you can cancel your order before it is shipped. Go to Dashboard > Orders and click "Cancel Order". Once shipped, cancellation is not possible but you can initiate a return after delivery.',
    },
    {
      question: 'Are the products authentic?',
      answer:
        'Yes! All products on CultureCart are made by verified artisans. Each listing includes details about the artisan and their craft tradition.',
    },
    {
      question: 'How do I contact an artisan?',
      answer:
        'You can message artisans directly through the product page or Dashboard > Messages. They typically respond within 24 hours.',
    },
  ];

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportIssue || !supportMessage) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Support Request Submitted',
      description: 'We will get back to you within 24 hours',
    });

    // Reset form
    setSupportName('');
    setSupportEmail('');
    setSupportIssue('');
    setSupportMessage('');
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Help Center</h1>
            <p className="text-muted-foreground mb-8">
              Find answers and get support for your CultureCart experience
            </p>

            {/* AI Search Bar */}
            <Card className="max-w-2xl mx-auto shadow-warm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ask AI: 'How do I track my order?' or search FAQs..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-gradient-hero">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-warm transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-4">
                      <guide.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {guide.description}
                    </p>
                    <ul className="space-y-2">
                      {guide.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
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

            {/* Contact Support */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">💬 Live Chat</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat with our AI assistant for instant help
                  </p>
                  <Button className="w-full bg-gradient-hero">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">📧 Email Support</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    support@culturecart.com
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Response within 24 hours
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">📞 Phone Support</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    +91 1800-123-4567
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mon-Sat, 9 AM - 6 PM IST
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Support Ticket */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Submit a Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSupport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue Type</Label>
                  <Input
                    id="issue"
                    placeholder="e.g., Order Tracking, Payment Issue, etc."
                    value={supportIssue}
                    onChange={(e) => setSupportIssue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    rows={5}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-hero">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
