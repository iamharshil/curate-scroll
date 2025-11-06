import axios from 'axios';
import type { ContentItem } from '../types';

const BASE_URL = 'https://www.instagram.com';

interface InstagramPostNode {
  id: string;
  accessibility_caption: string | null;
  taken_at_timestamp: number;
  thumbnail_src: string;
  edge_media_to_caption: {
    edges: Array<{ node: { text: string } }>;
  };
}

class InstagramService {
  /**
   * Fetch posts from a public Instagram profile.
   */
  async fetchProfilePosts(username: string): Promise<ContentItem[]> {
    try {
      console.log('Instagram API Request:', { username });
      const response = await axios.get(`${BASE_URL}/${username}/?__a=1&__d=dis`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      console.log('Instagram API Response:', response.data);

      const graphql = response.data.graphql;
      if (!graphql || !graphql.user) {
        console.warn('Invalid response structure. Response:', response.data);
        return [];
      }

      const posts: Array<{ node: InstagramPostNode }> = graphql.user.edge_owner_to_timeline_media.edges;

      return posts.map((edge) => ({
        id: edge.node.id,
        title: edge.node.accessibility_caption || 'Instagram Post',
        platform: 'instagram',
        publishedAt: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
        thumbnailUrl: edge.node.thumbnail_src,
        description: edge.node.edge_media_to_caption.edges[0]?.node.text || '',
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Instagram API Error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
      throw new Error('Failed to fetch Instagram posts.');
    }
  }
}

export default new InstagramService();