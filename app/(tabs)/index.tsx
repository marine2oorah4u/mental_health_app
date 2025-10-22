import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Heart,
  Wind,
  MessageCircle,
  Users,
  Sparkles,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimalCompanion from '@/components/AnimalCompanion';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreakData();
    }
  }, [user]);

  const loadStreakData = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data: checkIn } = await supabase
      .from('daily_check_ins')
      .select('id')
      .eq('user_id', user.id)
      .eq('check_in_date', today)
      .maybeSingle();

    setTodayCheckedIn(!!checkIn);

    const { data: stats } = await supabase
      .from('user_stats')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    if (stats) {
      setCurrentStreak(stats.current_streak || 0);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    greeting: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.9,
    },
    companionCard: {
      marginTop: 20,
      marginHorizontal: 20,
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      alignItems: 'center',
    },
    companionContainer: {
      width: 120,
      height: 120,
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    companionName: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    companionMessage: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    chatButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 32,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chatButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
    },
    content: {
      padding: 20,
    },
    emergencyBanner: {
      backgroundColor: '#DC2626',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    emergencyText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: 'bold',
      marginLeft: 12,
      flex: 1,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      marginTop: 8,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    statValue: {
      fontSize: getFontSize(fontSize, 'xxlarge'),
      fontWeight: 'bold',
      color: theme.primary,
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      textAlign: 'center',
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    actionCard: {
      width: (width - 52) / 2,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      minHeight: 120,
      justifyContent: 'center',
    },
    actionIcon: {
      marginBottom: 12,
    },
    actionLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    actionSubtext: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    communityPreview: {
      backgroundColor: `${theme.secondary}15`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    communityTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    communityText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    communityButton: {
      backgroundColor: theme.secondary,
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    communityButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCompanionMessage = () => {
    if (!todayCheckedIn) {
      return "Hey! Ready to check in? Let me know how you're feeling today.";
    }
    if (currentStreak > 0) {
      return `Great job on your ${currentStreak} day streak! I'm proud of you!`;
    }
    return "I'm here for you. Want to chat or try a breathing exercise?";
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subtitle}>Buddy is here for you</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.companionCard}>
          <View style={styles.companionContainer}>
            <AnimalCompanion animalType="cat" emotion="happy" size={120} />
          </View>
          <Text style={styles.companionName}>Buddy</Text>
          <Text style={styles.companionMessage}>{getCompanionMessage()}</Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push('/(tabs)/companion')}
          >
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.chatButtonText}>Chat with Buddy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.emergencyBanner}
            onPress={() => router.push('/(tabs)/crisis-resources')}
          >
            <AlertTriangle size={24} color="#FFFFFF" />
            <Text style={styles.emergencyText}>Need help now? Tap here</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/daily-checkin')}
            >
              <Calendar size={24} color={theme.primary} />
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/mood-tracker')}
            >
              <TrendingUp size={24} color={theme.secondary} />
              <Text style={styles.statValue}>{todayCheckedIn ? '✓' : '–'}</Text>
              <Text style={styles.statLabel}>Today's Check-in</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Wellness Tools</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/breathing')}
            >
              <Wind size={32} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Breathe</Text>
              <Text style={styles.actionSubtext}>Calm your mind</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/daily-inspiration')}
            >
              <Sparkles size={32} color="#EC4899" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Inspiration</Text>
              <Text style={styles.actionSubtext}>Daily prayers & verses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/journal')}
            >
              <BookOpen size={32} color="#10B981" style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Journal</Text>
              <Text style={styles.actionSubtext}>Express yourself</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/mood-tracker')}
            >
              <Heart size={32} color={theme.accent} style={styles.actionIcon} />
              <Text style={styles.actionLabel}>Mood</Text>
              <Text style={styles.actionSubtext}>Track feelings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.communityPreview}>
            <Users size={28} color={theme.secondary} />
            <Text style={styles.communityTitle}>Join the Community</Text>
            <Text style={styles.communityText}>
              Connect with others, share your progress, and celebrate wins
              together in a safe, supportive space.
            </Text>
            <TouchableOpacity
              style={styles.communityButton}
              onPress={() => router.push('/(tabs)/community')}
            >
              <Users size={20} color="#FFFFFF" />
              <Text style={styles.communityButtonText}>Explore Community</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
