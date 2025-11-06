import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../config/theme';

const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.textSecondary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sign in to sync your preferences</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="time-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Screen Time Limits</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="eye-off-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Focus Mode</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="filter-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Content Filters</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="cloud-download-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Download Quality</Text>
          </View>
          <Text style={styles.settingValue}>High</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutCard}>
          <Ionicons name="sparkles" size={28} color={colors.primary} style={styles.aboutIcon} />
          <Text style={styles.aboutTitle}>CurateScroll</Text>
          <Text style={styles.aboutDescription}>
            A minimalist, distraction-free way to enjoy content from your favorite creators.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="document-text-outline" size={22} color={colors.text} />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutIcon: {
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 1.5,
    color: colors.text,
    marginBottom: 8,
  },
  aboutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  text: {
    fontSize: 18,
    color: colors.text,
  },
});

export default SettingsScreen;