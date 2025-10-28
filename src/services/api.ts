/**
 * CultureCart API Services
 * High-level API functions for frontend integration with PostgreSQL backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ==========================================
// HTTP CLIENT UTILITIES
// ==========================================

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('culturecart_token');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================

export class AuthService {
  static async signUp(email: string, password: string, userData: any) {
    try {
      const response = await apiClient.post('/api/auth/register', {
        email,
        password,
        ...userData,
      });

      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.error('Signin failed:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: any) {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update user profile failed:', error);
      throw error;
    }
  }

  static async completeOnboarding(userId: string, onboardingData: any) {
    try {
      const response = await apiClient.put(`/api/users/${userId}`, {
        metadata: {
          onboardingCompleted: true,
          location: onboardingData.location,
        },
        preferences: {
          language: onboardingData.language,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Complete onboarding failed:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
      // Don't throw error for logout failures
    }
  }
}

// ==========================================
// ARTISAN MANAGEMENT
// ==========================================

export class ArtisanService {
  static async getFeaturedArtisans(limit = 12) {
    try {
      const response = await apiClient.get(`/api/artisans?featured=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get featured artisans failed:', error);
      throw error;
    }
  }

  static async searchArtisans(query: {
    craftType?: string;
    state?: string;
    district?: string;
    minRating?: number;
    limit?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (query.craftType) params.append('craft_type', query.craftType);
      if (query.state) params.append('state', query.state);
      if (query.district) params.append('district', query.district);
      if (query.minRating) params.append('min_rating', query.minRating.toString());
      if (query.limit) params.append('limit', query.limit.toString());

      const response = await apiClient.get(`/api/artisans?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search artisans failed:', error);
      throw error;
    }
  }

  static async getArtisanProfile(artisanId: string) {
    try {
      const response = await apiClient.get(`/api/artisans/${artisanId}`);
      return response.data;
    } catch (error) {
      console.error('Get artisan profile failed:', error);
      throw error;
    }
  }

  static async getArtisanProducts(artisanId: string, status = 'published') {
    try {
      const response = await apiClient.get(`/api/products/artisan/${artisanId}?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Get artisan products failed:', error);
      throw error;
    }
  }

  static async updateArtisanProfile(artisanId: string, updates: any) {
    try {
      const response = await apiClient.put(`/api/artisans/${artisanId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update artisan profile failed:', error);
      throw error;
    }
  }

  static async getArtisanStats(artisanId: string) {
    try {
      const response = await apiClient.get(`/api/artisans/${artisanId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get artisan stats failed:', error);
      throw error;
    }
  }
}

// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

export class ProductService {
  static async getFeaturedProducts(limit = 16) {
    try {
      const response = await apiClient.get(`/api/products?featured=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get featured products failed:', error);
      throw error;
    }
  }

  static async searchProducts(query: {
    searchTerm?: string;
    category?: string;
    craftTradition?: string;
    minPrice?: number;
    maxPrice?: number;
    state?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
    limit?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (query.searchTerm) params.append('search', query.searchTerm);
      if (query.category) params.append('category', query.category);
      if (query.craftTradition) params.append('craft_tradition', query.craftTradition);
      if (query.minPrice) params.append('min_price', query.minPrice.toString());
      if (query.maxPrice) params.append('max_price', query.maxPrice.toString());
      if (query.state) params.append('state', query.state);
      if (query.sortBy) params.append('sort_by', query.sortBy);
      if (query.limit) params.append('limit', query.limit.toString());

      const response = await apiClient.get(`/api/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search products failed:', error);
      throw error;
    }
  }

  static async getProductDetails(productId: string) {
    try {
      const response = await apiClient.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Get product details failed:', error);
      throw error;
    }
  }

  static async getSimilarProducts(productId: string, category: string, craftTradition: string, limit = 8) {
    try {
      const params = new URLSearchParams({
        category,
        craft_tradition: craftTradition,
        limit: limit.toString(),
      });

      const response = await apiClient.get(`/api/products?${params.toString()}`);
      return response.data.filter((product: any) => product.productId !== productId);
    } catch (error) {
      console.error('Get similar products failed:', error);
      throw error;
    }
  }

  static async createProduct(productData: any) {
    try {
      const response = await apiClient.post('/api/products', productData);
      return response.data;
    } catch (error) {
      console.error('Create product failed:', error);
      throw error;
    }
  }

  static async updateProduct(productId: string, updates: any) {
    try {
      const response = await apiClient.put(`/api/products/${productId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update product failed:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string) {
    try {
      const response = await apiClient.delete(`/api/products/${productId}`);
      return response;
    } catch (error) {
      console.error('Delete product failed:', error);
      throw error;
    }
  }
}

// ==========================================
// ORDER MANAGEMENT
// ==========================================

export class OrderService {
  static async createOrder(orderData: any) {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order failed:', error);
      throw error;
    }
  }

  static async getUserOrders(status?: string, limit = 50) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', limit.toString());

      const response = await apiClient.get(`/api/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get user orders failed:', error);
      throw error;
    }
  }

  static async getOrderDetails(orderId: string) {
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order details failed:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}/status`, {
        status,
        trackingNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Update order status failed:', error);
      throw error;
    }
  }

  static async cancelOrder(orderId: string) {
    try {
      const response = await apiClient.put(`/api/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      console.error('Cancel order failed:', error);
      throw error;
    }
  }
}

// ==========================================
// REVIEW MANAGEMENT
// ==========================================

export class ReviewService {
  static async getProductReviews(productId: string, limit = 50) {
    try {
      const response = await apiClient.get(`/api/reviews/product/${productId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get product reviews failed:', error);
      throw error;
    }
  }

  static async createReview(reviewData: any) {
    try {
      const response = await apiClient.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Create review failed:', error);
      throw error;
    }
  }

  static async updateReview(reviewId: string, updates: any) {
    try {
      const response = await apiClient.put(`/api/reviews/${reviewId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Update review failed:', error);
      throw error;
    }
  }

  static async deleteReview(reviewId: string) {
    try {
      const response = await apiClient.delete(`/api/reviews/${reviewId}`);
      return response;
    } catch (error) {
      console.error('Delete review failed:', error);
      throw error;
    }
  }

  static async markReviewHelpful(reviewId: string) {
    try {
      const response = await apiClient.post(`/api/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      console.error('Mark review helpful failed:', error);
      throw error;
    }
  }

  static async getUserReviews(limit = 50) {
    try {
      const response = await apiClient.get(`/api/reviews/user/reviews?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get user reviews failed:', error);
      throw error;
    }
  }

  static async moderateReview(reviewId: string, status: 'approved' | 'rejected') {
    try {
      const response = await apiClient.put(`/api/reviews/${reviewId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Moderate review failed:', error);
      throw error;
    }
  }
}

// ==========================================
// ANALYTICS & DASHBOARD
// ==========================================

export class AnalyticsService {
  static async getDashboardAnalytics(period = '30d') {
    try {
      const response = await apiClient.get(`/api/analytics/dashboard?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get dashboard analytics failed:', error);
      throw error;
    }
  }

  static async getArtisanAnalytics(period = '30d') {
    try {
      const response = await apiClient.get(`/api/analytics/artisan?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get artisan analytics failed:', error);
      throw error;
    }
  }

  static async getBuyerAnalytics() {
    try {
      const response = await apiClient.get('/api/analytics/buyer');
      return response.data;
    } catch (error) {
      console.error('Get buyer analytics failed:', error);
      throw error;
    }
  }
}

// ==========================================
// AI ASSISTANT
// ==========================================

export class AIAssistantService {
  static async generateProductDescription(productData: any) {
    try {
      const response = await apiClient.post('/api/ai/product-description', productData);
      return response.data;
    } catch (error) {
      console.error('Generate product description failed:', error);
      throw error;
    }
  }

  static async generatePricing(productData: any) {
    try {
      const response = await apiClient.post('/api/ai/product-pricing', productData);
      return response.data;
    } catch (error) {
      console.error('Generate pricing failed:', error);
      throw error;
    }
  }

  static async generateArtisanBio(artisanData: any) {
    try {
      const response = await apiClient.post('/api/ai/artisan-bio', artisanData);
      return response.data;
    } catch (error) {
      console.error('Generate artisan bio failed:', error);
      throw error;
    }
  }

  static async categorizeProduct(productData: any) {
    try {
      const response = await apiClient.post('/api/ai/product-categorization', productData);
      return response.data;
    } catch (error) {
      console.error('Categorize product failed:', error);
      throw error;
    }
  }

  static async getMarketInsights(category?: string, location?: string) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (location) params.append('location', location);

      const response = await apiClient.get(`/api/ai/market-insights?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get market insights failed:', error);
      throw error;
    }
  }

  static async getRecommendations(limit = 10) {
    try {
      const response = await apiClient.get(`/api/ai/recommendations?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get recommendations failed:', error);
      throw error;
    }
  }
}

// ==========================================
// FILE UPLOAD SERVICE
// ==========================================

export class FileService {
  static async uploadFile(file: File, type: 'product-image' | 'profile-image' | 'portfolio' | 'general' = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('culturecart_token');
      const response = await fetch(`${API_BASE_URL}/api/uploads/single`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data.data;
    } catch (error) {
      console.error('Upload file failed:', error);
      throw error;
    }
  }

  static async uploadMultipleFiles(files: File[], type: 'product-images' | 'portfolio' = 'product-images') {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const endpoint = type === 'product-images' ? '/api/uploads/product-images' : '/api/uploads/portfolio';
      const token = localStorage.getItem('culturecart_token');

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data.data;
    } catch (error) {
      console.error('Upload multiple files failed:', error);
      throw error;
    }
  }

  static async deleteFile(filename: string) {
    try {
      const response = await apiClient.delete(`/api/uploads/${filename}`);
      return response;
    } catch (error) {
      console.error('Delete file failed:', error);
      throw error;
    }
  }

  static async getUploadStats() {
    try {
      const response = await apiClient.get('/api/uploads/stats');
      return response.data;
    } catch (error) {
      console.error('Get upload stats failed:', error);
      throw error;
    }
  }
}

// Export all services
export { apiClient };
