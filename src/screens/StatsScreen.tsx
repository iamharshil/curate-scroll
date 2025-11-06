import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../config/theme';

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stats Screen - Dummy UI</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 18,
    color: colors.text,
  },
});

export default StatsScreen;