import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUser,
    setUser,
    clearError,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when hook is first used
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUser,
    setUser,
    clearError,
  };
};
