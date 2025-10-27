import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AnalyticsData {
  date: string;
  views: number;
  sales: number;
  revenue: number;
}

export interface TopProduct {
  name: string;
  views: number;
  sales: number;
  revenue: number;
}

interface AnalyticsStore {
  weeklyData: AnalyticsData[];
  monthlyData: AnalyticsData[];
  topProducts: TopProduct[];
  kpis: {
    totalViews: number;
    totalOrders: number;
    totalRevenue: number;
    growthPercentage: number;
    conversionRate: number;
  };
}

// Mock data for demonstration
const generateMockData = (): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100) + 50,
      sales: Math.floor(Math.random() * 10) + 1,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  
  return data;
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    () => ({
      weeklyData: generateMockData().slice(-7),
      monthlyData: generateMockData(),
      topProducts: [
        { name: 'Madhubani Painting', views: 342, sales: 18, revenue: 44982 },
        { name: 'Warli Art Canvas', views: 289, sales: 15, revenue: 28485 },
        { name: 'Pattachitra Art', views: 267, sales: 12, revenue: 39588 },
        { name: 'Terracotta Pottery', views: 234, sales: 10, revenue: 15990 },
        { name: 'Bamboo Handicraft', views: 198, sales: 8, revenue: 11992 },
      ],
      kpis: {
        totalViews: 1847,
        totalOrders: 87,
        totalRevenue: 240000,
        growthPercentage: 18,
        conversionRate: 4.7,
      },
    }),
    {
      name: 'analytics-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
