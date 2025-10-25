import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('culturecart_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
};
