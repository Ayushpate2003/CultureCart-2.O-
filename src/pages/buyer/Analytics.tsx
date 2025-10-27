import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Download,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBuyerAnalyticsStore } from '@/stores/buyerAnalyticsStore';
import { useState } from 'react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#FF9933', '#8B4513', '#D2691E'];

export default function BuyerAnalytics() {
  const {
    totalSpend,
    averageOrderValue,
    deliveredOrders,
    topCategory,
    monthlyData,
    categoryData,
    reviewData,
    selectedRange,
    setSelectedRange,
  } = useBuyerAnalyticsStore();

  const [isExporting, setIsExporting] = useState(false);

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Spend',
      value: `₹${totalSpend.toLocaleString()}`,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      icon: ShoppingBag,
      label: 'Avg. Order Value',
      value: `₹${averageOrderValue.toLocaleString()}`,
      trend: '+8.2%',
      trendUp: true,
    },
    {
      icon: Package,
      label: 'Delivered Orders',
      value: deliveredOrders,
      trend: `${deliveredOrders} orders`,
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: 'Top Category',
      value: topCategory,
      trend: '35% of orders',
      trendUp: true,
    },
  ];

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      alert('Analytics exported successfully!');
    }, 1500);
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
              <h1 className="text-4xl font-bold mb-2">Shopping Analytics</h1>
              <p className="text-muted-foreground">
                Track your spending and shopping patterns
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2">
                {(['30d', '3m', '6m', 'all'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={selectedRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRange(range)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    {range === '30d' ? '30 Days' : range === '3m' ? '3 Months' : range === '6m' ? '6 Months' : 'All Time'}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-gradient-hero"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                      <div className="p-2 bg-gradient-hero rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          stat.trendUp ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Orders & Spend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders & Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
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
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#8B4513"
                      strokeWidth={2}
                      name="Orders"
                    />
                    <Line
                      type="monotone"
                      dataKey="spend"
                      stroke="#FF9933"
                      strokeWidth={2}
                      name="Spend (₹)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Reviews per Month */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews per Month</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reviewData}>
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
                    <Bar dataKey="reviews" fill="#8B4513" name="Reviews" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">📊 Spending Pattern</p>
                  <p className="text-sm text-muted-foreground">
                    Your most viewed category this month is <strong>Handwoven Textiles</strong>
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">📈 Growth Trend</p>
                  <p className="text-sm text-muted-foreground">
                    You gained <strong>+18% orders</strong> compared to last month
                  </p>
                </div>
                <div className="p-4 bg-background/80 rounded-lg">
                  <p className="font-semibold mb-1">💡 Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your purchases, you might love <strong>Kalamkari Sarees</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State (hidden when data exists) */}
          {deliveredOrders === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Analytics Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start shopping to see your stats and insights!
                </p>
                <Button className="bg-gradient-hero">Browse Crafts</Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
