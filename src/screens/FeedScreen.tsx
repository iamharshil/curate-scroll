import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import FeedCardItem from '../components/feed/FeedCardItem';
import cacheService from '../services/cache.service';
import youtubeService from '../services/youtube.service';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { ContentItem } from '../types';

const FeedScreen = () => {
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const newFeed: ContentItem[] = [];

        console.log('📺 FeedScreen: Loading feed for subscriptions:', subscriptions);

        if (subscriptions.length === 0) {
          console.log('⚠️ No subscriptions found');
          setFeed([]);
          return;
        }

        for (const subscription of subscriptions) {
          try {
            let cachedContent = cacheService.get<ContentItem[]>(subscription.id);

            if (!cachedContent) {
              console.log(`🔄 Fetching videos for subscription: ${subscription.name} (${subscription.id})`);
              if (subscription.platform === 'youtube') {
                cachedContent = await youtubeService.fetchChannelVideos(subscription.id);
                console.log(`✅ Got ${cachedContent?.length || 0} videos from YouTube`);
              }
              // Add logic for Instagram if needed

              if (cachedContent) {
                cacheService.set(subscription.id, cachedContent, 3600000); // Cache for 1 hour
              }
            } else {
              console.log(`💾 Using cached content for ${subscription.name}`);
            }

            if (cachedContent) {
              newFeed.push(...cachedContent);
            }
          } catch (err) {
            console.error(`❌ Error fetching videos for ${subscription.name}:`, err);
            setError(`Failed to load videos for ${subscription.name}`);
          }
        }

        console.log(`📝 Total feed items: ${newFeed.length}`);
        setFeed(newFeed);
      } catch (err) {
        console.error('❌ Error loading feed:', err);
        setError('Failed to load feed');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [subscriptions]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}
      
      {!loading && subscriptions.length === 0 && (
        <Text style={styles.text}>📱 Subscribe to creators in the "Add Creators" tab to see their content here.</Text>
      )}
      
      {!loading && feed.length === 0 && subscriptions.length > 0 && (
        <Text style={styles.text}>⏳ No videos available for your subscriptions yet.</Text>
      )}
      
      {!loading && feed.length > 0 && (
        <FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedCardItem item={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
  },
  feedItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedPlatform: {
    fontSize: 14,
    color: '#666',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  videoPlayer: {
    width: 100,
    height: 100,
  },
});

export default FeedScreen;