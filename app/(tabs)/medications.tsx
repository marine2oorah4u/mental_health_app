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
  Pill,
  Plus,
  Check,
  X,
  Clock,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes?: string;
  color: string;
  is_active: boolean;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  taken_at?: string;
  status: 'taken' | 'skipped' | 'missed';
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Once Daily', times: 1 },
  { value: 'twice_daily', label: 'Twice Daily', times: 2 },
  { value: 'three_times_daily', label: 'Three Times Daily', times: 3 },
  { value: 'as_needed', label: 'As Needed', times: 0 },
];

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#EF4444'];

export default function MedicationsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todaysLogs, setTodaysLogs] = useState<MedicationLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  // Form state
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (user) {
      loadMedications();
      loadTodaysLogs();
    }
  }, [user]);

  const loadMedications = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setMedications(data);
    }
  };

  const loadTodaysLogs = async () => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('scheduled_time', today)
      .lt('scheduled_time', `${today}T23:59:59`);

    if (data) {
      setTodaysLogs(data);
    }
  };

  const resetForm = () => {
    setMedName('');
    setDosage('');
    setFrequency('daily');
    setTimes(['08:00']);
    setNotes('');
    setColor(COLORS[0]);
    setEditingMed(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (med: Medication) => {
    setMedName(med.name);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setTimes(med.times);
    setNotes(med.notes || '');
    setColor(med.color);
    setEditingMed(med);
    setShowAddModal(true);
  };

  const saveMedication = async () => {
    if (!user?.id || !medName || !dosage) {
      Alert.alert('Error', 'Please fill in medication name and dosage');
      return;
    }

    const medData = {
      user_id: user.id,
      name: medName,
      dosage,
      frequency,
      times,
      notes,
      color,
      is_active: true,
    };

    if (editingMed) {
      const { error } = await supabase
        .from('medications')
        .update(medData)
        .eq('id', editingMed.id);

      if (!error) {
        setShowAddModal(false);
        loadMedications();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('medications').insert(medData);

      if (!error) {
        setShowAddModal(false);
        loadMedications();
        resetForm();
      }
    }
  };

  const deleteMedication = async (medId: string) => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('medications').delete().eq('id', medId);
          loadMedications();
        },
      },
    ]);
  };

  const logMedication = async (medId: string, time: string, status: 'taken' | 'skipped') => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    const scheduledTime = `${today}T${time}:00`;

    // Check if already logged
    const existing = todaysLogs.find(
      (log) => log.medication_id === medId && log.scheduled_time === scheduledTime
    );

    if (existing) {
      // Update existing log
      await supabase
        .from('medication_logs')
        .update({
          status,
          taken_at: status === 'taken' ? new Date().toISOString() : null,
        })
        .eq('id', existing.id);
    } else {
      // Create new log
      await supabase.from('medication_logs').insert({
        user_id: user.id,
        medication_id: medId,
        scheduled_time: scheduledTime,
        taken_at: status === 'taken' ? new Date().toISOString() : null,
        status,
      });
    }

    loadTodaysLogs();
  };

  const getMedicationStatus = (medId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const scheduledTime = `${today}T${time}:00`;

    const log = todaysLogs.find(
      (log) => log.medication_id === medId && log.scheduled_time === scheduledTime
    );

    return log?.status;
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
    disclaimer: {
      backgroundColor: '#FEF2F2',
      borderLeftWidth: 4,
      borderLeftColor: '#DC2626',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    disclaimerText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#DC2626',
      fontWeight: '600',
      lineHeight: getFontSize(fontSize, 'small') * 1.5,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    addButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    medCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
    },
    medHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    medInfo: {
      flex: 1,
    },
    medName: {
      fontSize: getFontSize(fontSize, 'large'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    medDosage: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
    },
    medActions: {
      flexDirection: 'row',
      gap: 8,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timesContainer: {
      marginTop: 12,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    timeText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      fontWeight: '600',
    },
    timeActions: {
      flexDirection: 'row',
      gap: 12,
    },
    checkButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#10B981',
      justifyContent: 'center',
      alignItems: 'center',
    },
    skipButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#6B7280',
      justifyContent: 'center',
      alignItems: 'center',
    },
    takenButton: {
      opacity: 0.5,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
    },
    emptyText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '90%',
    },
    modalTitle: {
      fontSize: getFontSize(fontSize, 'xlarge'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 24,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginBottom: 16,
    },
    label: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    frequencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    frequencyButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    frequencyButtonActive: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}15`,
    },
    frequencyText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
    },
    colorGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    colorButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorButtonActive: {
      borderColor: theme.text,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.surface,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.text,
    },
    saveButtonText: {
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
          <Pill size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Medications</Text>
            <Text style={styles.headerSubtitle}>Track your medication schedule</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This is a tracking tool only. Always consult your healthcare provider before starting,
            stopping, or changing medications.
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>

        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <Pill size={64} color={theme.textSecondary} />
            <Text style={styles.emptyText}>
              No medications added yet.{'\n'}Tap "Add Medication" to get started.
            </Text>
          </View>
        ) : (
          medications.map((med) => (
            <View key={med.id} style={[styles.medCard, { borderLeftColor: med.color }]}>
              <View style={styles.medHeader}>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medDosage}>{med.dosage}</Text>
                  {med.notes && (
                    <Text style={[styles.medDosage, { marginTop: 4 }]}>{med.notes}</Text>
                  )}
                </View>
                <View style={styles.medActions}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(med)}>
                    <Edit size={18} color={theme.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => deleteMedication(med.id)}
                  >
                    <Trash2 size={18} color={theme.error} />
                  </TouchableOpacity>
                </View>
              </View>

              {med.frequency !== 'as_needed' && (
                <View style={styles.timesContainer}>
                  {med.times.map((time, index) => {
                    const status = getMedicationStatus(med.id, time);
                    const isTaken = status === 'taken';
                    const isSkipped = status === 'skipped';

                    return (
                      <View key={index} style={styles.timeRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Clock size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
                          <Text style={styles.timeText}>{time}</Text>
                        </View>
                        <View style={styles.timeActions}>
                          <TouchableOpacity
                            style={[styles.checkButton, isTaken && styles.takenButton]}
                            onPress={() => logMedication(med.id, time, 'taken')}
                          >
                            {isTaken ? (
                              <CheckCircle size={20} color="#FFFFFF" fill="#FFFFFF" />
                            ) : (
                              <Circle size={20} color="#FFFFFF" />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.skipButton, isSkipped && styles.takenButton]}
                            onPress={() => logMedication(med.id, time, 'skipped')}
                          >
                            <X size={20} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {med.frequency === 'as_needed' && (
                <View style={styles.timesContainer}>
                  <TouchableOpacity
                    style={[styles.checkButton, { width: '100%', height: 48, borderRadius: 12 }]}
                    onPress={() => logMedication(med.id, new Date().toTimeString().slice(0, 5), 'taken')}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Mark as Taken</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMed ? 'Edit Medication' : 'Add Medication'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Medication Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sertraline"
                placeholderTextColor={theme.textSecondary}
                value={medName}
                onChangeText={setMedName}
              />

              <Text style={styles.label}>Dosage</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 50mg, 2 pills"
                placeholderTextColor={theme.textSecondary}
                value={dosage}
                onChangeText={setDosage}
              />

              <Text style={styles.label}>Frequency</Text>
              <View style={styles.frequencyGrid}>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.frequencyButton,
                      frequency === opt.value && styles.frequencyButtonActive,
                    ]}
                    onPress={() => {
                      setFrequency(opt.value);
                      if (opt.times > 0) {
                        const defaultTimes = ['08:00', '14:00', '20:00'].slice(0, opt.times);
                        setTimes(defaultTimes);
                      }
                    }}
                  >
                    <Text style={styles.frequencyText}>{opt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorButton,
                      { backgroundColor: c },
                      color === c && styles.colorButtonActive,
                    ]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>

              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="e.g., Take with food"
                placeholderTextColor={theme.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveMedication}
                >
                  <Text style={[styles.buttonText, styles.saveButtonText]}>
                    {editingMed ? 'Update' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
