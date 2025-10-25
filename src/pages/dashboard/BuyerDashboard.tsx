import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Package, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: ShoppingBag, label: 'Total Orders', value: '24', description: '3 pending delivery' },
  { icon: Heart, label: 'Wishlist', value: '12', description: 'Save favorites' },
  { icon: Package, label: 'Delivered', value: '21', description: 'All time' },
  { icon: Star, label: 'Reviews', value: '18', description: 'You have reviewed' },
];

const recentOrders = [
  { id: 1, name: 'Madhubani Painting', price: '₹2,499', status: 'Delivered', date: '2 days ago' },
  { id: 2, name: 'Pashmina Shawl', price: '₹8,999', status: 'In Transit', date: '5 days ago' },
  { id: 3, name: 'Brass Lamp', price: '₹3,499', status: 'Processing', date: '1 week ago' },
];

const recommendations = [
  { id: 4, title: 'Kalamkari Saree', price: '₹5,999', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80' },
  { id: 5, title: 'Terracotta Horse', price: '₹1,299', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&q=80' },
  { id: 6, title: 'Pattachitra', price: '₹4,299', image: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=300&q=80' },
];

export default function BuyerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground mb-8">Track orders and discover new crafts</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-warm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-hero rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium mb-1">{order.name}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary mb-1">{order.price}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-hero" onClick={() => navigate('/explore')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse Crafts
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  My Wishlist
                </Button>
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Track Orders
                </Button>
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Write Review
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{product.title}</h3>
                    <p className="text-primary font-bold">{product.price}</p>
                  </div>
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
