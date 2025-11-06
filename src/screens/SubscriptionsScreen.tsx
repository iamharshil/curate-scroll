import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/common/Avatar';
import { colors } from '../config/theme';
import type { RootTabParamList } from '../navigation/AppNavigator';
import instagramService from '../services/instagram.service';
import youtubeService from '../services/youtube.service';
import { useFeedStore } from '../stores/feedStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { ContentItem } from '../types';

const SubscriptionsScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);

  const handleSearch = async () => {
    try {
      const youtubeResults = await youtubeService.searchChannels(query);
      const instagramResults = await instagramService.fetchProfilePosts(query);
      setResults([...youtubeResults, ...instagramResults]);
    } catch (error) {
      console.error('Error fetching results:', error);
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
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results List */}
      {results.length === 0 && !query ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Discover Creators</Text>
          <Text style={styles.emptyDescription}>
            Search for your favorite YouTube channels and Instagram creators
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
            >
              <View style={styles.creatorCard}>
                <Avatar uri={item.thumbnailUrl} size={56} />
                
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons 
                      name={item.platform === 'youtube' ? 'logo-youtube' : 'logo-instagram'} 
                      size={16} 
                      color={item.platform === 'youtube' ? '#FF0000' : '#E4405F'} 
                    />
                    <Text style={styles.platformText}>{item.platform}</Text>
                    <Text style={styles.subscriberCount}>• 1.2M subscribers</Text>
                  </View>
                  {item.description && (
                    <Text style={styles.creatorDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.subscribeButton}
                  onPress={() => handleItemPress(item)}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
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
  listContent: {
    padding: 12,
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
  resultItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default SubscriptionsScreen;