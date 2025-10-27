import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface MonthlyData {
  month: string;
  orders: number;
  spend: number;
}

export interface CategoryData {
  category: string;
  value: number;
  percentage: number;
}

export interface ReviewData {
  month: string;
  reviews: number;
}

interface BuyerAnalyticsStore {
  totalSpend: number;
  averageOrderValue: number;
  deliveredOrders: number;
  topCategory: string;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  reviewData: ReviewData[];
  selectedRange: '30d' | '3m' | '6m' | 'all';
  setSelectedRange: (range: '30d' | '3m' | '6m' | 'all') => void;
}

const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', orders: 4, spend: 12500 },
  { month: 'Feb', orders: 6, spend: 18750 },
  { month: 'Mar', orders: 8, spend: 24200 },
  { month: 'Apr', orders: 5, spend: 15600 },
  { month: 'May', orders: 7, spend: 21800 },
  { month: 'Jun', orders: 9, spend: 28500 },
];

const mockCategoryData: CategoryData[] = [
  { category: 'Textiles', value: 35, percentage: 35 },
  { category: 'Pottery', value: 25, percentage: 25 },
  { category: 'Paintings', value: 20, percentage: 20 },
  { category: 'Jewelry', value: 12, percentage: 12 },
  { category: 'Others', value: 8, percentage: 8 },
];

const mockReviewData: ReviewData[] = [
  { month: 'Jan', reviews: 3 },
  { month: 'Feb', reviews: 5 },
  { month: 'Mar', reviews: 7 },
  { month: 'Apr', reviews: 4 },
  { month: 'May', reviews: 6 },
  { month: 'Jun', reviews: 8 },
];

export const useBuyerAnalyticsStore = create<BuyerAnalyticsStore>()(
  persist(
    (set) => ({
      totalSpend: 121350,
      averageOrderValue: 3108,
      deliveredOrders: 39,
      topCategory: 'Handwoven Textiles',
      monthlyData: mockMonthlyData,
      categoryData: mockCategoryData,
      reviewData: mockReviewData,
      selectedRange: '6m',
      setSelectedRange: (range) => set({ selectedRange: range }),
    }),
    {
      name: 'buyer-analytics-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
