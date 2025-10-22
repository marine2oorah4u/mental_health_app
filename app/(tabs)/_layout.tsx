import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, MessageCircle, Users, User, Heart } from 'lucide-react-native';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="companion"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'People',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="breathing"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="sounds"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="crisis-resources"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion-memories"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion-settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="theme-builder"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion-room"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="music-library"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="daily-checkin"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion-environment"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="companion-appearance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="voice-settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
