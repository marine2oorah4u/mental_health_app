import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trash2, Brain, Heart, Target, AlertCircle, Award, Sparkles } from 'lucide-react-native';
import { getAllMemories, deleteMemory } from '@/lib/companionAI';

interface Memory {
  id: string;
  memory_type: string;
  key: string;
  value: string;
  context?: string;
  importance: number;
  created_at: string;
}

const MEMORY_TYPE_INFO = {
  fact: { icon: Brain, color: '#3B82F6', label: 'Personal Fact' },
  preference: { icon: Heart, color: '#EC4899', label: 'Preference' },
  goal: { icon: Target, color: '#10B981', label: 'Goal' },
  concern: { icon: AlertCircle, color: '#F59E0B', label: 'Concern' },
  achievement: { icon: Award, color: '#8B5CF6', label: 'Achievement' },
  interest: { icon: Sparkles, color: '#06B6D4', label: 'Interest' },
};

export default function CompanionMemoriesScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    if (!user) return;

    setLoading(true);
    const data = await getAllMemories(user.id);
    setMemories(data);
    setLoading(false);
  };

  const handleDelete = (memory: Memory) => {
    Alert.alert(
      'Delete Memory',
      `Are you sure you want to delete "${memory.value}"? Buddy will forget this information.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            const success = await deleteMemory(user.id, memory.id);
            if (success) {
              setMemories((prev) => prev.filter((m) => m.id !== memory.id));
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    memoryCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    memoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    memoryTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    memoryTypeLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      marginLeft: 8,
    },
    deleteButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: `${theme.error}20`,
    },
    memoryValue: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
      marginBottom: 8,
    },
    memoryKey: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 4,
    },
    memoryMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    memoryDate: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    importanceContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    importanceDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
  });

  const MemoryTypeIcon = ({ type }: { type: string }) => {
    const typeInfo = MEMORY_TYPE_INFO[type as keyof typeof MEMORY_TYPE_INFO] || MEMORY_TYPE_INFO.fact;
    const Icon = typeInfo.icon;
    return <Icon size={18} color={typeInfo.color} />;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Buddy's Memories</Text>
          <Text style={styles.headerSubtitle}>
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} saved
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.emptyState}>
            <Brain size={64} color={theme.textSecondary} />
            <Text style={styles.emptyText}>Loading memories...</Text>
          </View>
        ) : memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Brain size={64} color={theme.textSecondary} />
            <Text style={styles.emptyText}>
              No memories yet.{'\n'}Chat with Buddy to help me learn about you!
            </Text>
          </View>
        ) : (
          memories.map((memory) => {
            const typeInfo = MEMORY_TYPE_INFO[memory.memory_type as keyof typeof MEMORY_TYPE_INFO] || MEMORY_TYPE_INFO.fact;
            return (
              <View key={memory.id} style={styles.memoryCard}>
                <View style={styles.memoryHeader}>
                  <View style={styles.memoryTypeContainer}>
                    <MemoryTypeIcon type={memory.memory_type} />
                    <Text style={[styles.memoryTypeLabel, { color: typeInfo.color }]}>
                      {typeInfo.label}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(memory)}
                  >
                    <Trash2 size={16} color={theme.error} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.memoryValue}>{memory.value}</Text>
                <Text style={styles.memoryKey}>{memory.key.replace(/_/g, ' ')}</Text>

                <View style={styles.memoryMeta}>
                  <Text style={styles.memoryDate}>{formatDate(memory.created_at)}</Text>
                  <View style={styles.importanceContainer}>
                    {Array.from({ length: memory.importance }).map((_, i) => (
                      <View
                        key={i}
                        style={[styles.importanceDot, { backgroundColor: typeInfo.color }]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
