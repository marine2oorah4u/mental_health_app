import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Trash2,
  Calendar,
  TrendingUp,
  X,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'habit' | 'milestone' | 'personal' | 'other';
  target_date: string | null;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  created_at: string;
  completed_at: string | null;
  progress_notes: Array<{ date: string; note: string }>;
}

interface GoalCheckIn {
  id: string;
  note: string;
  sentiment: 'positive' | 'neutral' | 'struggling';
  created_at: string;
}

const CATEGORY_COLORS = {
  wellness: '#10B981',
  habit: '#3B82F6',
  milestone: '#8B5CF6',
  personal: '#F59E0B',
  other: '#6B7280',
};

const CATEGORY_LABELS = {
  wellness: 'Wellness',
  habit: 'Habit',
  milestone: 'Milestone',
  personal: 'Personal',
  other: 'Other',
};

export default function GoalsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    target_date: '',
  });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user, filter]);

  const loadGoals = async () => {
    if (!user?.id) return;

    let query = supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filter === 'active') {
      query = query.eq('status', 'active');
    } else if (filter === 'completed') {
      query = query.eq('status', 'completed');
    }

    const { data, error } = await query;

    if (data) {
      setGoals(data);
    }
  };

  const addGoal = async () => {
    if (!user?.id || !newGoal.title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    const { error } = await supabase.from('user_goals').insert({
      user_id: user.id,
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      category: newGoal.category,
      target_date: newGoal.target_date || null,
      status: 'active',
    });

    if (!error) {
      setNewGoal({ title: '', description: '', category: 'personal', target_date: '' });
      setShowAddModal(false);
      loadGoals();
    }
  };

  const toggleGoalStatus = async (goalId: string, currentStatus: Goal['status']) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';

    await supabase
      .from('user_goals')
      .update({ status: newStatus })
      .eq('id', goalId);

    loadGoals();
  };

  const completeGoal = async (goalId: string) => {
    await supabase
      .from('user_goals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', goalId);

    loadGoals();
  };

  const deleteGoal = async (goalId: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('user_goals').delete().eq('id', goalId);
          loadGoals();
        },
      },
    ]);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProgress = (goal: Goal) => {
    if (goal.status === 'completed') return 100;
    if (!goal.target_date) return 0;

    const start = new Date(goal.created_at);
    const end = new Date(goal.target_date);
    const now = new Date();

    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const isDark = theme.text === '#FFFFFF';

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
      flex: 1,
      padding: 20,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 20,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    filterButtonActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    filterButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    goalCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    goalTitle: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      flex: 1,
      marginRight: 8,
    },
    categoryBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    categoryText: {
      fontSize: getFontSize(fontSize, 'xsmall'),
      fontWeight: '600',
      color: '#FFFFFF',
    },
    goalDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    goalMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    metaText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginLeft: 6,
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginBottom: 12,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: theme.border,
    },
    actionButtonText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
      marginLeft: 6,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 60,
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
    },
    input: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 14,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    label: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.border,
    },
    categoryChipActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    categoryChipText: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      color: theme.text,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
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
          <Target size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>My Goals</Text>
            <Text style={styles.headerSubtitle}>Track and achieve your dreams</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={styles.filterButtonText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </TouchableOpacity>
        </View>

        {goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Target size={60} color={theme.textSecondary} />
            <Text style={styles.emptyText}>No goals yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to set your first goal
            </Text>
          </View>
        ) : (
          goals.map((goal) => (
            <Animated.View key={goal.id} entering={FadeIn}>
              <View
                style={[
                  styles.goalCard,
                  { borderLeftColor: CATEGORY_COLORS[goal.category] },
                ]}
              >
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: CATEGORY_COLORS[goal.category] },
                    ]}
                  >
                    <Text style={styles.categoryText}>
                      {CATEGORY_LABELS[goal.category]}
                    </Text>
                  </View>
                </View>

                {goal.description && (
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                )}

                <View style={styles.goalMeta}>
                  <Calendar size={14} color={theme.textSecondary} />
                  <Text style={styles.metaText}>{formatDate(goal.target_date)}</Text>
                </View>

                {goal.target_date && goal.status !== 'completed' && (
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgress(goal)}%`,
                          backgroundColor: CATEGORY_COLORS[goal.category],
                        },
                      ]}
                    />
                  </View>
                )}

                <View style={styles.actionButtons}>
                  {goal.status === 'completed' ? (
                    <View style={[styles.actionButton, { backgroundColor: '#10B981' }]}>
                      <CheckCircle2 size={16} color="#FFFFFF" />
                      <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                        Completed
                      </Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => toggleGoalStatus(goal.id, goal.status)}
                      >
                        {goal.status === 'paused' ? (
                          <Play size={16} color={theme.text} />
                        ) : (
                          <Pause size={16} color={theme.text} />
                        )}
                        <Text style={styles.actionButtonText}>
                          {goal.status === 'paused' ? 'Resume' : 'Pause'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                        onPress={() => completeGoal(goal.id)}
                      >
                        <CheckCircle2 size={16} color="#FFFFFF" />
                        <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                          Complete
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#DC2626' }]}
                        onPress={() => deleteGoal(goal.id)}
                      >
                        <Trash2 size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Plus size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Goal</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What do you want to achieve?"
                placeholderTextColor={theme.textSecondary}
                value={newGoal.title}
                onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your goal..."
                placeholderTextColor={theme.textSecondary}
                value={newGoal.description}
                onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
                multiline
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {(Object.keys(CATEGORY_LABELS) as Goal['category'][]).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      newGoal.category === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, category: cat })}
                  >
                    <Text style={styles.categoryChipText}>{CATEGORY_LABELS[cat]}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Target Date (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textSecondary}
                value={newGoal.target_date}
                onChangeText={(text) => setNewGoal({ ...newGoal, target_date: text })}
              />

              <TouchableOpacity style={styles.submitButton} onPress={addGoal}>
                <Text style={styles.submitButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
