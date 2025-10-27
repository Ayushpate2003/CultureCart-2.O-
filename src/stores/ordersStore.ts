import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type OrderStatus = 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  amount: number;
  status: OrderStatus;
  date: Date;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus: 'paid' | 'pending';
}

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;
}

// Mock orders for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'MP-2024-001',
    productName: 'Madhubani Painting',
    productImage: '',
    amount: 2499,
    status: 'completed',
    date: new Date('2024-01-15'),
    buyerName: 'Priya Sharma',
    buyerEmail: 'priya@example.com',
    buyerPhone: '+91 98765 43210',
    shippingAddress: {
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    paymentStatus: 'paid',
  },
  {
    id: '2',
    orderId: 'WA-2024-002',
    productName: 'Warli Art Canvas',
    productImage: '',
    amount: 1899,
    status: 'processing',
    date: new Date('2024-01-20'),
    buyerName: 'Rajesh Kumar',
    buyerEmail: 'rajesh@example.com',
    buyerPhone: '+91 98765 43211',
    shippingAddress: {
      street: '456 Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
    paymentStatus: 'paid',
  },
  {
    id: '3',
    orderId: 'PA-2024-003',
    productName: 'Pattachitra Art',
    productImage: '',
    amount: 3299,
    status: 'processing',
    date: new Date('2024-01-22'),
    buyerName: 'Anita Desai',
    buyerEmail: 'anita@example.com',
    buyerPhone: '+91 98765 43212',
    shippingAddress: {
      street: '789 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
    },
    paymentStatus: 'paid',
  },
];

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      addOrder: (orderData) => {
        const id = `order-${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id,
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        }));
      },
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: 'artisan-orders-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
