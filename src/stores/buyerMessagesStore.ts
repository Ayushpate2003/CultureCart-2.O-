import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  text: string;
  sender: 'buyer' | 'artisan';
  timestamp: Date;
  attachment?: string;
}

export interface MessageThread {
  id: string;
  artisanName: string;
  artisanAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  status: 'new' | 'replied' | 'resolved';
  messages: Message[];
}

interface BuyerMessagesStore {
  threads: MessageThread[];
  addMessage: (threadId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  markAsResolved: (threadId: string) => void;
  createNewThread: (artisanName: string, initialMessage: string) => void;
  getThreadById: (id: string) => MessageThread | undefined;
}

const mockThreads: MessageThread[] = [
  {
    id: '1',
    artisanName: 'Ramesh Kumar',
    lastMessage: 'Yes, I can customize it for you! What colors do you prefer?',
    timestamp: new Date('2024-01-25T14:30:00'),
    status: 'replied',
    messages: [
      {
        id: 'm1',
        text: 'Hi! Is this Madhubani painting customizable?',
        sender: 'buyer',
        timestamp: new Date('2024-01-25T10:00:00'),
      },
      {
        id: 'm2',
        text: 'Yes, I can customize it for you! What colors do you prefer?',
        sender: 'artisan',
        timestamp: new Date('2024-01-25T14:30:00'),
      },
    ],
  },
  {
    id: '2',
    artisanName: 'Lakshmi Devi',
    lastMessage: 'Can you ship this faster? I need it by next week.',
    timestamp: new Date('2024-01-24T09:15:00'),
    status: 'new',
    messages: [
      {
        id: 'm3',
        text: 'Can you ship this faster? I need it by next week.',
        sender: 'buyer',
        timestamp: new Date('2024-01-24T09:15:00'),
      },
    ],
  },
  {
    id: '3',
    artisanName: 'Suresh Patel',
    lastMessage: 'Thank you! The shawl is beautiful.',
    timestamp: new Date('2024-01-20T16:45:00'),
    status: 'resolved',
    messages: [
      {
        id: 'm4',
        text: 'When will you ship my Pashmina shawl?',
        sender: 'buyer',
        timestamp: new Date('2024-01-18T11:30:00'),
      },
      {
        id: 'm5',
        text: 'It will be shipped today! Tracking details coming soon.',
        sender: 'artisan',
        timestamp: new Date('2024-01-18T15:20:00'),
      },
      {
        id: 'm6',
        text: 'Thank you! The shawl is beautiful.',
        sender: 'buyer',
        timestamp: new Date('2024-01-20T16:45:00'),
      },
    ],
  },
];

export const useBuyerMessagesStore = create<BuyerMessagesStore>()(
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
                  status: messageData.sender === 'buyer' ? 'new' : 'replied',
                }
              : thread
          ),
        }));
      },
      markAsResolved: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, status: 'resolved' as const }
              : thread
          ),
        }));
      },
      createNewThread: (artisanName, initialMessage) => {
        const newThread: MessageThread = {
          id: `thread-${Date.now()}`,
          artisanName,
          lastMessage: initialMessage,
          timestamp: new Date(),
          status: 'new',
          messages: [
            {
              id: `m-${Date.now()}`,
              text: initialMessage,
              sender: 'buyer',
              timestamp: new Date(),
            },
          ],
        };
        
        set((state) => ({
          threads: [newThread, ...state.threads],
        }));
      },
      getThreadById: (id) => {
        return get().threads.find((thread) => thread.id === id);
      },
    }),
    {
      name: 'buyer-messages-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
