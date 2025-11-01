import { create } from 'zustand';
import { onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { FirebaseAuthService, CreateUserData } from '@/services/api';

export type UserRole = 'admin' | 'artisan' | 'buyer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
  profileComplete: boolean;
  onboardingCompleted?: boolean;
  metadata?: {
    craftType?: string;
    experience?: number;
    location?: string;
    portfolio?: string;
  };
  preferences?: {
    language?: string;
    location?: {
      latitude: number;
      longitude: number;
      state?: string;
      city?: string;
      country?: string;
    };
  };
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  metadata?: {
    craftType?: string;
    experience?: number;
    location?: string;
    portfolio?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

const googleProvider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await FirebaseAuthService.signInWithEmail(email, password);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(userData));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await FirebaseAuthService.createUser(data as CreateUserData);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(userData));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const userData = await FirebaseAuthService.signInWithGoogle();
      set({ user: userData, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(userData));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Google login failed',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await FirebaseAuthService.signOut();
    } catch (error) {
      console.warn('Firebase logout failed:', error);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('culturecart_user');
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  updateUser: async (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const updatedUser = { ...currentUser, ...updates };
      await FirebaseAuthService.updateUserData(currentUser.id, updates);
      set({ user: updatedUser });
      localStorage.setItem('culturecart_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    try {
      set({ isLoading: true });
      
      // Check for Google Sign-In redirect result first
      FirebaseAuthService.handleGoogleRedirectResult()
        .then((userData) => {
          if (userData) {
            set({ user: userData, isAuthenticated: true, isLoading: false });
            localStorage.setItem('culturecart_user', JSON.stringify(userData));
            return;
          }
        })
        .catch((error) => {
          console.error('Error handling redirect result:', error);
        });
      
      onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const userData = await FirebaseAuthService.getUserData(firebaseUser.uid);
            if (userData) {
              set({ user: userData, isAuthenticated: true, isLoading: false });
              localStorage.setItem('culturecart_user', JSON.stringify(userData));
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
            localStorage.removeItem('culturecart_user');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
