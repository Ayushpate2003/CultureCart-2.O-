import { create } from 'zustand';

export type UserRole = 'admin' | 'artisan' | 'buyer';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock users for demonstration
const mockUsers = {
  'admin@culturecart.in': { id: '1', email: 'admin@culturecart.in', name: 'Admin User', role: 'admin' as UserRole },
  'artisan@culturecart.in': { id: '2', email: 'artisan@culturecart.in', name: 'Artisan Kumar', role: 'artisan' as UserRole },
  'buyer@culturecart.in': { id: '3', email: 'buyer@culturecart.in', name: 'Buyer Sharma', role: 'buyer' as UserRole },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock login - in production, this would call Firebase/Appwrite
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[email as keyof typeof mockUsers];
    if (user && password === 'password') {
      set({ user, isAuthenticated: true });
      localStorage.setItem('culturecart_user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('culturecart_user');
  },
  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));
