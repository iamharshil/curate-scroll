export type PlatformType = 'youtube' | 'instagram';
export type ContentType = 'video' | 'short' | 'reel' | 'photo';

export interface Subscription {
  id: string;
  type: PlatformType;
  name: string;
  displayName: string;
  avatarUrl?: string;
  addedAt: Date;
}

export interface ContentItem {
  id: string;
  sourceId: string;
  sourceName: string;
  type: ContentType;
  platform: PlatformType;
  title: string;
  description?: string;
  thumbnail: string;
  url: string;
  publishedAt: Date;
  duration?: number;
  viewCount?: number;
  likeCount?: number;
}

export interface FeedState {
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  hasMore: boolean;
}

export interface UserSettings {
  autoPlay: boolean;
  theme: 'light' | 'dark' | 'system';
  sortBy: 'chronological' | 'source';
  sessionTimer: number;
  breakReminders: boolean;
}