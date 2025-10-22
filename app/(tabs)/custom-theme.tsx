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
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Palette, Save, RefreshCw, Eye, Sparkles } from 'lucide-react-native';
import SimpleColorPicker from '@/components/SimpleColorPicker';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface CustomTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

const PRESET_THEMES = [
  {
    name: 'Ocean Breeze',
    colors: {
      primary: '#0077BE',
      secondary: '#00A8E8',
      accent: '#48CAE4',
      background: '#F0F8FF',
      surface: '#FFFFFF',
      text: '#1A1A1A',
    },
  },
  {
    name: 'Forest Calm',
    colors: {
      primary: '#2D6A4F',
      secondary: '#40916C',
      accent: '#52B788',
      background: '#F1F8F4',
      surface: '#FFFFFF',
      text: '#1B4332',
    },
  },
  {
    name: 'Sunset Glow',
    colors: {
      primary: '#E76F51',
      secondary: '#F4A261',
      accent: '#E9C46A',
      background: '#FFF8F3',
      surface: '#FFFFFF',
      text: '#2A2A2A',
    },
  },
  {
    name: 'Lavender Dream',
    colors: {
      primary: '#7209B7',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#1A1A1A',
    },
  },
  {
    name: 'Midnight Sky',
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
    },
  },
  {
    name: 'Cherry Blossom',
    colors: {
      primary: '#DB2777',
      secondary: '#EC4899',
      accent: '#F9A8D4',
      background: '#FFF1F2',
      surface: '#FFFFFF',
      text: '#1F1F1F',
    },
  },
];

export default function CustomThemeScreen() {
  const { theme, customTheme, applyCustomTheme } = useTheme();
  const { user } = useAuth();
  const [themeName, setThemeName] = useState('My Custom Theme');
  const [customColors, setCustomColors] = useState<CustomTheme>(
    customTheme || {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      background: theme.background,
      surface: theme.surface,
      text: theme.text,
    }
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, [user]);

  const loadSavedTheme = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('custom_theme')
      .eq('id', user.id)
      .maybeSingle();

    if (data?.custom_theme) {
      setCustomColors(data.custom_theme);
    }
  };

  const updateColor = (key: keyof CustomTheme, color: string) => {
    setCustomColors((prev) => ({ ...prev, [key]: color }));
  };

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setCustomColors(preset.colors);
    setThemeName(preset.name);
  };

  const saveTheme = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be signed in to save themes');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ custom_theme: customColors })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Error', 'Failed to save theme');
      return;
    }

    applyCustomTheme(customColors);
    Alert.alert('Success', 'Theme saved and applied!');
  };

  const resetToDefault = () => {
    setCustomColors({
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#1F2937',
    });
    setThemeName('My Custom Theme');
  };

  const previewTheme = previewMode ? customColors : theme;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: previewTheme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[previewTheme.primary, previewTheme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Palette size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Custom Theme</Text>
        <Text style={styles.headerSubtitle}>Create your perfect color palette</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={[styles.card, { backgroundColor: previewTheme.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: previewTheme.text }]}>
            Theme Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: previewTheme.background,
                color: previewTheme.text,
                borderColor: previewTheme.primary,
              },
            ]}
            value={themeName}
            onChangeText={setThemeName}
            placeholder="Enter theme name"
            placeholderTextColor={previewTheme.text + '80'}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(200)}
          style={[styles.card, { backgroundColor: previewTheme.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: previewTheme.text }]}>
            Color Palette
          </Text>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Primary Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.primary}
              onSelectColor={(color) => updateColor('primary', color)}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Secondary Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.secondary}
              onSelectColor={(color) => updateColor('secondary', color)}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Accent Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.accent}
              onSelectColor={(color) => updateColor('accent', color)}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Background Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.background}
              onSelectColor={(color) => updateColor('background', color)}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Surface Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.surface}
              onSelectColor={(color) => updateColor('surface', color)}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={[styles.colorLabel, { color: previewTheme.text }]}>
              Text Color
            </Text>
            <SimpleColorPicker
              selectedColor={customColors.text}
              onSelectColor={(color) => updateColor('text', color)}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={[styles.card, { backgroundColor: previewTheme.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: previewTheme.text }]}>
            Preset Themes
          </Text>
          <View style={styles.presetGrid}>
            {PRESET_THEMES.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetCard}
                onPress={() => applyPreset(preset)}
              >
                <LinearGradient
                  colors={[preset.colors.primary, preset.colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.presetGradient}
                >
                  <Sparkles size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.presetName, { color: previewTheme.text }]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={styles.actionButtons}
        >
          <TouchableOpacity
            style={[
              styles.button,
              styles.previewButton,
              {
                backgroundColor: previewMode
                  ? previewTheme.accent
                  : previewTheme.primary,
              },
            ]}
            onPress={() => setPreviewMode(!previewMode)}
          >
            <Eye size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {previewMode ? 'Stop Preview' : 'Preview'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: previewTheme.secondary }]}
            onPress={resetToDefault}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: previewTheme.accent },
            ]}
            onPress={saveTheme}
            disabled={saving}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>
              {saving ? 'Saving...' : 'Save & Apply'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 32,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetCard: {
    width: '47%',
    alignItems: 'center',
  },
  presetGradient: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  previewButton: {
    opacity: 1,
  },
  saveButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
