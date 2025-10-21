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
import {
  Home,
  Check,
  TreePine,
  Building2,
  Palmtree,
  Mountain,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import SimpleColorPicker from '@/components/SimpleColorPicker';

interface CompanionEnvironment {
  theme: string;
  style: string;
  floor_color: string;
  wall_color: string;
  ceiling_color: string;
  lighting_type: string;
  ambient_light_color: string;
  time_of_day: string;
  weather_effect: string;
  ambient_sound: string;
  ambient_volume: number;
}

const themeOptions = [
  {
    value: 'cozy',
    label: 'Cozy Room',
    description: 'Warm, comfortable indoor space',
    icon: Home,
    gradient: ['#FFC9A3', '#FFE5D9'] as [string, string],
  },
  {
    value: 'garden',
    label: 'Peaceful Garden',
    description: 'Serene outdoor garden',
    icon: TreePine,
    gradient: ['#A7F3D0', '#D1FAE5'] as [string, string],
  },
  {
    value: 'office',
    label: 'Modern Office',
    description: 'Clean, professional workspace',
    icon: Building2,
    gradient: ['#DBEAFE', '#EFF6FF'] as [string, string],
  },
  {
    value: 'beach',
    label: 'Beach Paradise',
    description: 'Relaxing beach scene',
    icon: Palmtree,
    gradient: ['#A5F3FC', '#FDE68A'] as [string, string],
  },
  {
    value: 'mountain',
    label: 'Mountain Retreat',
    description: 'Peaceful mountain view',
    icon: Mountain,
    gradient: ['#C7D2FE', '#E0E7FF'] as [string, string],
  },
  {
    value: 'space',
    label: 'Starry Space',
    description: 'Cosmic star field',
    icon: Sparkles,
    gradient: ['#4C1D95', '#1E1B4B'] as [string, string],
  },
];

const styleOptions = [
  {
    value: 'stylized',
    label: 'Stylized',
    description: 'Artistic, illustrated look',
  },
  {
    value: 'realistic',
    label: 'Realistic',
    description: 'Photo-realistic rendering',
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Clean, simple design',
  },
  {
    value: 'fantasy',
    label: 'Fantasy',
    description: 'Magical, dreamy aesthetic',
  },
];

const timeOfDayOptions = [
  { value: 'dawn', label: 'Dawn', icon: Sun },
  { value: 'day', label: 'Day', icon: Sun },
  { value: 'dusk', label: 'Dusk', icon: Sun },
  { value: 'night', label: 'Night', icon: Moon },
  { value: 'auto', label: 'Auto', icon: Cloud },
];

const weatherOptions = [
  { value: 'clear', label: 'Clear', icon: Sun },
  { value: 'clouds', label: 'Cloudy', icon: Cloud },
  { value: 'rain', label: 'Rain', icon: CloudRain },
  { value: 'snow', label: 'Snow', icon: Snowflake },
  { value: 'fog', label: 'Fog', icon: Cloud },
  { value: 'stars', label: 'Starry', icon: Sparkles },
];

export default function CompanionEnvironmentScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [environment, setEnvironment] = useState<CompanionEnvironment>({
    theme: 'cozy',
    style: 'stylized',
    floor_color: '#E5E7EB',
    wall_color: '#F3F4F6',
    ceiling_color: '#FFFFFF',
    lighting_type: 'soft',
    ambient_light_color: '#FFFFFF',
    time_of_day: 'day',
    weather_effect: 'clear',
    ambient_sound: 'none',
    ambient_volume: 0.3,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showWallPicker, setShowWallPicker] = useState(false);

  useEffect(() => {
    loadEnvironment();
  }, []);

  const loadEnvironment = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('companion_environments')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setEnvironment({
        theme: data.theme,
        style: data.style,
        floor_color: data.floor_color,
        wall_color: data.wall_color,
        ceiling_color: data.ceiling_color,
        lighting_type: data.lighting_type,
        ambient_light_color: data.ambient_light_color,
        time_of_day: data.time_of_day,
        weather_effect: data.weather_effect,
        ambient_sound: data.ambient_sound,
        ambient_volume: data.ambient_volume,
      });
    }
  };

  const saveEnvironment = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('companion_environments')
      .upsert({
        user_id: user.id,
        ...environment,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const updateEnvironment = <K extends keyof CompanionEnvironment>(
    key: K,
    value: CompanionEnvironment[K]
  ) => {
    setEnvironment((prev) => ({ ...prev, [key]: value }));
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
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    themeCard: {
      width: '48%',
      margin: '1%',
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    themeCardSelected: {
      borderColor: theme.primary,
    },
    themeGradient: {
      padding: 16,
      alignItems: 'center',
      minHeight: 120,
    },
    themeLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#1F2937',
      marginTop: 8,
      textAlign: 'center',
    },
    themeDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: '#4B5563',
      marginTop: 4,
      textAlign: 'center',
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
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    iconOption: {
      width: '30%',
      margin: '1.5%',
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    iconOptionSelected: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    iconOptionLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      marginTop: 8,
      fontWeight: '600',
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
          <Home size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Customize Environment</Text>
            <Text style={styles.headerSubtitle}>Design your perfect space</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Create the perfect environment for chatting with Buddy. Choose themes, styles, and
            atmospheric effects!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environment Theme</Text>
          <View style={styles.themeGrid}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeCard,
                  environment.theme === option.value && styles.themeCardSelected,
                ]}
                onPress={() => updateEnvironment('theme', option.value)}
              >
                <LinearGradient
                  colors={option.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.themeGradient}
                >
                  <option.icon size={32} color="#1F2937" />
                  <Text style={styles.themeLabel}>{option.label}</Text>
                  <Text style={styles.themeDescription}>{option.description}</Text>
                  {environment.theme === option.value && (
                    <View style={{ position: 'absolute', top: 8, right: 8 }}>
                      <Check size={20} color={theme.primary} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Style</Text>
          {styleOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                environment.style === option.value && styles.optionCardSelected,
              ]}
              onPress={() => updateEnvironment('style', option.value)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {environment.style === option.value && (
                  <Check size={20} color={theme.primary} />
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time of Day</Text>
          <View style={styles.iconGrid}>
            {timeOfDayOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.iconOption,
                  environment.time_of_day === option.value && styles.iconOptionSelected,
                ]}
                onPress={() => updateEnvironment('time_of_day', option.value)}
              >
                <option.icon
                  size={24}
                  color={
                    environment.time_of_day === option.value ? theme.primary : theme.textSecondary
                  }
                />
                <Text style={styles.iconOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Effects</Text>
          <View style={styles.iconGrid}>
            {weatherOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.iconOption,
                  environment.weather_effect === option.value && styles.iconOptionSelected,
                ]}
                onPress={() => updateEnvironment('weather_effect', option.value)}
              >
                <option.icon
                  size={24}
                  color={
                    environment.weather_effect === option.value
                      ? theme.primary
                      : theme.textSecondary
                  }
                />
                <Text style={styles.iconOptionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity
            style={styles.colorRow}
            onPress={() => {
              if (environment.ambient_sound === 'none') {
                updateEnvironment('ambient_sound', 'enabled');
              } else {
                updateEnvironment('ambient_sound', 'none');
              }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {environment.ambient_sound === 'none' ? (
                <VolumeX size={24} color={theme.textSecondary} style={{ marginRight: 12 }} />
              ) : (
                <Volume2 size={24} color={theme.primary} style={{ marginRight: 12 }} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.colorLabel}>
                  {environment.ambient_sound === 'none' ? 'Disabled' : 'Enabled'}
                </Text>
                <Text style={[styles.optionDescription, { marginTop: 4 }]}>
                  Play environment sounds in chat
                </Text>
              </View>
            </View>
            <Check
              size={20}
              color={environment.ambient_sound !== 'none' ? theme.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Colors</Text>
          <TouchableOpacity
            style={styles.colorRow}
            onPress={() => setShowWallPicker(!showWallPicker)}
          >
            <Text style={styles.colorLabel}>Wall Color</Text>
            <View style={[styles.colorPreview, { backgroundColor: environment.wall_color }]} />
          </TouchableOpacity>
          {showWallPicker && (
            <SimpleColorPicker
              selectedColor={environment.wall_color}
              onSelectColor={(color: string) => {
                updateEnvironment('wall_color', color);
                setShowWallPicker(false);
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
          onPress={saveEnvironment}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Environment'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
