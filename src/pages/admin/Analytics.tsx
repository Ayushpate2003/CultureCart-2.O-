import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Package, IndianRupee, Download } from 'lucide-react';
import { useState } from 'react';

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 285000, orders: 45 },
  { month: 'Feb', revenue: 320000, orders: 52 },
  { month: 'Mar', revenue: 385000, orders: 63 },
  { month: 'Apr', revenue: 425000, orders: 71 },
  { month: 'May', revenue: 480000, orders: 79 },
  { month: 'Jun', revenue: 520000, orders: 88 },
];

const categoryData = [
  { name: 'Textiles', value: 35, sales: 285000 },
  { name: 'Paintings', value: 25, sales: 204000 },
  { name: 'Pottery', value: 20, sales: 163000 },
  { name: 'Jewelry', value: 15, sales: 122000 },
  { name: 'Others', value: 5, sales: 41000 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#FFBB28', '#FF8042', '#8884D8'];

const topArtisans = [
  { name: 'Rajesh Kumar', sales: 185000, products: 24, rating: 4.8 },
  { name: 'Lakshmi Nair', sales: 142000, products: 18, rating: 4.6 },
  { name: 'Amit Patel', sales: 128000, products: 15, rating: 4.7 },
  { name: 'Priya Sharma', sales: 98000, products: 12, rating: 4.5 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
              <p className="text-muted-foreground">
                Platform performance and growth metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <IndianRupee className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+23%</span>
                </div>
                <div className="text-2xl font-bold mb-1">₹45.2L</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+15%</span>
                </div>
                <div className="text-2xl font-bold mb-1">2,145</div>
                <div className="text-sm text-muted-foreground">Active Products</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+18%</span>
                </div>
                <div className="text-2xl font-bold mb-1">398</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gradient-hero rounded-lg">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
                <div className="text-2xl font-bold mb-1">1,234</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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

          {/* Top Artisans & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Artisans */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topArtisans.map((artisan, index) => (
                    <div key={artisan.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{artisan.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {artisan.products} products • ⭐ {artisan.rating}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{artisan.sales.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
