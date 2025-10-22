import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Check } from 'lucide-react-native';
import {
  BotanicalPattern,
  GeometricPattern,
  WavyPattern,
  DotsPattern,
  BlobsPattern,
  ConfettiPattern
} from '@/components/BackgroundPatterns';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface PatternOption {
  id: string;
  name: string;
  description: string;
  component: any;
}

const PATTERNS: PatternOption[] = [
  {
    id: 'botanical',
    name: 'Botanical',
    description: 'Floating leaves and organic shapes',
    component: BotanicalPattern,
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Clean lines and minimal shapes',
    component: GeometricPattern,
  },
  {
    id: 'wavy',
    name: 'Wavy',
    description: 'Flowing organic waves',
    component: WavyPattern,
  },
  {
    id: 'dots',
    name: 'Dots Grid',
    description: 'Subtle dot pattern',
    component: DotsPattern,
  },
  {
    id: 'blobs',
    name: 'Abstract Blobs',
    description: 'Soft organic shapes',
    component: BlobsPattern,
  },
  {
    id: 'confetti',
    name: 'Confetti',
    description: 'Playful scattered shapes',
    component: ConfettiPattern,
  },
];

export default function BackgroundSettingsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedPattern, setSelectedPattern] = useState('botanical');
  const [currentPattern, setCurrentPattern] = useState('botanical');
  const [saving, setSaving] = useState(false);

  const isDark = theme.text === '#FFFFFF';

  useEffect(() => {
    loadPreference();
  }, [user]);

  const loadPreference = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('background_pattern')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.background_pattern) {
      setSelectedPattern(data.background_pattern);
      setCurrentPattern(data.background_pattern);
    }
  };

  const applyPattern = async () => {
    if (!user) return;

    setSaving(true);

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_preferences')
        .update({ background_pattern: selectedPattern })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_preferences')
        .insert({ user_id: user.id, background_pattern: selectedPattern });
    }

    setCurrentPattern(selectedPattern);
    setSaving(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Background Patterns</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Choose a background style for your home screen
          </Text>
        </View>

        <View style={styles.grid}>
          {PATTERNS.map((pattern) => {
            const PatternComponent = pattern.component;
            const isSelected = selectedPattern === pattern.id;

            return (
              <TouchableOpacity
                key={pattern.id}
                style={[
                  styles.patternCard,
                  {
                    backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
                    borderColor: isSelected ? theme.primary : 'transparent',
                    borderWidth: isSelected ? 3 : 0,
                  },
                ]}
                onPress={() => setSelectedPattern(pattern.id)}
              >
                <View style={styles.previewContainer}>
                  <View style={[styles.preview, { backgroundColor: theme.background }]}>
                    <PatternComponent isDark={isDark} />
                  </View>
                </View>

                <View style={styles.patternInfo}>
                  <View style={styles.patternHeader}>
                    <Text style={[styles.patternName, { color: theme.text }]}>
                      {pattern.name}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                        <Check size={16} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.patternDescription, { color: theme.textSecondary }]}>
                    {pattern.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedPattern !== currentPattern && (
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={applyPattern}
            disabled={saving}
          >
            <Text style={styles.applyButtonText}>
              {saving ? 'Applying...' : 'Apply Pattern'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  patternCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewContainer: {
    width: '100%',
    height: 140,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  patternInfo: {
    padding: 12,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  applyButton: {
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
