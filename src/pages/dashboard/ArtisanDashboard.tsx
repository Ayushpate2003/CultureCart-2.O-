import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Eye, ShoppingCart, TrendingUp, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: Package, label: 'Active Products', value: '12', change: '+2 this month' },
  { icon: Eye, label: 'Total Views', value: '1,847', change: '+156 this week' },
  { icon: ShoppingCart, label: 'Total Sales', value: '87', change: '+12 this month' },
  { icon: TrendingUp, label: 'Revenue', value: '₹2.4L', change: '+18% growth' },
];

export default function ArtisanDashboard() {
  const navigate = useNavigate();

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
              <h1 className="text-4xl font-bold mb-2">Artisan Studio</h1>
              <p className="text-muted-foreground">Manage your crafts and track performance</p>
            </div>
            <Button className="bg-gradient-hero gap-2">
              <Upload className="h-4 w-4" />
              Upload New Craft
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-hero rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 py-3 border-b">
                    <div className="w-20 h-20 bg-muted rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Madhubani Painting</p>
                      <p className="text-sm text-muted-foreground mb-2">₹2,499 • 45 views</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 py-3 border-b">
                    <div className="w-20 h-20 bg-muted rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Warli Art Canvas</p>
                      <p className="text-sm text-muted-foreground mb-2">₹1,899 • 32 views</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-medium">Madhubani Painting</p>
                      <p className="text-sm text-muted-foreground">Order #MP-2024-001</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹2,499</p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Completed</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-medium">Warli Art Canvas</p>
                      <p className="text-sm text-muted-foreground">Order #WA-2024-002</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹1,899</p>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Processing</span>
                    </div>
                  </div>
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
