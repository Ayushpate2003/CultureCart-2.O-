import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ArtisanProduct {
  id: string;
  title: string;
  price: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  createdAt: Date;
  isNew?: boolean;
}

interface ArtisanProductsStore {
  products: ArtisanProduct[];
  addProduct: (product: Omit<ArtisanProduct, 'id' | 'createdAt' | 'views' | 'status'>) => string;
  removeNewFlag: (id: string) => void;
  getProductById: (id: string) => ArtisanProduct | undefined;
  getTotalProducts: () => number;
}

export const useArtisanProductsStore = create<ArtisanProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (productData) => {
        const id = `product-${Date.now()}`;
        const newProduct: ArtisanProduct = {
          ...productData,
          id,
          status: 'pending',
          views: 0,
          createdAt: new Date(),
          isNew: true,
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        return id;
      },
      removeNewFlag: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isNew: false } : p
          ),
        }));
      },
      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },
      getTotalProducts: () => {
        return get().products.length;
      },
    }),
    {
      name: 'artisan-products-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
