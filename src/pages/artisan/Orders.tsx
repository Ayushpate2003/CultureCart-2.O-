import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Package, 
  CheckCircle2, 
  XCircle,
  Download,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useOrdersStore, type OrderStatus } from '@/stores/ordersStore';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Orders() {
  const { orders, updateOrderStatus } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderDetails = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

  const handleMarkAsShipped = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Orders</h1>
              <p className="text-muted-foreground">
                {orders.length} total {orders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {orders.filter(o => o.status === 'processing').length}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {orders.filter(o => o.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  ₹{orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID, product, or buyer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
                  </h3>
                  <p className="text-muted-foreground">
                    {orders.length === 0 
                      ? 'Orders will appear here when customers purchase your crafts'
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-warm transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{order.productName}</h3>
                              <p className="text-sm text-muted-foreground">Order ID: {order.orderId}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(order.status)} flex items-center gap-1`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Amount</p>
                              <p className="font-semibold text-primary text-lg">₹{order.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Buyer</p>
                              <p className="font-medium">{order.buyerName}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Date</p>
                              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex lg:flex-col gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1 lg:flex-none"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === 'processing' && (
                            <Button 
                              className="flex-1 lg:flex-none bg-gradient-hero"
                              onClick={() => handleMarkAsShipped(order.id)}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              Mark as Shipped
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{orderDetails.productName}</h3>
                  <p className="text-muted-foreground">Order ID: {orderDetails.orderId}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(orderDetails.status)} flex items-center gap-1`}
                >
                  {getStatusIcon(orderDetails.status)}
                  {orderDetails.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-bold text-primary">₹{orderDetails.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                  <p className="font-semibold capitalize">{orderDetails.paymentStatus}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Buyer Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{orderDetails.buyerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{orderDetails.buyerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{orderDetails.buyerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Shipping Address</h4>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{orderDetails.shippingAddress.street}</p>
                    <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                    <p>PIN: {orderDetails.shippingAddress.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                {orderDetails.status === 'processing' && (
                  <Button 
                    className="flex-1 bg-gradient-hero"
                    onClick={() => handleMarkAsShipped(orderDetails.id)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Shipped
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
