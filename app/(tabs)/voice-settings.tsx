import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Volume2, Check, Play } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { voiceHelper, VoiceSettings, defaultVoiceSettings } from '@/lib/voiceHelper';
import Slider from '@react-native-community/slider';

export default function VoiceSettingsScreen() {
  const { theme, fontSize } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<VoiceSettings>(defaultVoiceSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    loadSettings();
    loadAvailableVoices();
  }, []);

  const loadSettings = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('voice_settings')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data?.voice_settings) {
      setSettings(data.voice_settings);
    }
  };

  const loadAvailableVoices = async () => {
    if (voiceHelper.isAvailable()) {
      const voices = await voiceHelper.getAvailableVoices();
      setAvailableVoices(voices.filter(v => v.lang.startsWith('en')));
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaved(false);

    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        companion_personality: existingPrefs?.companion_personality || 'balanced',
        response_length: existingPrefs?.response_length || 'moderate',
        conversation_style: existingPrefs?.conversation_style || 'friendly',
        use_name_frequency: existingPrefs?.use_name_frequency || 'sometimes',
        voice_settings: settings,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const updateSettings = <K extends keyof VoiceSettings>(
    key: K,
    value: VoiceSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const testVoice = async () => {
    if (!voiceHelper.isAvailable() || isTestingVoice) return;

    setIsTestingVoice(true);
    try {
      await voiceHelper.speak(
        "Hi! I'm Buddy, your wellness companion. This is how I sound with your current settings.",
        {
          pitch: settings.pitch,
          rate: settings.rate,
          volume: settings.volume,
        }
      );
    } catch (error) {
      console.error('Voice test error:', error);
    }
    setIsTestingVoice(false);
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
    card: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    settingLabel: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
      marginBottom: 16,
      lineHeight: getFontSize(fontSize, 'small') * 1.5,
    },
    sliderContainer: {
      marginTop: 8,
      marginBottom: 16,
    },
    sliderLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    sliderLabel: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.textSecondary,
    },
    sliderValue: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.primary,
      fontWeight: '600',
    },
    voiceOption: {
      backgroundColor: theme.background,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    voiceOptionSelected: {
      borderColor: theme.primary,
      backgroundColor: `${theme.primary}10`,
    },
    voiceOptionText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
    },
    testButton: {
      backgroundColor: theme.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
    },
    testButtonDisabled: {
      opacity: 0.5,
    },
    testButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
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
    warningBox: {
      backgroundColor: `${theme.error}15`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    warningText: {
      fontSize: getFontSize(fontSize, 'small'),
      color: theme.text,
      lineHeight: getFontSize(fontSize, 'small') * 1.5,
    },
  });

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Volume2 size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Voice Settings</Text>
              <Text style={styles.headerSubtitle}>Configure voice features</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={[styles.scrollContent, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Voice features are currently only available on web browsers. To use voice input and
              text-to-speech, please access this app through a web browser.
            </Text>
          </View>
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Volume2 size={28} color="#FFFFFF" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Voice Settings</Text>
            <Text style={styles.headerSubtitle}>Configure voice features</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!voiceHelper.isAvailable() && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Your browser doesn't support speech synthesis. Voice features will not be available.
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Enable voice features to have Buddy speak responses aloud and listen to your voice
            input. This works best with headphones in quiet environments.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Features</Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Enable Voice</Text>
              <Switch
                value={settings.enabled}
                onValueChange={(value) => updateSettings('enabled', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={settings.enabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
            <Text style={styles.settingDescription}>
              Allow Buddy to speak responses and listen to voice input
            </Text>
          </View>

          {settings.enabled && (
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto-Speak Responses</Text>
                <Switch
                  value={settings.autoSpeak}
                  onValueChange={(value) => updateSettings('autoSpeak', value)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={settings.autoSpeak ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>
              <Text style={styles.settingDescription}>
                Automatically speak all of Buddy's responses
              </Text>
            </View>
          )}
        </View>

        {settings.enabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Tuning</Text>

              <View style={styles.card}>
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabelRow}>
                    <Text style={styles.sliderLabel}>Pitch</Text>
                    <Text style={styles.sliderValue}>{settings.pitch.toFixed(1)}</Text>
                  </View>
                  <Slider
                    value={settings.pitch}
                    onValueChange={(value) => updateSettings('pitch', value)}
                    minimumValue={0.5}
                    maximumValue={2.0}
                    step={0.1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.primary}
                  />
                  <Text style={styles.settingDescription}>
                    Lower values sound deeper, higher values sound lighter
                  </Text>
                </View>

                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabelRow}>
                    <Text style={styles.sliderLabel}>Speed</Text>
                    <Text style={styles.sliderValue}>{settings.rate.toFixed(1)}</Text>
                  </View>
                  <Slider
                    value={settings.rate}
                    onValueChange={(value) => updateSettings('rate', value)}
                    minimumValue={0.5}
                    maximumValue={2.0}
                    step={0.1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.primary}
                  />
                  <Text style={styles.settingDescription}>
                    How fast or slow Buddy speaks
                  </Text>
                </View>

                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabelRow}>
                    <Text style={styles.sliderLabel}>Volume</Text>
                    <Text style={styles.sliderValue}>{settings.volume.toFixed(1)}</Text>
                  </View>
                  <Slider
                    value={settings.volume}
                    onValueChange={(value) => updateSettings('volume', value)}
                    minimumValue={0.0}
                    maximumValue={1.0}
                    step={0.1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.border}
                    thumbTintColor={theme.primary}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.testButton, isTestingVoice && styles.testButtonDisabled]}
                  onPress={testVoice}
                  disabled={isTestingVoice}
                >
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.testButtonText}>
                    {isTestingVoice ? 'Speaking...' : 'Test Voice'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {availableVoices.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Voice Selection</Text>
                {availableVoices.slice(0, 5).map((voice) => (
                  <TouchableOpacity
                    key={voice.name}
                    style={[
                      styles.voiceOption,
                      settings.voice === voice.name && styles.voiceOptionSelected,
                    ]}
                    onPress={() => updateSettings('voice', voice.name)}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={styles.voiceOptionText}>{voice.name}</Text>
                      {settings.voice === voice.name && (
                        <Check size={20} color={theme.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
            saved && styles.savedIndicator,
          ]}
          onPress={saveSettings}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
