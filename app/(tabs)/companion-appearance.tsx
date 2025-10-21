import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Check, Sparkles } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import SimpleColorPicker from '@/components/SimpleColorPicker';
import AnimalCompanion from '@/components/AnimalCompanion';

interface CompanionAppearance {
  companion_type: 'animal';
  species: 'cat' | 'dog' | 'bird' | 'bunny';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  size: 'small' | 'medium' | 'large';
  animation_speed: number;
}

const animalSpecies = [
  {
    value: 'cat' as const,
    label: 'Cat',
    description: 'Curious and playful',
    icon: '🐱',
  },
  {
    value: 'dog' as const,
    label: 'Dog',
    description: 'Loyal and energetic',
    icon: '🐶',
  },
  {
    value: 'bird' as const,
    label: 'Bird',
    description: 'Free-spirited and cheerful',
    icon: '🐦',
  },
  {
    value: 'bunny' as const,
    label: 'Bunny',
    description: 'Gentle and calm',
    icon: '🐰',
  },
];

const sizeOptions = [
  { value: 'small' as const, label: 'Small', size: 80 },
  { value: 'medium' as const, label: 'Medium', size: 120 },
  { value: 'large' as const, label: 'Large', size: 160 },
];

export default function CompanionAppearanceScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [appearance, setAppearance] = useState<CompanionAppearance>({
    companion_type: 'animal',
    species: 'cat',
    primary_color: theme.primary,
    secondary_color: theme.secondary,
    accent_color: theme.accent,
    size: 'medium',
    animation_speed: 1.0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [testEmotion, setTestEmotion] = useState<'idle' | 'happy' | 'celebrating'>('idle');

  useEffect(() => {
    loadAppearance();
  }, []);

  const loadAppearance = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('companion_appearance')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setAppearance({
        companion_type: data.companion_type,
        species: data.species,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        accent_color: data.accent_color,
        size: data.size,
        animation_speed: data.animation_speed,
      });
    }
  };

  const saveAppearance = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('companion_appearance')
      .upsert({
        user_id: user.id,
        ...appearance,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const updateAppearance = <K extends keyof CompanionAppearance>(
    key: K,
    value: CompanionAppearance[K]
  ) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
  };

  const testAnimation = (emotion: 'idle' | 'happy' | 'celebrating') => {
    setTestEmotion(emotion);
    setTimeout(() => setTestEmotion('idle'), 3000);
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
    previewSection: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 32,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    previewTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 20,
    },
    testButtonsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    testButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: `${theme.primary}20`,
    },
    testButtonText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '600',
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
    optionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    optionEmoji: {
      fontSize: 24,
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
      marginLeft: 36,
    },
    colorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    colorLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
    },
    colorPreview: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: theme.border,
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
          <Palette size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Customize Companion</Text>
            <Text style={styles.headerSubtitle}>Design your perfect buddy</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Customize how Buddy looks and moves. Tap the companion in the preview to see
            different animations!
          </Text>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          <AnimalCompanion
            animalType={appearance.species}
            emotion={testEmotion === 'celebrating' ? 'excited' : testEmotion}
            size={sizeOptions.find((s) => s.value === appearance.size)?.size || 120}
            onPress={() => testAnimation('happy')}
          />
          <View style={styles.testButtonsRow}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => testAnimation('happy')}
            >
              <Text style={styles.testButtonText}>Happy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => testAnimation('celebrating')}
            >
              <Text style={styles.testButtonText}>Excited</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Animal</Text>
          {animalSpecies.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                appearance.species === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updateAppearance('species', option.value)}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionLabelRow}>
                  <Text style={styles.optionEmoji}>{option.icon}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                {appearance.species === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          {sizeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                appearance.size === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updateAppearance('size', option.value)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {appearance.size === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colors</Text>

          <TouchableOpacity
            style={styles.colorRow}
            onPress={() => setShowPrimaryPicker(!showPrimaryPicker)}
          >
            <Text style={styles.colorLabel}>Primary Color</Text>
            <View
              style={[styles.colorPreview, { backgroundColor: appearance.primary_color }]}
            />
          </TouchableOpacity>
          {showPrimaryPicker && (
            <SimpleColorPicker
              selectedColor={appearance.primary_color}
              onSelectColor={(color: string) => {
                updateAppearance('primary_color', color);
                setShowPrimaryPicker(false);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.colorRow}
            onPress={() => setShowSecondaryPicker(!showSecondaryPicker)}
          >
            <Text style={styles.colorLabel}>Secondary Color</Text>
            <View
              style={[styles.colorPreview, { backgroundColor: appearance.secondary_color }]}
            />
          </TouchableOpacity>
          {showSecondaryPicker && (
            <SimpleColorPicker
              selectedColor={appearance.secondary_color}
              onSelectColor={(color: string) => {
                updateAppearance('secondary_color', color);
                setShowSecondaryPicker(false);
              }}
            />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
            saved && styles.savedIndicator,
          ]}
          onPress={saveAppearance}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Appearance'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
