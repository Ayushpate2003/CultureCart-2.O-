import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, ShoppingCart, TrendingUp, Upload, Sparkles, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanProductsStore } from '@/stores/artisanProductsStore';
import { useEffect } from 'react';

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { products, getTotalProducts, removeNewFlag } = useArtisanProductsStore();

  useEffect(() => {
    // Remove new flag after animation duration
    const newProducts = products.filter(p => p.isNew);
    if (newProducts.length > 0) {
      const timer = setTimeout(() => {
        newProducts.forEach(p => removeNewFlag(p.id));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [products, removeNewFlag]);

  const totalProducts = getTotalProducts();

  const stats = [
    { icon: Package, label: 'Active Products', value: totalProducts.toString(), change: '+' + products.filter(p => p.isNew).length + ' this month' },
    { icon: Eye, label: 'Total Views', value: '1,847', change: '+156 this week' },
    { icon: ShoppingCart, label: 'Total Sales', value: '87', change: '+12 this month' },
    { icon: TrendingUp, label: 'Revenue', value: '₹2.4L', change: '+18% growth' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Artisan Studio</h1>
              <p className="text-muted-foreground">Manage your crafts and track performance</p>
            </div>
            <Button 
              className="bg-gradient-hero gap-2"
              onClick={() => navigate('/artisan/upload')}
            >
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
                <div className="flex items-center justify-between">
                  <CardTitle>Your Products</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/artisan/products')}
                  >
                    View All <MoreHorizontal className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No products yet</p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/artisan/upload')}
                    >
                      Upload Your First Craft
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={product.isNew ? { opacity: 0, x: -20, scale: 0.95 } : false}
                        animate={product.isNew ? { opacity: 1, x: 0, scale: 1 } : false}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`flex gap-4 py-3 border-b relative ${
                          product.isNew ? 'bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-3' : ''
                        }`}
                      >
                        {product.isNew && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="absolute -top-2 -right-2 bg-gradient-hero text-primary-foreground rounded-full p-1"
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                        )}
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {product.thumbnail && (
                            <img 
                              src={product.thumbnail} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium truncate">{product.title}</p>
                            <Badge 
                              variant="outline" 
                              className={getStatusColor(product.status)}
                            >
                              {product.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            ₹{product.price} • {product.views} views
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/artisan/orders')}
                  >
                    View All <MoreHorizontal className="h-4 w-4 ml-2" />
                  </Button>
                </div>
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
