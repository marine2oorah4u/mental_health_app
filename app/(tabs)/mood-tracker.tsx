import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Calendar,
  Heart,
  Activity,
  BarChart3,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;
const CHART_HEIGHT = 200;

interface MoodEntry {
  check_in_date: string;
  mood_rating: number;
  energy_level?: number;
  anxiety_level?: number;
}

interface MoodStats {
  averageMood: number;
  totalEntries: number;
  bestDay: string;
  streak: number;
  moodTrend: 'improving' | 'stable' | 'declining';
}

const MOOD_OPTIONS = [
  { value: 1, icon: Frown, label: 'Struggling', color: '#DC2626' },
  { value: 2, icon: Frown, label: 'Not Great', color: '#F59E0B' },
  { value: 3, icon: Meh, label: 'Okay', color: '#6B7280' },
  { value: 4, icon: Smile, label: 'Good', color: '#10B981' },
  { value: 5, icon: Smile, label: 'Amazing', color: '#8B5CF6' },
];

export default function MoodTrackerScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoodData();
    }
  }, [user, timeRange]);

  const loadMoodData = async () => {
    if (!user?.id) return;

    setLoading(true);

    const today = new Date();
    let startDate = new Date();

    if (timeRange === 'week') {
      startDate.setDate(today.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setDate(today.getDate() - 30);
    } else {
      startDate.setDate(today.getDate() - 365);
    }

    const { data, error } = await supabase
      .from('daily_check_ins')
      .select('check_in_date, mood_rating, energy_level, anxiety_level')
      .eq('user_id', user.id)
      .gte('check_in_date', startDate.toISOString().split('T')[0])
      .order('check_in_date', { ascending: true });

    if (data) {
      setMoodData(data);
      calculateStats(data);
    }

    setLoading(false);
  };

  const calculateStats = (data: MoodEntry[]) => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    const totalMood = data.reduce((sum, entry) => sum + entry.mood_rating, 0);
    const averageMood = totalMood / data.length;

    const bestEntry = data.reduce((best, entry) =>
      entry.mood_rating > best.mood_rating ? entry : best
    );

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = data.length - 1; i >= 0; i--) {
      const entryDate = new Date(data[i].check_in_date);
      entryDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate trend (last 7 days vs previous 7 days)
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (data.length >= 14) {
      const recentMood =
        data.slice(-7).reduce((sum, e) => sum + e.mood_rating, 0) / 7;
      const previousMood =
        data.slice(-14, -7).reduce((sum, e) => sum + e.mood_rating, 0) / 7;
      const diff = recentMood - previousMood;

      if (diff > 0.3) moodTrend = 'improving';
      else if (diff < -0.3) moodTrend = 'declining';
    }

    setStats({
      averageMood: Math.round(averageMood * 10) / 10,
      totalEntries: data.length,
      bestDay: bestEntry.check_in_date,
      streak,
      moodTrend,
    });
  };

  const getMoodColor = (rating: number) => {
    const mood = MOOD_OPTIONS.find((m) => m.value === Math.round(rating));
    return mood?.color || theme.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderLineChart = () => {
    if (moodData.length === 0) {
      return (
        <View style={[styles.chartContainer, styles.emptyChart]}>
          <Activity size={48} color={theme.textSecondary} />
          <Text style={styles.emptyText}>No mood data yet</Text>
          <Text style={styles.emptySubtext}>
            Start checking in daily to see your trends
          </Text>
        </View>
      );
    }

    const maxPoints = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12;
    const displayData = moodData.slice(-maxPoints);

    const pointWidth = CHART_WIDTH / (displayData.length || 1);
    const maxMood = 5;
    const minMood = 1;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {[5, 4, 3, 2, 1].map((value) => (
            <Text key={value} style={styles.yAxisLabel}>
              {value}
            </Text>
          ))}
        </View>

        <View style={styles.chartArea}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.gridLine,
                { top: (CHART_HEIGHT / 5) * i },
              ]}
            />
          ))}

          {/* Mood line */}
          <View style={styles.lineContainer}>
            {displayData.map((entry, index) => {
              const x = pointWidth * index + pointWidth / 2;
              const y =
                CHART_HEIGHT - ((entry.mood_rating - minMood) / (maxMood - minMood)) * CHART_HEIGHT;

              const nextEntry = displayData[index + 1];
              const showLine = nextEntry !== undefined;

              return (
                <View key={index}>
                  {/* Line to next point */}
                  {showLine && (
                    <View
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        width: pointWidth,
                        height: 3,
                        backgroundColor: getMoodColor(entry.mood_rating),
                        transform: [
                          {
                            rotate: `${Math.atan2(
                              ((nextEntry.mood_rating - minMood) / (maxMood - minMood)) *
                                CHART_HEIGHT -
                                ((entry.mood_rating - minMood) / (maxMood - minMood)) *
                                  CHART_HEIGHT,
                              pointWidth
                            )}rad`,
                          },
                        ],
                        transformOrigin: 'left center',
                      }}
                    />
                  )}

                  {/* Point */}
                  <View
                    style={[
                      styles.dataPoint,
                      {
                        left: x - 6,
                        top: y - 6,
                        backgroundColor: getMoodColor(entry.mood_rating),
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {displayData.map((entry, index) => {
              const showLabel = timeRange === 'week' || index % 7 === 0;
              return showLabel ? (
                <Text
                  key={index}
                  style={[
                    styles.xAxisLabel,
                    { left: pointWidth * index + pointWidth / 2 - 20 },
                  ]}
                >
                  {formatDate(entry.check_in_date)}
                </Text>
              ) : null;
            })}
          </View>
        </View>
      </View>
    );
  };

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
    scrollContent: {
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    statCard: {
      width: '48%',
      margin: '1%',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    statValue: {
      fontSize: getFontSize(fontSize, 'xxlarge'),
      fontWeight: 'bold',
      color: theme.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    trendBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
    },
    trendText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    timeRangeButtons: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    timeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    timeButtonActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    timeButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    chartContainer: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    emptyChart: {
      height: CHART_HEIGHT + 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginTop: 12,
    },
    emptySubtext: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
    },
    yAxis: {
      position: 'absolute',
      left: 0,
      top: 16,
      height: CHART_HEIGHT,
      justifyContent: 'space-between',
      zIndex: 10,
    },
    yAxisLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      width: 20,
    },
    chartArea: {
      marginLeft: 30,
      height: CHART_HEIGHT,
      width: CHART_WIDTH - 30,
      position: 'relative',
    },
    gridLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: theme.border,
      opacity: 0.3,
    },
    lineContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    dataPoint: {
      position: 'absolute',
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    xAxis: {
      position: 'absolute',
      bottom: -24,
      left: 0,
      right: 0,
      height: 20,
    },
    xAxisLabel: {
      position: 'absolute',
      fontSize: getFontSize(fontSize, 'xsmall'),
      color: theme.textSecondary,
      width: 40,
      textAlign: 'center',
    },
    actionButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    actionButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TrendingUp size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mood Tracker</Text>
            <Text style={styles.headerSubtitle}>Track your emotional wellness</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stats && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Heart size={24} color={theme.primary} />
                <Text style={styles.statValue}>{stats.averageMood.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Average Mood</Text>
              </View>

              <View style={styles.statCard}>
                <Calendar size={24} color={theme.primary} />
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>

              <View style={styles.statCard}>
                <BarChart3 size={24} color={theme.primary} />
                <Text style={styles.statValue}>{stats.totalEntries}</Text>
                <Text style={styles.statLabel}>Total Check-ins</Text>
              </View>

              <View style={styles.statCard}>
                <Activity size={24} color={theme.primary} />
                <View
                  style={[
                    styles.trendBadge,
                    {
                      backgroundColor:
                        stats.moodTrend === 'improving'
                          ? '#10B981'
                          : stats.moodTrend === 'declining'
                          ? '#DC2626'
                          : '#6B7280',
                    },
                  ]}
                >
                  <Text style={styles.trendText}>
                    {stats.moodTrend === 'improving'
                      ? 'Improving'
                      : stats.moodTrend === 'declining'
                      ? 'Declining'
                      : 'Stable'}
                  </Text>
                </View>
                <Text style={styles.statLabel}>7-Day Trend</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Over Time</Text>

          <View style={styles.timeRangeButtons}>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'week' && styles.timeButtonActive]}
              onPress={() => setTimeRange('week')}
            >
              <Text style={styles.timeButtonText}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'month' && styles.timeButtonActive]}
              onPress={() => setTimeRange('month')}
            >
              <Text style={styles.timeButtonText}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'year' && styles.timeButtonActive]}
              onPress={() => setTimeRange('year')}
            >
              <Text style={styles.timeButtonText}>Year</Text>
            </TouchableOpacity>
          </View>

          {renderLineChart()}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/daily-checkin')}
        >
          <Heart size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Log Mood Check-in</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
