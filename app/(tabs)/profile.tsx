import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize, THEMES, ThemeName } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { User, LogOut, Palette, Type, Plus, Brain, Trophy, Settings, Volume2, Music, Home, Users, Link2, Heart, Pill, Image } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { theme, fontSize, themeName, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(themeName);

  useEffect(() => {
    console.log('ProfileScreen re-rendered with theme:', themeName, 'primary:', theme.primary);
  }, [themeName, theme]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  // Create styles dynamically based on current theme
  const styles = {
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
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      opacity: 0.95,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: getFontSize(fontSize, 'heading'),
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 24,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    themeButton: {
      width: 60,
      height: 60,
      borderRadius: 12,
      margin: 6,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    themeButtonActive: {
      borderColor: theme.text,
    },
    customThemeButton: {
      width: 60,
      height: 60,
      borderRadius: 12,
      margin: 6,
      borderWidth: 3,
      borderColor: themeName === 'custom' ? theme.text : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
    applyButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      fontWeight: '600',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 18,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginLeft: 12,
      fontWeight: '500',
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.error,
      borderRadius: 16,
      padding: 18,
      marginTop: 20,
      justifyContent: 'center',
      shadowColor: theme.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    signOutButtonText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: '#FFFFFF',
      marginLeft: 12,
      fontWeight: '600',
    },
  };

  return (
    <View key={themeName} style={styles.container}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          onPress={() => {
            const now = Date.now();
            if (now - lastTapTime < 500) {
              const newCount = tapCount + 1;
              setTapCount(newCount);
              if (newCount === 5) {
                router.push('/(tabs)/admin');
                setTapCount(0);
              }
            } else {
              setTapCount(1);
            }
            setLastTapTime(now);
          }}
        >
          <Text style={styles.headerTitle}>Profile</Text>
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>
          {user ? user.email : 'Anonymous User'}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Choose Theme</Text>
            <View style={styles.themeGrid}>
              {Object.keys(THEMES).map((key) => {
                const themeKey = key as ThemeName;
                const themeColors = THEMES[themeKey];
                return (
                  <TouchableOpacity
                    key={key}
                    activeOpacity={0.7}
                    style={[
                      styles.themeButton,
                      { backgroundColor: themeColors.primary },
                      selectedTheme === key && styles.themeButtonActive,
                    ]}
                    onPress={() => {
                      console.log('Selected theme:', themeKey);
                      setSelectedTheme(themeKey);
                    }}
                  />
                );
              })}
              <TouchableOpacity
                style={styles.customThemeButton}
                onPress={() => router.push('/(tabs)/custom-theme')}
              >
                <Palette size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                console.log('Applying theme:', selectedTheme);
                setTheme(selectedTheme);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Theme</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => router.push('/(tabs)/theme-builder')}
          >
            <Palette size={24} color={theme.text} />
            <Text style={styles.buttonText}>Create Custom Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/background-settings')}
          >
            <Image size={24} color={theme.text} />
            <Text style={styles.buttonText}>Background Patterns</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/achievements')}
          >
            <Trophy size={24} color={theme.text} />
            <Text style={styles.buttonText}>Achievements</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness</Text>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#DC2626' }]}
            onPress={() => router.push('/(tabs)/resources')}
          >
            <Heart size={24} color="#DC2626" />
            <Text style={styles.buttonText}>Crisis Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => router.push('/(tabs)/music-library')}
          >
            <Music size={24} color={theme.text} />
            <Text style={styles.buttonText}>Music Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => router.push('/(tabs)/sounds')}
          >
            <Volume2 size={24} color={theme.text} />
            <Text style={styles.buttonText}>Ambient Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(tabs)/medications')}
          >
            <Pill size={24} color={theme.text} />
            <Text style={styles.buttonText}>Medication Tracker</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => {
              alert('Join our Discord community! Link: https://discord.gg/yourlink\n\nComing soon!');
            }}
          >
            <Users size={24} color="#5865F2" />
            <Text style={styles.buttonText}>Join Discord</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              alert('Join our Facebook Group! Link: https://facebook.com/groups/yourgroup\n\nComing soon!');
            }}
          >
            <Link2 size={24} color="#1877F2" />
            <Text style={styles.buttonText}>Join Facebook Group</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.button}>
            <Type size={24} color={theme.text} />
            <Text style={styles.buttonText}>Font Size</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={24} color="#FFFFFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        {!user && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/(auth)/welcome')}
          >
            <User size={24} color={theme.text} />
            <Text style={styles.buttonText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
