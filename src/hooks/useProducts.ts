/**
 * Custom hooks for product management
 * Integrates with Appwrite backend via API services
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService, FileService } from '@/services/api';
import { logAnalyticsEvent } from '@/lib/appwrite';
import type { ProductDocument } from '@/lib/appwrite';

// ==========================================
// FEATURED PRODUCTS HOOK
// ==========================================

export const useFeaturedProducts = (limit = 16) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => ProductService.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==========================================
// PRODUCT SEARCH HOOK
// ==========================================

export const useProductSearch = () => {
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    category: '',
    craftTradition: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    state: '',
    sortBy: 'popular' as 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular',
    limit: 50,
  });

  const query = useQuery({
    queryKey: ['products', 'search', searchParams],
    queryFn: () => ProductService.searchProducts(searchParams),
    enabled: Object.values(searchParams).some(value => value !== '' && value !== undefined),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateSearch = useCallback((updates: Partial<typeof searchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({
      searchTerm: '',
      category: '',
      craftTradition: '',
      minPrice: undefined,
      maxPrice: undefined,
      state: '',
      sortBy: 'popular',
      limit: 50,
    });
  }, []);

  return {
    ...query,
    searchParams,
    updateSearch,
    clearSearch,
  };
};

// ==========================================
// PRODUCT DETAILS HOOK
// ==========================================

export const useProductDetails = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'details', productId],
    queryFn: () => ProductService.getProductDetails(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==========================================
// SIMILAR PRODUCTS HOOK
// ==========================================

export const useSimilarProducts = (productId: string, category: string, craftTradition: string, limit = 8) => {
  return useQuery({
    queryKey: ['products', 'similar', productId, category, craftTradition, limit],
    queryFn: () => ProductService.getSimilarProducts(productId, category, craftTradition, limit),
    enabled: !!productId && !!category && !!craftTradition,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==========================================
// CREATE PRODUCT HOOK
// ==========================================

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Omit<ProductDocument, 'createdAt' | 'updatedAt'>) =>
      ProductService.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // Log successful creation
      logAnalyticsEvent('product_creation_success', newProduct.artisanId, {
        productId: newProduct.$id,
        category: newProduct.category,
        price: newProduct.price,
      });
    },
    onError: (error, variables) => {
      console.error('Product creation failed:', error);
      logAnalyticsEvent('product_creation_failed', variables.artisanId, {
        error: error.message,
        category: variables.category,
      });
    },
  });
};

// ==========================================
// UPDATE PRODUCT HOOK
// ==========================================

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, updates }: { productId: string; updates: Partial<ProductDocument> }) =>
      ProductService.updateProduct(productId, updates),
    onSuccess: (updatedProduct, { productId }) => {
      // Update cached product details
      queryClient.setQueryData(['products', 'details', productId], updatedProduct);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['products'] });

      logAnalyticsEvent('product_update_success', undefined, {
        productId,
        fields: Object.keys(updatedProduct),
      }, productId);
    },
  });
};

// ==========================================
// PRODUCT IMAGE UPLOAD HOOK
// ==========================================

export const useProductImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: async ({ file, productId }: { file: File; productId?: string }) => {
      const result = await FileService.uploadProductImage(file, productId);

      // Simulate progress (in real implementation, use actual upload progress)
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      return result;
    },
    onSuccess: (result, { file }) => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });

      logAnalyticsEvent('image_upload_success', undefined, {
        fileId: result.fileId,
        fileSize: file.size,
        productId: productId,
      });
    },
    onError: (error, { file }) => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });

      console.error('Image upload failed:', error);
      logAnalyticsEvent('image_upload_failed', undefined, {
        fileName: file.name,
        fileSize: file.size,
        error: error.message,
      });
    },
  });

  const uploadImage = useCallback((file: File, productId?: string) => {
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
    return mutation.mutateAsync({ file, productId });
  }, [mutation]);

  return {
    ...mutation,
    uploadImage,
    uploadProgress,
  };
};

// ==========================================
// 3D MODEL UPLOAD HOOK
// ==========================================

export const use3DModelUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const mutation = useMutation({
    mutationFn: async ({ file, productId }: { file: File; productId: string }) => {
      const result = await FileService.upload3DModel(file, productId);

      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      return result;
    },
    onSuccess: (result, { file, productId }) => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });

      logAnalyticsEvent('3d_model_upload_success', undefined, {
        fileId: result.fileId,
        fileSize: file.size,
        productId,
      }, productId);
    },
    onError: (error, { file }) => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });

      console.error('3D model upload failed:', error);
      logAnalyticsEvent('3d_model_upload_failed', undefined, {
        fileName: file.name,
        fileSize: file.size,
        error: error.message,
      });
    },
  });

  const upload3DModel = useCallback((file: File, productId: string) => {
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
    return mutation.mutateAsync({ file, productId });
  }, [mutation]);

  return {
    ...mutation,
    upload3DModel,
    uploadProgress,
  };
};

// ==========================================
// PRODUCT FAVORITES HOOK
// ==========================================

export const useProductFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (userId) {
      const stored = localStorage.getItem(`favorites_${userId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites(new Set(parsed));
        } catch (error) {
          console.error('Failed to parse favorites:', error);
        }
      }
    }
  }, [userId]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify([...favorites]));
    }
  }, [favorites, userId]);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites(prev => new Set([...prev, productId]));
    logAnalyticsEvent('product_added_to_favorites', userId, { productId });
  }, [userId]);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(productId);
      return newFavorites;
    });
    logAnalyticsEvent('product_removed_from_favorites', userId, { productId });
  }, [userId]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        logAnalyticsEvent('product_removed_from_favorites', userId, { productId });
      } else {
        newFavorites.add(productId);
        logAnalyticsEvent('product_added_to_favorites', userId, { productId });
      }
      return newFavorites;
    });
  }, [userId]);

  const isFavorite = useCallback((productId: string) => favorites.has(productId), [favorites]);

  return {
    favorites: [...favorites],
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.size,
  };
};

// ==========================================
// PRODUCT CATEGORIES HOOK
// ==========================================

export const useProductCategories = () => {
  // Static categories for now - in production, fetch from API
  const categories = [
    { id: 'textiles', name: 'Textiles & Fabrics', icon: '🧵' },
    { id: 'pottery', name: 'Pottery & Ceramics', icon: '🏺' },
    { id: 'jewelry', name: 'Jewelry & Accessories', icon: '💍' },
    { id: 'woodwork', name: 'Woodwork & Furniture', icon: '🪵' },
    { id: 'metalwork', name: 'Metalwork', icon: '⚒️' },
    { id: 'leather', name: 'Leather Goods', icon: '👜' },
    { id: 'paintings', name: 'Paintings & Art', icon: '🎨' },
    { id: 'handicrafts', name: 'Handicrafts', icon: '✋' },
  ];

  return { categories };
};

// ==========================================
// CRAFT TRADITIONS HOOK
// ==========================================

export const useCraftTraditions = () => {
  // Static craft traditions - in production, fetch from API
  const traditions = [
    { id: 'madhubani', name: 'Madhubani Painting', state: 'Bihar' },
    { id: 'warli', name: 'Warli Art', state: 'Maharashtra' },
    { id: 'kutch-embroidery', name: 'Kutch Embroidery', state: 'Gujarat' },
    { id: 'kantha', name: 'Kantha Stitch', state: 'West Bengal' },
    { id: 'bidri', name: 'Bidri Work', state: 'Karnataka' },
    { id: 'blue-pottery', name: 'Blue Pottery', state: 'Rajasthan' },
    { id: 'terracotta', name: 'Terracotta', state: 'West Bengal' },
    { id: 'phulkari', name: 'Phulkari', state: 'Punjab' },
  ];

  return { traditions };
};
