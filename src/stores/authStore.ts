import { create } from 'zustand';

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user: User = {
        id: data.data.user.id,
        userId: data.data.user.userId,
        email: data.data.user.email,
        name: data.data.user.metadata?.fullName || 'User',
        role: data.data.user.roles[0] as UserRole,
        onboardingCompleted: data.data.user.metadata?.onboardingCompleted || false,
        preferences: data.data.user.preferences,
      };

      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('culturecart_user', JSON.stringify(user));
      localStorage.setItem('culturecart_token', data.data.token);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  signup: async (userData: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          roles: [userData.role],
          metadata: {
            fullName: userData.name,
            phone: userData.phone,
            location: userData.location,
            craftType: userData.craftType,
            experience: userData.experience,
            portfolio: userData.portfolio,
            onboardingCompleted: false,
          },
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              push: true,
              sms: false,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Auto-login after signup
      await get().login(userData.email, userData.password);
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
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('culturecart_token')}`,
        },
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem('culturecart_user');
    localStorage.removeItem('culturecart_token');
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
      // Check for stored user and token first
      const storedUser = localStorage.getItem('culturecart_user');
      const storedToken = localStorage.getItem('culturecart_token');

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);

        // Verify token is still valid
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            set({ user, isAuthenticated: true, isLoading: false });
            return;
          }
        } catch (error) {
          console.warn('Token validation failed:', error);
        }
      }

      // No valid session, stay logged out
      set({ isLoading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },
}));
