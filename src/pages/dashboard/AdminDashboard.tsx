import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, TrendingUp, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { icon: Package, label: 'Active Products', value: '2,145', change: '+8%', trend: 'up' },
  { icon: TrendingUp, label: 'Monthly Sales', value: '₹12.5L', change: '+23%', trend: 'up' },
  { icon: IndianRupee, label: 'Revenue', value: '₹45.2L', change: '+15%', trend: 'up' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Products', path: '/admin/products', icon: Package },
    { label: 'View Analytics', path: '/admin/analytics', icon: TrendingUp },
    { label: 'Manage Orders', path: '/admin/orders', icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.label}</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            ))}
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-gradient-hero rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">New artisan registered</p>
                      <p className="text-sm text-muted-foreground">Rajesh Kumar from Rajasthan</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Product approved</p>
                      <p className="text-sm text-muted-foreground">Madhubani Painting by Sita Devi</p>
                    </div>
                    <span className="text-xs text-muted-foreground">5h ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">Large order placed</p>
                      <p className="text-sm text-muted-foreground">₹45,000 from buyer in USA</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Pashmina Shawl</p>
                      <p className="text-sm text-muted-foreground">Kashmir</p>
                    </div>
                    <span className="font-semibold text-primary">125 sales</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Madhubani Painting</p>
                      <p className="text-sm text-muted-foreground">Bihar</p>
                    </div>
                    <span className="font-semibold text-primary">98 sales</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">Warli Art</p>
                      <p className="text-sm text-muted-foreground">Maharashtra</p>
                    </div>
                    <span className="font-semibold text-primary">87 sales</span>
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
