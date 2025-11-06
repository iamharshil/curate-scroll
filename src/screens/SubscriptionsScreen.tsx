import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      <Text style={styles.title}>Add Creators</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for creators..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
  },
});

export default SubscriptionsScreen;