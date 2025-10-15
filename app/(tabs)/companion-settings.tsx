import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Sparkles, Check } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

interface UserPreferences {
  companion_personality: 'supportive' | 'energetic' | 'calm' | 'balanced';
  response_length: 'brief' | 'moderate' | 'detailed';
  conversation_style: 'casual' | 'professional' | 'friendly';
  use_name_frequency: 'rarely' | 'sometimes' | 'often';
}

const personalityOptions = [
  { value: 'supportive', label: 'Supportive', description: 'Empathetic and reassuring' },
  { value: 'energetic', label: 'Energetic', description: 'Upbeat and motivating' },
  { value: 'calm', label: 'Calm', description: 'Peaceful and grounding' },
  { value: 'balanced', label: 'Balanced', description: 'Mix of all styles' },
];

const responseLengthOptions = [
  { value: 'brief', label: 'Brief', description: '1-2 sentences' },
  { value: 'moderate', label: 'Moderate', description: '2-4 sentences' },
  { value: 'detailed', label: 'Detailed', description: '4-6 sentences' },
];

const conversationStyleOptions = [
  { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
  { value: 'professional', label: 'Professional', description: 'Polished and thoughtful' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and personable' },
];

const nameFrequencyOptions = [
  { value: 'rarely', label: 'Rarely', description: 'Only when appropriate' },
  { value: 'sometimes', label: 'Sometimes', description: 'Occasionally' },
  { value: 'often', label: 'Often', description: 'Frequently' },
];

export default function CompanionSettingsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences>({
    companion_personality: 'balanced',
    response_length: 'moderate',
    conversation_style: 'friendly',
    use_name_frequency: 'sometimes',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setPreferences({
        companion_personality: data.companion_personality,
        response_length: data.response_length,
        conversation_style: data.conversation_style,
        use_name_frequency: data.use_name_frequency,
      });
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
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
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    optionCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionCardSelected: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    optionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    optionLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    optionDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginTop: 4,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 24,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 32,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '700',
      color: '#FFFFFF',
    },
    savedIndicator: {
      backgroundColor: '#10B981',
    },
    savedText: {
      color: '#FFFFFF',
    },
    infoBox: {
      backgroundColor: `${theme.primary}15`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    infoText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: getFontSize(fontSize, 'small') * 1.5,
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
          <Settings size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Customize Buddy</Text>
            <Text style={styles.headerSubtitle}>Personalize your companion</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            These settings will shape how Buddy interacts with you. Changes take effect in your
            next conversation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality</Text>
          {personalityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                preferences.companion_personality === option.value &&
                  styles.optionCardSelected,
              ]}
              onPress={() => updatePreference('companion_personality', option.value as any)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {preferences.companion_personality === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Length</Text>
          {responseLengthOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                preferences.response_length === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updatePreference('response_length', option.value as any)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {preferences.response_length === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation Style</Text>
          {conversationStyleOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                preferences.conversation_style === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updatePreference('conversation_style', option.value as any)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {preferences.conversation_style === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Name Usage</Text>
          {nameFrequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                preferences.use_name_frequency === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updatePreference('use_name_frequency', option.value as any)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {preferences.use_name_frequency === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
            saved && styles.savedIndicator,
          ]}
          onPress={savePreferences}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, saved && styles.savedText]}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
