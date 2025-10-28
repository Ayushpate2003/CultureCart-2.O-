const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authAPI = {
  verifyEmail: async (userId: string, secret: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, secret }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email verification failed:', error);
      return { success: false, error };
    }
  },

  resetPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, error };
    }
  },

  updatePassword: async (userId: string, secret: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, secret, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password update failed');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Password update failed:', error);
      return { success: false, error };
    }
  },

  resendVerification: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('culturecart_token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Resend verification failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Resend verification failed:', error);
      return { success: false, error };
    }
  }
};
