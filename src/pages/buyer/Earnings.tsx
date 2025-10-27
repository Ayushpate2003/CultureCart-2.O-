import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  Download,
  Clock,
  CheckCircle,
  Gift,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBuyerEarningsStore } from '@/stores/buyerEarningsStore';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const monthlyRevenue = [
  { month: 'Jan', amount: 850 },
  { month: 'Feb', amount: 1200 },
  { month: 'Mar', amount: 1450 },
  { month: 'Apr', amount: 980 },
  { month: 'May', amount: 1680 },
  { month: 'Jun', amount: 2100 },
];

export default function BuyerEarnings() {
  const {
    walletBalance,
    pendingAmount,
    lifetimeEarnings,
    transactions,
    requestWithdrawal,
  } = useBuyerEarningsStore();

  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (amount > walletBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Withdrawal amount exceeds available balance',
        variant: 'destructive',
      });
      return;
    }
    if (amount < 100) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum withdrawal amount is ₹100',
        variant: 'destructive',
      });
      return;
    }

    requestWithdrawal(amount);
    toast({
      title: 'Withdrawal Requested',
      description: `₹${amount} withdrawal request submitted successfully`,
    });
    setIsDialogOpen(false);
    setWithdrawalAmount('');
  };

  const stats = [
    {
      icon: Wallet,
      label: 'Available Balance',
      value: `₹${walletBalance.toLocaleString()}`,
      description: 'Ready to withdraw',
      color: 'text-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Payouts',
      value: `₹${pendingAmount.toLocaleString()}`,
      description: 'Processing',
      color: 'text-yellow-600',
    },
    {
      icon: TrendingUp,
      label: 'Lifetime Earnings',
      value: `₹${lifetimeEarnings.toLocaleString()}`,
      description: 'All time',
      color: 'text-primary',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Processing':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              <h1 className="text-4xl font-bold mb-2">Earnings & Transactions</h1>
              <p className="text-muted-foreground">
                Manage your rewards, cashback, and payouts
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-hero">
                  <Wallet className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw from your wallet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Available balance: ₹{walletBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Withdrawal Method</Label>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">
                        Funds will be transferred to your registered bank account
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleWithdrawal} className="w-full bg-gradient-hero">
                  Confirm Withdrawal
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-warm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 bg-gradient-hero rounded-lg`}>
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Monthly Revenue Growth */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Earnings Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8B4513"
                    strokeWidth={3}
                    name="Earnings (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-gradient-hero rounded-lg">
                          <Gift className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 mb-2">
                          +₹{transaction.amount.toLocaleString()}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Earning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">💡 Referral Program</p>
                  <p className="text-sm text-muted-foreground">
                    Refer friends to earn ₹500 per successful signup
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">🎁 Order Rewards</p>
                  <p className="text-sm text-muted-foreground">
                    Get up to 5% cashback on every order above ₹2000
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">⭐ Review Bonus</p>
                  <p className="text-sm text-muted-foreground">
                    Earn ₹50 for every verified product review you post
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">📈 Growth</p>
                  <p className="text-sm text-muted-foreground">
                    Your earnings grew by 24% this month. Keep it up!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
