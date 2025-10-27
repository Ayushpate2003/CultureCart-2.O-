import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'artisan' | 'buyer';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  artisanName: string;
  artisanId: string;
  category: string;
  price: number;
  status: 'approved' | 'pending' | 'rejected';
  views: number;
  sales: number;
  stock: number;
  dateSubmitted: string;
  image: string;
}

export interface AdminArtisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialty: string;
  status: 'approved' | 'pending' | 'rejected';
  productsCount: number;
  totalSales: number;
  rating: number;
  joinedDate: string;
}

interface AdminStore {
  users: AdminUser[];
  products: AdminProduct[];
  artisans: AdminArtisan[];
  
  // User actions
  updateUserStatus: (userId: string, status: AdminUser['status']) => void;
  deleteUser: (userId: string) => void;
  
  // Product actions
  updateProductStatus: (productId: string, status: AdminProduct['status']) => void;
  deleteProduct: (productId: string) => void;
  
  // Artisan actions
  updateArtisanStatus: (artisanId: string, status: AdminArtisan['status']) => void;
  deleteArtisan: (artisanId: string) => void;
}

// Mock data
const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'buyer',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2024-10-26',
    totalOrders: 12,
    totalSpent: 45000,
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'artisan',
    status: 'active',
    joinedDate: '2023-11-20',
    lastActive: '2024-10-27',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    role: 'buyer',
    status: 'active',
    joinedDate: '2024-02-10',
    lastActive: '2024-10-25',
    totalOrders: 8,
    totalSpent: 28000,
  },
  {
    id: '4',
    name: 'Sita Devi',
    email: 'sita@example.com',
    role: 'artisan',
    status: 'pending',
    joinedDate: '2024-10-20',
    lastActive: '2024-10-27',
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: '5',
    name: 'Arjun Singh',
    email: 'arjun@example.com',
    role: 'buyer',
    status: 'suspended',
    joinedDate: '2024-03-05',
    lastActive: '2024-10-15',
    totalOrders: 3,
    totalSpent: 12000,
  },
];

const mockProducts: AdminProduct[] = [
  {
    id: '1',
    name: 'Pashmina Shawl',
    artisanName: 'Rajesh Kumar',
    artisanId: '2',
    category: 'Textiles',
    price: 8500,
    status: 'approved',
    views: 234,
    sales: 45,
    stock: 12,
    dateSubmitted: '2024-09-15',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26',
  },
  {
    id: '2',
    name: 'Madhubani Painting',
    artisanName: 'Sita Devi',
    artisanId: '4',
    category: 'Paintings',
    price: 3500,
    status: 'pending',
    views: 89,
    sales: 0,
    stock: 5,
    dateSubmitted: '2024-10-22',
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7',
  },
  {
    id: '3',
    name: 'Warli Art Wall Hanging',
    artisanName: 'Rajesh Kumar',
    artisanId: '2',
    category: 'Art',
    price: 2800,
    status: 'approved',
    views: 156,
    sales: 23,
    stock: 8,
    dateSubmitted: '2024-09-28',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
  },
  {
    id: '4',
    name: 'Terracotta Vase',
    artisanName: 'Sita Devi',
    artisanId: '4',
    category: 'Pottery',
    price: 1500,
    status: 'rejected',
    views: 45,
    sales: 0,
    stock: 3,
    dateSubmitted: '2024-10-18',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa',
  },
];

const mockArtisans: AdminArtisan[] = [
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    location: 'Jaipur, Rajasthan',
    specialty: 'Textiles & Paintings',
    status: 'approved',
    productsCount: 24,
    totalSales: 185000,
    rating: 4.8,
    joinedDate: '2023-11-20',
  },
  {
    id: '4',
    name: 'Sita Devi',
    email: 'sita@example.com',
    phone: '+91 98123 45678',
    location: 'Madhubani, Bihar',
    specialty: 'Madhubani Paintings',
    status: 'pending',
    productsCount: 2,
    totalSales: 0,
    rating: 0,
    joinedDate: '2024-10-20',
  },
  {
    id: '6',
    name: 'Lakshmi Nair',
    email: 'lakshmi@example.com',
    phone: '+91 97654 32109',
    location: 'Kochi, Kerala',
    specialty: 'Handicrafts',
    status: 'approved',
    productsCount: 18,
    totalSales: 142000,
    rating: 4.6,
    joinedDate: '2024-01-10',
  },
  {
    id: '7',
    name: 'Vikram Choudhary',
    email: 'vikram@example.com',
    phone: '+91 96543 21098',
    location: 'Udaipur, Rajasthan',
    specialty: 'Miniature Art',
    status: 'rejected',
    productsCount: 1,
    totalSales: 0,
    rating: 0,
    joinedDate: '2024-10-15',
  },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      users: mockUsers,
      products: mockProducts,
      artisans: mockArtisans,

      updateUserStatus: (userId, status) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, status } : user
          ),
        })),

      deleteUser: (userId) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        })),

      updateProductStatus: (productId, status) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, status } : product
          ),
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId),
        })),

      updateArtisanStatus: (artisanId, status) =>
        set((state) => ({
          artisans: state.artisans.map((artisan) =>
            artisan.id === artisanId ? { ...artisan, status } : artisan
          ),
        })),

      deleteArtisan: (artisanId) =>
        set((state) => ({
          artisans: state.artisans.filter((artisan) => artisan.id !== artisanId),
        })),
    }),
    {
      name: 'admin-storage',
    }
  )
);
