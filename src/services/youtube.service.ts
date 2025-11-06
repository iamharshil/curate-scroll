import axios from 'axios';
import type { ContentItem } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchItem {
  id: { channelId?: string; videoId?: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: { default: { url: string } };
    description: string;
  };
}

class YouTubeService {
  /**
   * Search for YouTube channels by query.
   */
  async searchChannels(query: string, maxResults = 10): Promise<ContentItem[]> {
    try {
      console.log('YouTube API Request:', { query, maxResults });
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'channel',
          maxResults,
          key: API_KEY,
        },
      });

      return response.data.items
        .filter((item: YouTubeSearchItem) => item.id.channelId)
        .map((item: YouTubeSearchItem) => ({
          id: item.id.channelId || '',
          title: item.snippet.title,
          platform: 'youtube',
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: item.snippet.thumbnails.default.url,
          description: item.snippet.description,
        }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('YouTube API Error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
      throw new Error('Failed to fetch YouTube channels.');
    }
  }

  /**
   * Fetch videos for a YouTube channel by channel ID.
   */
  async fetchChannelVideos(channelId: string, maxResults = 10): Promise<ContentItem[]> {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          channelId,
          maxResults,
          type: 'video',
          key: API_KEY,
        },
      });

      return response.data.items.map((item: YouTubeSearchItem) => ({
        id: item.id.videoId || '',
        title: item.snippet.title,
        platform: 'youtube',
        publishedAt: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnailUrl: item.snippet.thumbnails.default.url,
        description: item.snippet.description,
      }));
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      return [];
    }
  }
}

export default new YouTubeService();