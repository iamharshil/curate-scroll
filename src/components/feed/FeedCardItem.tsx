import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
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
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoId = item.videoUrl ? extractYoutubeVideoId(item.videoUrl) : null;

  // Log video info for debugging
  if (videoId && showVideo) {
    console.log(`🎬 Video: "${item.title}"`);
    console.log(`📺 Video ID: ${videoId}`);
    console.log(`🔗 Original URL: ${item.videoUrl}`);
    console.log(`▶️  Using react-native-youtube-iframe player`);
    console.log('---');
  }

  return (
    <View style={styles.feedItem}>
      <Text style={styles.feedTitle}>{item.title}</Text>
      <Text style={styles.feedPlatform}>{item.platform}</Text>

      {item.thumbnailUrl && !showVideo && (
        <TouchableOpacity
          onPress={() => setShowVideo(true)}
          style={styles.thumbnailContainer}
        >
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
          />
          <View style={styles.playButtonOverlay}>
            <Text style={styles.playButton}>▶</Text>
          </View>
        </TouchableOpacity>
      )}

      {showVideo && videoId && item.platform === 'youtube' && (
        <View style={styles.videoWrapper}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoHeaderText}>Now Playing</Text>
            <TouchableOpacity onPress={() => setShowVideo(false)}>
              <Text style={styles.closeVideoButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            <YoutubePlayer
              height={225}
              videoId={videoId}
              onReady={() => {
                setLoading(false);
                console.log('📺 YouTube player ready');
              }}
              onChangeState={(state: string) => {
                console.log('📺 Player state:', state);
              }}
              onError={(error: string) => {
                console.error('❌ YouTube Player Error:', error);
                setLoading(false);
              }}
            />
          </View>
        </View>
      )}

      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedPlatform: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  playButton: {
    fontSize: 48,
    color: '#fff',
  },
  videoPlaceholder: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  watchButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
    lineHeight: 18,
  },
  videoWrapper: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  videoHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeVideoButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 4,
  },
  videoContainer: {
    width: '100%',
    height: 225,
    backgroundColor: '#000',
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
  },
});

export default FeedCardItem;
