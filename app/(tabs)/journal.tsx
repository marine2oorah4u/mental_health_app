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
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, BookOpen, Trash2, Edit, X, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  entry_type: string;
  created_at: string;
}

const JOURNAL_PROMPTS = [
  "What are three things you're grateful for today?",
  "Describe a challenge you faced recently and how you overcame it.",
  "What would you tell your younger self?",
  "Write about a moment that made you smile today.",
  "What are your goals for this week?",
  "How are you taking care of yourself today?",
  "What emotions did you experience today and why?",
  "Describe someone who positively impacts your life.",
  "What's something you've learned about yourself recently?",
  "If today had a theme song, what would it be and why?",
];

export default function JournalScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    if (user) {
      loadEntries();
    }
    setCurrentPrompt(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const openNewEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setModalVisible(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title || '');
    setContent(entry.content);
    setModalVisible(true);
  };

  const saveEntry = async () => {
    if (!content.trim() || !user) return;

    setLoading(true);

    if (editingEntry) {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title: title.trim() || null,
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingEntry.id);

      if (!error) {
        setModalVisible(false);
        loadEntries();
      }
    } else {
      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        title: title.trim() || null,
        content: content.trim(),
        entry_type: 'free_write',
      });

      if (!error) {
        setModalVisible(false);
        setTitle('');
        setContent('');
        loadEntries();
      }
    }

    setLoading(false);
  };

  const deleteEntry = (entry: JournalEntry) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('journal_entries').delete().eq('id', entry.id);
          loadEntries();
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
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
    promptCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    promptLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 8,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    promptText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      lineHeight: getFontSize(fontSize, 'body') * 1.6,
      fontStyle: 'italic',
    },
    newEntryButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    newEntryButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      marginLeft: 8,
    },
    entryCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    entryTitle: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    entryDate: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
    },
    entryContent: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      lineHeight: getFontSize(fontSize, 'body') * 1.5,
      marginBottom: 12,
    },
    entryActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.background,
    },
    actionButtonText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      marginLeft: 6,
      fontWeight: '500',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '90%',
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
    input: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    contentInput: {
      minHeight: 200,
      textAlignVertical: 'top',
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
      marginTop: 8,
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
    saveButtonDisabled: {
      opacity: 0.5,
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
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSubtitle}>Write about your thoughts and feelings</Text>
        </LinearGradient>
        <View style={styles.emptyState}>
          <BookOpen size={64} color={theme.textSecondary} style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateText}>Please sign in to use the journal</Text>
        </View>
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
        <Text style={styles.headerTitle}>Journal</Text>
        <Text style={styles.headerSubtitle}>Write about your thoughts and feelings</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>Today's Prompt</Text>
          <Text style={styles.promptText}>{currentPrompt}</Text>
        </View>

        <TouchableOpacity style={styles.newEntryButton} onPress={openNewEntry}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.newEntryButtonText}>New Entry</Text>
        </TouchableOpacity>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Sparkles size={64} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>
              Start journaling to track your thoughts and feelings
            </Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={{ flex: 1 }}>
                  {entry.title && <Text style={styles.entryTitle}>{entry.title}</Text>}
                  <Text style={styles.entryDate}>{formatDate(entry.created_at)}</Text>
                </View>
              </View>
              <Text style={styles.entryContent} numberOfLines={3}>
                {entry.content}
              </Text>
              <View style={styles.entryActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditEntry(entry)}
                >
                  <Edit size={16} color={theme.text} />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteEntry(entry)}
                >
                  <Trash2 size={16} color={theme.error} />
                  <Text style={[styles.actionButtonText, { color: theme.error }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEntry ? 'Edit Entry' : 'New Entry'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Title (optional)"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Write your thoughts..."
              placeholderTextColor={theme.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={5000}
            />

            <TouchableOpacity
              style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
              onPress={saveEntry}
              disabled={!content.trim() || loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
