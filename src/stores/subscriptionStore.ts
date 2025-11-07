import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Subscription {
  id: string;
  name: string;
  platform: 'youtube';
}

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  removeSubscription: (id: string) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      subscriptions: [],
      addSubscription: (subscription) =>
        set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),
      removeSubscription: (id) =>
        set((state) => ({ subscriptions: state.subscriptions.filter((sub) => sub.id !== id) })),
    }),
    { name: 'subscription-store' }
  )
);