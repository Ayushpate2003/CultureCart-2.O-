import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  date: Date;
  type: 'Order Reward' | 'Refund' | 'Voucher' | 'Referral Bonus' | 'Cashback';
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing';
  description: string;
}

interface BuyerEarningsStore {
  walletBalance: number;
  pendingAmount: number;
  lifetimeEarnings: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  requestWithdrawal: (amount: number) => void;
}

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: new Date('2024-01-20'),
    type: 'Referral Bonus',
    amount: 500,
    status: 'Completed',
    description: 'Friend joined using your referral code',
  },
  {
    id: 't2',
    date: new Date('2024-01-18'),
    type: 'Order Reward',
    amount: 150,
    status: 'Completed',
    description: 'Cashback on Madhubani Painting purchase',
  },
  {
    id: 't3',
    date: new Date('2024-01-15'),
    type: 'Refund',
    amount: 2499,
    status: 'Completed',
    description: 'Order #12345 refunded',
  },
  {
    id: 't4',
    date: new Date('2024-01-12'),
    type: 'Cashback',
    amount: 200,
    status: 'Pending',
    description: 'Cashback on Brass Lamp order',
  },
  {
    id: 't5',
    date: new Date('2024-01-10'),
    type: 'Voucher',
    amount: 1000,
    status: 'Completed',
    description: 'Festival bonus voucher',
  },
];

export const useBuyerEarningsStore = create<BuyerEarningsStore>()(
  persist(
    (set, get) => ({
      walletBalance: 3549,
      pendingAmount: 200,
      lifetimeEarnings: 8950,
      transactions: mockTransactions,
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `t-${Date.now()}`,
          date: new Date(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      requestWithdrawal: (amount) => {
        const currentBalance = get().walletBalance;
        if (amount <= currentBalance) {
          set((state) => ({
            walletBalance: state.walletBalance - amount,
            pendingAmount: state.pendingAmount + amount,
          }));
        }
      },
    }),
    {
      name: 'buyer-earnings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
