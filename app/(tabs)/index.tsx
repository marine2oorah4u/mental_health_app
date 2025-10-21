import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Wind, Music, BookOpen, Phone, Sparkles, CheckCircle, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();

  const quickActions = [
    { icon: Wind, label: 'Breathe', color: theme.primary, route: '/(tabs)/wellness' },
    { icon: Music, label: 'Sounds', color: theme.secondary, route: '/(tabs)/wellness' },
    { icon: Heart, label: 'Mood Log', color: theme.accent, route: '/(tabs)/wellness' },
    { icon: BookOpen, label: 'Journal', color: theme.primary, route: '/(tabs)/wellness' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    greeting: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.95,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -8,
    },
    quickActionButton: {
      width: (width - 56) / 2,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      margin: 8,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    quickActionLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginTop: 12,
      fontWeight: '600',
    },
    emergencyButton: {
      backgroundColor: theme.error,
      borderRadius: 20,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    emergencyText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: 'bold',
      marginLeft: 12,
    },
    dailyCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    dailyCardTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    dailyCardText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      lineHeight: 22,
    },
    exploreButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    exploreButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.greeting}>
          {user ? `Welcome back, ${user.email?.split('@')[0]}` : 'Welcome'}
        </Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.dailyCard, { backgroundColor: `${theme.primary}15` }]}
            onPress={() => router.push('/(tabs)/daily-checkin')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Calendar size={28} color={theme.primary} />
              <Text style={[styles.dailyCardTitle, { marginBottom: 0, marginLeft: 12 }]}>Daily Check-in</Text>
            </View>
            <Text style={styles.dailyCardText}>
              Take a moment to check in with yourself. How are you feeling today?
            </Text>
            <View style={[styles.exploreButton, { backgroundColor: theme.primary }]}>
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.exploreButtonText}>Start Check-in</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => router.push(action.route as any)}
              >
                <action.icon size={32} color={action.color} />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help Now?</Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Phone size={24} color="#FFFFFF" />
            <Text style={styles.emergencyText}>Crisis Resources</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.dailyCard}>
            <Text style={styles.dailyCardTitle}>Daily Inspiration</Text>
            <Text style={styles.dailyCardText}>
              "You are not your thoughts. You are the observer of your thoughts. Take a moment today to simply notice without judgment."
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/companion')}
            >
              <Sparkles size={20} color="#FFFFFF" />
              <Text style={styles.exploreButtonText}>Chat with Companion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
