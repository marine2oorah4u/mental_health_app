import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Smile,
  Meh,
  Frown,
  Heart,
  Check,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const MOOD_OPTIONS = [
  { value: 1, icon: Frown, label: 'Struggling', color: '#DC2626' },
  { value: 2, icon: Frown, label: 'Not Great', color: '#F59E0B' },
  { value: 3, icon: Meh, label: 'Okay', color: '#6B7280' },
  { value: 4, icon: Smile, label: 'Good', color: '#10B981' },
  { value: 5, icon: Smile, label: 'Amazing!', color: '#8B5CF6' },
];

const GRATITUDE_PROMPTS = [
  'What made you smile today?',
  'Who are you grateful for?',
  'What went well today?',
  'What are you looking forward to?',
  'What comfort did you find today?',
];

export default function DailyCheckInScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [gratitudeText, setGratitudeText] = useState('');
  const [note, setNote] = useState('');
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prompt] = useState(
    GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)]
  );

  useEffect(() => {
    if (user) {
      checkTodayStatus();
      loadStreak();
    }
  }, [user]);

  const checkTodayStatus = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', user.id)
      .eq('check_in_date', today)
      .maybeSingle();

    if (data) {
      setHasCheckedInToday(true);
      setTodayCheckIn(data);
      setMoodRating(data.mood_rating);
      setGratitudeText(data.gratitude_text || '');
      setNote(data.note || '');
    }
  };

  const loadStreak = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_check_ins')
      .select('check_in_date')
      .eq('user_id', user.id)
      .order('check_in_date', { ascending: false })
      .limit(30);

    if (data && data.length > 0) {
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < data.length; i++) {
        const checkInDate = new Date(data[i].check_in_date);
        checkInDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - currentStreak);

        if (checkInDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    }
  };

  const submitCheckIn = async () => {
    if (!user || !moodRating) {
      Alert.alert('Missing Info', 'Please select your mood first');
      return;
    }

    setLoading(true);

    const today = new Date().toISOString().split('T')[0];
    const checkInData = {
      user_id: user.id,
      check_in_date: today,
      mood_rating: moodRating,
      gratitude_text: gratitudeText.trim() || null,
      note: note.trim() || null,
    };

    const { error } = await supabase
      .from('daily_check_ins')
      .upsert(checkInData, {
        onConflict: 'user_id,check_in_date',
      });

    if (!error) {
      setHasCheckedInToday(true);
      loadStreak();
      Alert.alert('Check-in Complete!', 'Great job taking time for yourself today! 🎉');
    } else {
      Alert.alert('Error', 'Could not save check-in');
    }

    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      padding: 24,
      paddingTop: 60,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'xxlarge'),
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: 'rgba(255, 255, 255, 0.9)',
    },
    streakBanner: {
      backgroundColor: theme.primary,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    streakText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 16,
    },
    prompt: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.primary,
      fontStyle: 'italic',
      marginBottom: 16,
    },
    moodGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    moodButton: {
      flex: 1,
      aspectRatio: 1,
      backgroundColor: theme.surface,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
      gap: 8,
    },
    moodButtonActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    moodLabel: {
      fontSize: getFontSize(fontSize, 'xsmall'),
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
    },
    textInput: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginTop: 24,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
    },
    completedCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      gap: 16,
    },
    completedIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    completedTitle: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    completedText: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.textSecondary,
      textAlign: 'center',
    },
    summaryCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 12,
    },
    summaryLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.textSecondary,
      flex: 1,
    },
    summaryValue: {
      fontSize: getFontSize(fontSize, 'medium'),
      color: theme.text,
      flex: 2,
    },
  });

  if (!user) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Daily Check-in</Text>
          <Text style={styles.headerSubtitle}>Sign in to track your daily wellness</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <Text style={styles.headerSubtitle}>
          How are you feeling today?
        </Text>
      </LinearGradient>

      {streak > 0 && (
        <View style={styles.streakBanner}>
          <TrendingUp size={24} color="#FFFFFF" />
          <Text style={styles.streakText}>
            {streak} Day Streak! Keep it up!
          </Text>
          <Sparkles size={24} color="#FFD700" />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {hasCheckedInToday ? (
          <View style={styles.completedCard}>
            <View style={styles.completedIcon}>
              <Check size={40} color={theme.primary} />
            </View>
            <Text style={styles.completedTitle}>Check-in Complete!</Text>
            <Text style={styles.completedText}>
              You've checked in today. Come back tomorrow to continue your streak!
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Your Mood:</Text>
                <Text style={styles.summaryValue}>
                  {MOOD_OPTIONS.find((m) => m.value === moodRating)?.label}
                </Text>
              </View>
              {gratitudeText && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Gratitude:</Text>
                  <Text style={styles.summaryValue}>{gratitudeText}</Text>
                </View>
              )}
              {note && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Note:</Text>
                  <Text style={styles.summaryValue}>{note}</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How are you feeling?</Text>
              <View style={styles.moodGrid}>
                {MOOD_OPTIONS.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodButton,
                        moodRating === mood.value && styles.moodButtonActive,
                      ]}
                      onPress={() => setMoodRating(mood.value)}
                    >
                      <Icon size={32} color={mood.color} />
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gratitude</Text>
              <Text style={styles.prompt}>{prompt}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Share something you're grateful for..."
                placeholderTextColor={theme.textSecondary}
                value={gratitudeText}
                onChangeText={setGratitudeText}
                multiline
                maxLength={500}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Anything else you'd like to remember about today?"
                placeholderTextColor={theme.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={1000}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!moodRating || loading) && styles.submitButtonDisabled,
              ]}
              onPress={submitCheckIn}
              disabled={!moodRating || loading}
            >
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {loading ? 'Saving...' : 'Complete Check-in'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
