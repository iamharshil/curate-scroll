export type PlatformType = 'youtube';

export interface Subscription {
  id: string;
  name: string;
  platform: PlatformType;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: PlatformType;
  publishedAt: string;
  thumbnailUrl?: string;
  description?: string;
  videoUrl?: string;
}

export interface FeedState {
  items: ContentItem[];
  hasMore: boolean;
}

export interface UserSettings {
  darkMode: boolean;
  autoPlay: boolean;
  contentDensity: 'compact' | 'comfortable';
}