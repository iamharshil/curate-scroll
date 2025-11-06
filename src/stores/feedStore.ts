import { create } from 'zustand';

interface ContentItem {
  id: string;
  title: string;
  platform: 'youtube' | 'instagram';
  publishedAt: string;
}

interface FeedStore {
  items: ContentItem[];
  addItems: (newItems: ContentItem[]) => void;
  clearFeed: () => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  items: [],
  addItems: (newItems) => set((state) => ({ items: [...state.items, ...newItems] })),
  clearFeed: () => set({ items: [] }),
}));