import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  text: string;
  sender: 'buyer' | 'artisan';
  timestamp: Date;
}

export interface MessageThread {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  status: 'new' | 'replied' | 'archived';
  messages: Message[];
}

interface MessagesStore {
  threads: MessageThread[];
  addMessage: (threadId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  markAsRead: (threadId: string) => void;
  getThreadById: (id: string) => MessageThread | undefined;
}

// Mock data
const mockThreads: MessageThread[] = [
  {
    id: '1',
    buyerName: 'Priya Sharma',
    lastMessage: 'Hi, I love your Madhubani painting! Is it still available?',
    timestamp: new Date('2024-01-25T10:30:00'),
    status: 'new',
    messages: [
      {
        id: 'm1',
        text: 'Hi, I love your Madhubani painting! Is it still available?',
        sender: 'buyer',
        timestamp: new Date('2024-01-25T10:30:00'),
      },
    ],
  },
  {
    id: '2',
    buyerName: 'Rajesh Kumar',
    lastMessage: 'Thank you for the beautiful craft! It arrived safely.',
    timestamp: new Date('2024-01-24T15:20:00'),
    status: 'replied',
    messages: [
      {
        id: 'm2',
        text: 'When will you ship my order?',
        sender: 'buyer',
        timestamp: new Date('2024-01-23T09:00:00'),
      },
      {
        id: 'm3',
        text: 'Hello! Your order will be shipped today. Thank you for your patience!',
        sender: 'artisan',
        timestamp: new Date('2024-01-23T10:15:00'),
      },
      {
        id: 'm4',
        text: 'Thank you for the beautiful craft! It arrived safely.',
        sender: 'buyer',
        timestamp: new Date('2024-01-24T15:20:00'),
      },
    ],
  },
  {
    id: '3',
    buyerName: 'Anita Desai',
    lastMessage: 'Can you create a custom piece for me?',
    timestamp: new Date('2024-01-22T14:45:00'),
    status: 'new',
    messages: [
      {
        id: 'm5',
        text: 'Can you create a custom piece for me?',
        sender: 'buyer',
        timestamp: new Date('2024-01-22T14:45:00'),
      },
    ],
  },
];

export const useMessagesStore = create<MessagesStore>()(
  persist(
    (set, get) => ({
      threads: mockThreads,
      addMessage: (threadId, messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: `m-${Date.now()}`,
          timestamp: new Date(),
        };
        
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  messages: [...thread.messages, newMessage],
                  lastMessage: newMessage.text,
                  timestamp: newMessage.timestamp,
                  status: messageData.sender === 'artisan' ? 'replied' : thread.status,
                }
              : thread
          ),
        }));
      },
      markAsRead: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, status: 'replied' as const }
              : thread
          ),
        }));
      },
      getThreadById: (id) => {
        return get().threads.find((thread) => thread.id === id);
      },
    }),
    {
      name: 'messages-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
