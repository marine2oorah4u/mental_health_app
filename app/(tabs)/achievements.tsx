import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  MessageCircle,
  Users,
  Heart,
  Award,
  Wind,
  CircleCheck,
  BookOpen,
  PenTool,
  Smile,
  TrendingUp,
  Calendar,
  Moon,
  Sunrise,
  Star,
  RotateCcw,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
  progress: number;
}

interface UserStats {
  total_conversations: number;
  total_messages: number;
  current_streak: number;
  longest_streak: number;
  breathing_exercises_completed: number;
  journal_entries_created: number;
  mood_logs_created: number;
  total_points: number;
}

const iconMap: Record<string, any> = {
  'message-circle': MessageCircle,
  users: Users,
  heart: Heart,
  award: Award,
  wind: Wind,
  'circle-check': CircleCheck,
  'book-open': BookOpen,
  'pen-tool': PenTool,
  smile: Smile,
  'trending-up': TrendingUp,
  calendar: Calendar,
  trophy: Trophy,
  moon: Moon,
  sunrise: Sunrise,
  star: Star,
};

const categoryColors: Record<string, string> = {
  engagement: '#3B82F6',
  wellness: '#10B981',
  milestone: '#F59E0B',
  special: '#8B5CF6',
};

export default function AchievementsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user?.id) return;

    const [achievementsRes, userAchievementsRes, statsRes] = await Promise.all([
      supabase.from('achievements').select('*').order('category'),
      supabase
        .from('user_achievements')
        .select('achievement_id, earned_at, progress')
        .eq('user_id', user.id),
      supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    if (achievementsRes.data) setAchievements(achievementsRes.data);
    if (userAchievementsRes.data) setUserAchievements(userAchievementsRes.data);
    if (statsRes.data) setUserStats(statsRes.data);

    setLoading(false);
  };

  const resetAchievements = async () => {
    if (!user?.id) return;

    await Promise.all([
      supabase.from('user_achievements').delete().eq('user_id', user.id),
      supabase.from('user_stats').delete().eq('user_id', user.id),
    ]);

    setUserAchievements([]);
    setUserStats(null);
    await loadData();
  };

  const isAchievementEarned = (achievementId: string) => {
    return userAchievements.some((ua) => ua.achievement_id === achievementId);
  };

  const getAchievementProgress = (achievement: Achievement): number => {
    const userAch = userAchievements.find((ua) => ua.achievement_id === achievement.id);
    if (userAch) return 100;

    if (!userStats) return 0;

    switch (achievement.requirement_type) {
      case 'count':
        if (achievement.name.includes('First Words') || achievement.name.includes('message')) {
          return Math.min(
            (userStats.total_messages / achievement.requirement_value) * 100,
            100
          );
        }
        if (achievement.name.includes('conversation')) {
          return Math.min(
            (userStats.total_conversations / achievement.requirement_value) * 100,
            100
          );
        }
        if (achievement.name.includes('breathing')) {
          return Math.min(
            (userStats.breathing_exercises_completed / achievement.requirement_value) * 100,
            100
          );
        }
        if (achievement.name.includes('journal')) {
          return Math.min(
            (userStats.journal_entries_created / achievement.requirement_value) * 100,
            100
          );
        }
        if (achievement.name.includes('mood') || achievement.name.includes('Mood')) {
          return Math.min(
            (userStats.mood_logs_created / achievement.requirement_value) * 100,
            100
          );
        }
        if (achievement.name.includes('points')) {
          return Math.min((userStats.total_points / achievement.requirement_value) * 100, 100);
        }
        break;

      case 'streak':
        return Math.min((userStats.current_streak / achievement.requirement_value) * 100, 100);

      case 'specific':
        return 0;
    }

    return 0;
  };

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const earnedCount = achievements.filter((a) => isAchievementEarned(a.id)).length;
  const totalPoints = userStats?.total_points || 0;

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'special', label: 'Special' },
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
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.95,
    },
    statsRow: {
      flexDirection: 'row',
      marginTop: 16,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
    },
    statValue: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 4,
    },
    statLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#FFFFFF',
      opacity: 0.9,
      marginTop: 2,
    },
    categoryTabs: {
      paddingVertical: 16,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || 'rgba(0,0,0,0.1)',
    },
    categoryTab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.surface,
      marginRight: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    categoryTabActive: {
      backgroundColor: theme.primary,
    },
    categoryTabText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
    },
    categoryTabTextActive: {
      color: '#FFFFFF',
    },
    scrollContent: {
      padding: 20,
    },
    achievementCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    achievementCardEarned: {
      borderWidth: 2,
      borderColor: '#10B981',
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    iconContainerLocked: {
      opacity: 0.4,
    },
    achievementContent: {
      flex: 1,
    },
    achievementName: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 8,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    pointsBadge: {
      backgroundColor: '#F59E0B',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
    },
    pointsText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    earnedBadge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
    },
    earnedText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    resetButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 20,
      padding: 10,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Trophy size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Achievements</Text>
            <Text style={styles.headerSubtitle}>Track your progress</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={resetAchievements}>
            <RotateCcw size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{earnedCount}/{achievements.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats?.current_streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryTab,
              selectedCategory === cat.value && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(cat.value)}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === cat.value && styles.categoryTabTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredAchievements.map((achievement, index) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const earned = isAchievementEarned(achievement.id);
          const progress = getAchievementProgress(achievement);
          const categoryColor = categoryColors[achievement.category] || theme.primary;

          return (
            <Animated.View
              key={achievement.id}
              entering={FadeInDown.delay(index * 60).duration(500)}
            >
              <View style={[styles.achievementCard, earned && styles.achievementCardEarned]}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${categoryColor}20` },
                    !earned && styles.iconContainerLocked,
                  ]}
                >
                  <Icon size={28} color={categoryColor} />
                </View>

                <View style={styles.achievementContent}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>

                  {!earned && (
                    <>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progress}%`, backgroundColor: categoryColor },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
                    </>
                  )}

                  {earned ? (
                    <View style={styles.earnedBadge}>
                      <Text style={styles.earnedText}>Earned!</Text>
                    </View>
                  ) : (
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsText}>{achievement.points} pts</Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
