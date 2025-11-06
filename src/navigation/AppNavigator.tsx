import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../config/theme';
import FeedScreen from '../screens/FeedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';

const Tab = createBottomTabNavigator();

export type RootTabParamList = {
  Home: undefined;
  Subscriptions: undefined;
  Settings: undefined;
};

const AppNavigator = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Subscriptions') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
          },
          headerStyle: {
            backgroundColor: colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={FeedScreen}
          options={{
            headerTitle: () => (
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>curatescroll</Text>
              </View>
            ),
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen 
          name="Subscriptions" 
          component={SubscriptionsScreen}
          options={{
            title: 'Add Creators',
            tabBarLabel: 'Explore',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarLabel: 'You',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 3,
    color: colors.text,
    textTransform: 'lowercase',
    opacity: 0.9,
  },
});

export default AppNavigator;