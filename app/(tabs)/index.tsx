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
  Flame,
  CheckCircle2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
      paddingHorizontal: 24,
      paddingBottom: 120,
    },
    greeting: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 6,
    },
    subtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.85,
      fontWeight: '400',
    },
    companionCard: {
      marginTop: -30,
      marginHorizontal: 24,
      backgroundColor: theme.surface,
      borderRadius: 28,
      padding: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 12,
      alignItems: 'center',
    },
    companionContainer: {
      width: 140,
      height: 140,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `${theme.primary}10`,
      borderRadius: 70,
    },
    companionName: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
    },
    companionMessage: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
      paddingHorizontal: 8,
    },
    chatButton: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 36,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    chatButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
    },
    content: {
      padding: 24,
    },
    emergencyBanner: {
      backgroundColor: '#DC2626',
      borderRadius: 20,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 28,
      shadowColor: '#DC2626',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    emergencyText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      marginLeft: 12,
      flex: 1,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 16,
      marginTop: 4,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 28,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    statIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: getFontSize(fontSize, 'xxlarge'),
      fontWeight: '800',
      color: theme.text,
      marginBottom: 6,
    },
    statLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      textAlign: 'center',
      fontWeight: '600',
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 28,
    },
    actionCard: {
      width: (width - 64) / 2,
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      minHeight: 140,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    actionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    actionLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 4,
    },
    actionSubtext: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 2,
      textAlign: 'center',
      fontWeight: '500',
    },
    communityPreview: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    communityIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    communityTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 10,
    },
    communityText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      lineHeight: 24,
      marginBottom: 20,
    },
    communityButton: {
      backgroundColor: theme.secondary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    communityButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
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
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: '#FF6B3520' },
                ]}
              >
                <Flame size={26} color="#FF6B35" strokeWidth={2.5} />
              </View>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/mood-tracker')}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: '#10B98120' },
                ]}
              >
                <CheckCircle2 size={26} color="#10B981" strokeWidth={2.5} />
              </View>
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
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: '#3B82F615' },
                ]}
              >
                <Wind size={28} color="#3B82F6" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionLabel}>Breathe</Text>
              <Text style={styles.actionSubtext}>Calm your mind</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/daily-inspiration')}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: '#EC489915' },
                ]}
              >
                <Sparkles size={28} color="#EC4899" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionLabel}>Inspiration</Text>
              <Text style={styles.actionSubtext}>Daily prayers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/journal')}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: '#10B98115' },
                ]}
              >
                <BookOpen size={28} color="#10B981" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionLabel}>Journal</Text>
              <Text style={styles.actionSubtext}>Express yourself</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/mood-tracker')}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: '#F59E0B15' },
                ]}
              >
                <Heart size={28} color="#F59E0B" strokeWidth={2.5} />
              </View>
              <Text style={styles.actionLabel}>Mood</Text>
              <Text style={styles.actionSubtext}>Track feelings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.communityPreview}>
            <View
              style={[
                styles.communityIconContainer,
                { backgroundColor: `${theme.secondary}20` },
              ]}
            >
              <Users size={24} color={theme.secondary} strokeWidth={2.5} />
            </View>
            <Text style={styles.communityTitle}>Join the Community</Text>
            <Text style={styles.communityText}>
              Connect with others, share your progress, and celebrate wins
              together in a safe, supportive space.
            </Text>
            <TouchableOpacity
              style={styles.communityButton}
              onPress={() => router.push('/(tabs)/community')}
            >
              <Users size={22} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.communityButtonText}>Explore Community</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
