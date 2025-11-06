import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors } from '../../config/theme';
import type { ContentItem } from '../../types';

interface FeedCardItemProps {
  item: ContentItem;
}

/**
 * Extract video ID from YouTube URL
 * Handles formats: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 */
const extractYoutubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const FeedCardItem = ({ item }: FeedCardItemProps) => {
  const videoId = item.videoUrl ? extractYoutubeVideoId(item.videoUrl) : null;
  
  // Calculate dynamic height based on screen width and 16:9 aspect ratio
  const screenWidth = Dimensions.get('window').width;
  const videoHeight = (screenWidth * 9) / 16;

  // Log video info for debugging
  if (videoId) {
    console.log(`🎬 Video: "${item.title}"`);
    console.log(`📺 Video ID: ${videoId}`);
    console.log(`🔗 Original URL: ${item.videoUrl}`);
    console.log(`📐 Dynamic height: ${videoHeight}px`);
    console.log('---');
  }

  return (
    <View style={styles.feedItem}>
      {/* Video - Full width with dynamic height */}
      {videoId && item.platform === 'youtube' ? (
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={videoHeight}
            videoId={videoId}
            play={false}
            onReady={() => {
              console.log('📺 YouTube player ready');
            }}
            onChangeState={(state: string) => {
              console.log('📺 Player state:', state);
            }}
            onError={(error: string) => {
              console.error('❌ YouTube Player Error:', error);
            }}
          />
        </View>
      ) : item.thumbnailUrl ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={[styles.thumbnail, { height: videoHeight }]}
        />
      ) : null}

      {/* Title only - Ultra minimalist */}
      <View style={styles.titleContainer}>
        <Text style={styles.feedTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    backgroundColor: colors.background,
    marginBottom: 32,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    backgroundColor: colors.surfaceVariant,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 22,
  },
});

export default FeedCardItem;
