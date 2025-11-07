import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';
import FeedCardItem from '../components/feed/FeedCardItem';
import { colors } from '../config/theme';
import cacheService from '../services/cache.service';
import youtubeService from '../services/youtube.service';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { ContentItem } from '../types';

// Animated Header Component
const AnimatedHeader = ({ scrollY }: { scrollY: Animated.Value }) => {
  const fontSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [18, 14],
    extrapolate: 'clamp',
  });

  const letterSpacing = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [3, 1.5],
    extrapolate: 'clamp',
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0.9, 0.7],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.headerContainer}>
      <Animated.Text
        style={[
          styles.headerTitle,
          {
            fontSize,
            letterSpacing,
            opacity,
          },
        ]}
      >
        curatescroll
      </Animated.Text>
    </View>
  );
};

const FeedScreen = () => {
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const navigation = useNavigation();
  const scrollY = useState(new Animated.Value(0))[0];
  // Track previous subscriptions for cache invalidation
  const prevSubsRef = useRef<string>('');

  const getSubsKey = () => subscriptions.map((s) => s.id).sort().join(',');

  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const subsKey = getSubsKey();
      const cacheKey = `feed:${subsKey}`;
      const cachedFeed = cacheService.get<ContentItem[]>(cacheKey);
      const cacheValid = cachedFeed && !isRefresh;
      // If cache is valid and subscriptions haven't changed, use cache
      if (cacheValid && prevSubsRef.current === subsKey) {
        setFeed(cachedFeed);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      // Otherwise, fetch new data
      const newFeed: ContentItem[] = [];
      if (subscriptions.length === 0) {
        setFeed([]);
        prevSubsRef.current = subsKey;
        return;
      }
      for (const subscription of subscriptions) {
        try {
          let cachedContent = cacheService.get<ContentItem[]>(subscription.id);
          if (!cachedContent || isRefresh) {
            if (subscription.platform === 'youtube') {
              cachedContent = await youtubeService.fetchChannelVideos(subscription.id);
            }
            if (cachedContent) {
              cacheService.set(subscription.id, cachedContent, 3600000); // 1 hour for per-channel cache
            }
          }
          if (cachedContent) {
            newFeed.push(...cachedContent);
          }
        } catch (err) {
          setError(`Failed to load videos for ${subscription.name}`);
        }
      }
      // Sort by publishedAt descending (newest first)
      newFeed.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      cacheService.set(cacheKey, newFeed, 24 * 60 * 60 * 1000); // 24 hours for home feed cache
      setFeed(newFeed);
      prevSubsRef.current = subsKey;
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  // Update navigation header on scroll
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.surface,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      headerTitle: () => <AnimatedHeader scrollY={scrollY} />,
    });
  }, [navigation, scrollY]);

  const onRefresh = () => {
    loadFeed(true);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your feed...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}
      
      {!loading && subscriptions.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>📺</Text>
          <Text style={styles.emptyStateTitle}>No Subscriptions Yet</Text>
          <Text style={styles.emptyStateDescription}>
            Subscribe to your favorite creators to see their content here.
          </Text>
          <Text style={styles.emptyStateHint}>
            👉 Go to the "Add Creators" tab to get started!
          </Text>
        </View>
      )}
      
      {!loading && feed.length === 0 && subscriptions.length > 0 && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateIcon}>⏳</Text>
          <Text style={styles.emptyStateTitle}>No Content Available</Text>
          <Text style={styles.emptyStateDescription}>
            Your subscriptions don't have any videos available yet.
          </Text>
          <Text style={styles.emptyStateHint}>
            Check back soon or add more creators!
          </Text>
        </View>
      )}
      
      {!loading && feed.length > 0 && (
        <Animated.FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedCardItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  feedList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  text: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#4A1F1F',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  emptyStateHint: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  headerContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '500',
    color: colors.text,
    textTransform: 'lowercase',
  },
  feedItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  feedPlatform: {
    fontSize: 14,
    color: colors.textSecondary,
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