import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type UserRole = 'admin' | 'artisan' | 'buyer';

interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  onboardingCompleted?: boolean;
  preferences?: {
    language?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  craftType?: string;
  experience?: number;
  portfolio?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user object from Firebase user
      const user: User = {
        id: firebaseUser.uid,
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: 'buyer', // Default role, will be updated during onboarding
        onboardingCompleted: false,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(user));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Create user object from Firebase user
      const user: User = {
        id: firebaseUser.uid,
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'buyer', // Default role, will be updated during onboarding
        onboardingCompleted: false,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(user));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Google login failed',
        isLoading: false
      });
      throw error;
    }
  },

  signup: async (userData: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Create user object
      const user: User = {
        id: firebaseUser.uid,
        userId: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name,
        role: userData.role,
        onboardingCompleted: false,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(user));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Firebase logout failed:', error);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('culturecart_user');
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  updateUser: async (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });

      // Update user preferences/metadata via API
      const updateData: any = {};
      if (updates.preferences) {
        updateData.preferences = updates.preferences;
      }
      if (updates.onboardingCompleted !== undefined) {
        updateData.metadata = {
          onboardingCompleted: updates.onboardingCompleted,
        };
      }

      if (Object.keys(updateData).length > 0) {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('culturecart_token')}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          console.warn('Failed to update user via API');
        }
      }

      localStorage.setItem('culturecart_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // Listen to Firebase auth state changes
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Check for stored user data
          const storedUser = localStorage.getItem('culturecart_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            // Create user object if not stored
            const user: User = {
              id: firebaseUser.uid,
              userId: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'buyer', // Default role
              onboardingCompleted: false,
              preferences: {
                language: 'en',
                notifications: {
                  email: true,
                  push: true,
                  sms: false,
                },
              },
            };
            set({ user, isAuthenticated: true, isLoading: false });
            localStorage.setItem('culturecart_user', JSON.stringify(user));
          }
        } else {
          // User is signed out
          set({ user: null, isAuthenticated: false, isLoading: false });
          localStorage.removeItem('culturecart_user');
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },
}));
