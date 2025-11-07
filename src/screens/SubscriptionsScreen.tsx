import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/common/Avatar';
import { colors } from '../config/theme';
import type { RootTabParamList } from '../navigation/AppNavigator';
import youtubeService from '../services/youtube.service';
import { useFeedStore } from '../stores/feedStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { ContentItem } from '../types';

const SubscriptionsScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  // In-memory cache for search results
  const searchCache = useRef<{ [key: string]: { data: ContentItem[]; timestamp: number } }>({});

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const cacheKey = query.trim().toLowerCase();
    const now = Date.now();
    const cached = searchCache.current[cacheKey];
    if (cached && now - cached.timestamp < 5 * 60 * 1000) {
      setResults(cached.data);
      return;
    }
    try {
      setLoading(true);
      console.log('Starting search for:', query);
      const youtubeResults = await youtubeService.searchChannels(query);
      console.log('YouTube results:', youtubeResults.length);
      
      setResults(youtubeResults);
      searchCache.current[cacheKey] = {
        data: youtubeResults,
        timestamp: now,
      };
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFeed = useFeedStore((state) => state.addItems);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const navigation = useNavigation<NativeStackNavigationProp<RootTabParamList>>();

  const handleItemPress = (item: ContentItem) => {
    Alert.alert('Creator Selected', `You selected: ${item.title}`);

    // Add the creator's content to the feed
    addToFeed([item]);

    // Subscribe to the creator
    addSubscription({
      id: item.id,
      name: item.title,
      platform: item.platform,
    });

    // Redirect to the home page
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar - YouTube style */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search creators..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : results.length === 0 && !query ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Discover Creators</Text>
          <Text style={styles.emptyDescription}>
            Search for your favorite YouTube channels
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
              style={styles.resultItem}
            >
              {/* Channel Thumbnail */}
              {item.thumbnailUrl && (
                <Avatar uri={item.thumbnailUrl} size={80} />
              )}
              
              {/* Channel Name - Minimalist */}
              <Text style={styles.channelName} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
  searchContainer: {
    padding: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  searchButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  resultItem: {
    backgroundColor: colors.background,
    marginBottom: 32,
    alignItems: 'center',
  },
  channelName: {
    fontSize: 15,
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  creatorInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  platformText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  subscriberCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  creatorDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribeButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default SubscriptionsScreen;