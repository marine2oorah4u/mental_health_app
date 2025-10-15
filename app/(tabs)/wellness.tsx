import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  Wind,
  Music,
  BookOpen,
  TrendingUp,
  Plus,
  X,
  Volume2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface MoodLog {
  id: string;
  mood: string;
  intensity: number;
  notes?: string;
  created_at: string;
}

const MOODS = [
  { name: 'happy', icon: Smile, color: '#4CAF50', label: 'Happy' },
  { name: 'calm', icon: Heart, color: '#2196F3', label: 'Calm' },
  { name: 'anxious', icon: Wind, color: '#FF9800', label: 'Anxious' },
  { name: 'sad', icon: Frown, color: '#9C27B0', label: 'Sad' },
  { name: 'neutral', icon: Meh, color: '#607D8B', label: 'Neutral' },
];

export default function WellnessScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [recentMoods, setRecentMoods] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecentMoods();
    }
  }, [user]);

  const loadRecentMoods = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);

    if (!error && data) {
      setRecentMoods(data);
    }
  };

  const saveMood = async () => {
    if (!selectedMood || !user) return;

    setLoading(true);
    const { error } = await supabase.from('mood_logs').insert({
      user_id: user.id,
      mood: selectedMood,
      intensity,
      notes: notes.trim() || null,
    });

    if (!error) {
      setMoodModalVisible(false);
      setSelectedMood(null);
      setIntensity(3);
      setNotes('');
      loadRecentMoods();
    }
    setLoading(false);
  };

  const getMoodIcon = (moodName: string) => {
    const mood = MOODS.find((m) => m.name === moodName);
    return mood || MOODS[4];
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
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 12,
    },
    moodGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    moodButton: {
      alignItems: 'center',
      padding: 12,
      borderRadius: 16,
      width: 65,
    },
    moodLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      marginTop: 8,
      fontWeight: '500',
    },
    toolCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    toolIcon: {
      marginRight: 16,
    },
    toolInfo: {
      flex: 1,
    },
    toolTitle: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    toolDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    moodHistory: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    moodHistoryItem: {
      alignItems: 'center',
      flex: 1,
      padding: 8,
    },
    moodHistoryDate: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      padding: 8,
    },
    intensityContainer: {
      marginTop: 20,
    },
    intensityLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginBottom: 12,
      fontWeight: '500',
    },
    intensityButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    intensityButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.border,
    },
    intensityButtonActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    intensityButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
    },
    intensityButtonTextActive: {
      color: '#FFFFFF',
    },
    notesInput: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 16,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: 20,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyStateText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
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
        <Text style={styles.headerTitle}>Wellness</Text>
        <Text style={styles.headerSubtitle}>Track your mood and practice self-care</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.moodGrid}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.name}
                  style={styles.moodButton}
                  onPress={() => {
                    setSelectedMood(mood.name);
                    setMoodModalVisible(true);
                  }}
                >
                  <mood.icon size={32} color={mood.color} />
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {recentMoods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Moods</Text>
            <View style={styles.card}>
              <View style={styles.moodHistory}>
                {recentMoods.slice(0, 5).map((log) => {
                  const mood = getMoodIcon(log.mood);
                  const Icon = mood.icon;
                  const date = new Date(log.created_at);
                  return (
                    <View key={log.id} style={styles.moodHistoryItem}>
                      <Icon size={28} color={mood.color} />
                      <Text style={styles.moodHistoryDate}>
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Tools</Text>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => router.push('/(tabs)/breathing')}
          >
            <Wind size={32} color={theme.primary} style={styles.toolIcon} />
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>Breathing Exercises</Text>
              <Text style={styles.toolDescription}>Calm your mind with guided breathing</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => router.push('/(tabs)/sounds')}
          >
            <Volume2 size={32} color={theme.secondary} style={styles.toolIcon} />
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>Calming Sounds</Text>
              <Text style={styles.toolDescription}>Relaxing audio for meditation</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => router.push('/(tabs)/journal')}
          >
            <BookOpen size={32} color={theme.accent} style={styles.toolIcon} />
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>Journal</Text>
              <Text style={styles.toolDescription}>Write about your thoughts and feelings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCard}>
            <TrendingUp size={32} color={theme.success} style={styles.toolIcon} />
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>Progress Tracker</Text>
              <Text style={styles.toolDescription}>View your wellness journey</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={moodModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoodModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMoodModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Your Mood</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setMoodModalVisible(false)}
                >
                  <X size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              {selectedMood && (
                <>
                  <View style={styles.intensityContainer}>
                    <Text style={styles.intensityLabel}>Intensity</Text>
                    <View style={styles.intensityButtons}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.intensityButton,
                            intensity === level && styles.intensityButtonActive,
                          ]}
                          onPress={() => setIntensity(level)}
                        >
                          <Text
                            style={[
                              styles.intensityButtonText,
                              intensity === level && styles.intensityButtonTextActive,
                            ]}
                          >
                            {level}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add notes (optional)..."
                    placeholderTextColor={theme.textSecondary}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    maxLength={500}
                  />

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveMood}
                    disabled={loading}
                  >
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Saving...' : 'Save Mood'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
