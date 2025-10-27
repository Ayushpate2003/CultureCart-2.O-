import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingUp, Clock, Download, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Earnings() {
  const { toast } = useToast();
  const [payoutAmount, setPayoutAmount] = useState('');

  const summaryCards = [
    { icon: DollarSign, label: 'Total Earnings', value: '₹2,40,000', color: 'text-green-600' },
    { icon: Clock, label: 'Pending Payouts', value: '₹18,500', color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Available Balance', value: '₹2,21,500', color: 'text-primary' },
  ];

  const transactions = [
    { id: 'TXN-2024-045', date: '2024-01-25', amount: 2499, status: 'paid', description: 'Madhubani Painting Sale' },
    { id: 'TXN-2024-044', date: '2024-01-24', amount: 1899, status: 'paid', description: 'Warli Art Canvas Sale' },
    { id: 'TXN-2024-043', date: '2024-01-23', amount: 3299, status: 'pending', description: 'Pattachitra Art Sale' },
    { id: 'TXN-2024-042', date: '2024-01-22', amount: 1599, status: 'paid', description: 'Terracotta Pottery Sale' },
    { id: 'TXN-2024-041', date: '2024-01-21', amount: 1499, status: 'paid', description: 'Bamboo Handicraft Sale' },
  ];

  const revenueData = [
    { month: 'Aug', revenue: 18500 },
    { month: 'Sep', revenue: 22000 },
    { month: 'Oct', revenue: 19800 },
    { month: 'Nov', revenue: 25600 },
    { month: 'Dec', revenue: 28900 },
    { month: 'Jan', revenue: 32400 },
  ];

  const handleRequestPayout = () => {
    toast({
      title: 'Payout Requested',
      description: `Your request for ₹${payoutAmount} has been submitted successfully.`,
    });
    setPayoutAmount('');
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Earnings & Transactions</h1>
              <p className="text-muted-foreground">Track your income and manage payouts</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero gap-2">
                  <DollarSign className="h-4 w-4" />
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Available Balance</Label>
                    <p className="text-2xl font-bold text-primary">₹2,21,500</p>
                  </div>
                  <div>
                    <Label htmlFor="amount">Payout Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-hero"
                    onClick={handleRequestPayout}
                  >
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-hero rounded-lg">
                        <card.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${card.color}`}>{card.value}</div>
                    <div className="text-sm text-muted-foreground">{card.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-hero rounded-xl">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">AI Revenue Tip</h3>
                    <p className="text-muted-foreground">
                      You can increase your revenue by improving photo quality and adding detailed craft stories. 
                      Products with high-quality images generate <span className="font-semibold text-foreground">35% more sales</span> on average.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue Chart */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Monthly Revenue Growth</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{txn.description}</p>
                        <Badge 
                          variant="outline"
                          className={
                            txn.status === 'paid' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }
                        >
                          {txn.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {txn.id} • {new Date(txn.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{txn.amount.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
