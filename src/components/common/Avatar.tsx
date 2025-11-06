import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../../config/theme';

interface AvatarProps {
  uri?: string;
  size?: number;
}

const Avatar = ({ uri, size = 36 }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.surfaceVariant,
  },
});

export default Avatar;
