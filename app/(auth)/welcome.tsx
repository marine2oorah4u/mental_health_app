import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, fontSize } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    iconContainer: {
      marginBottom: 40,
    },
    title: {
      fontSize: getFontSize(fontSize, 'title'),
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 60,
      paddingHorizontal: 20,
      lineHeight: 22,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      width: '80%',
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      textAlign: 'center',
    },
    secondaryButton: {
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.primary,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      width: '80%',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: getFontSize(fontSize, 'body'),
      fontWeight: '600',
      textAlign: 'center',
    },
    skipText: {
      color: theme.textSecondary,
      fontSize: getFontSize(fontSize, 'small'),
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Heart size={80} color={theme.primary} fill={theme.accent} />
      </View>

      <Text style={styles.title}>Welcome to MindfulCompanion</Text>
      <Text style={styles.subtitle}>
        Your personal mental wellness companion. Track your mood, practice mindfulness, and connect with supportive community.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/sign-up')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/(auth)/sign-in')}
      >
        <Text style={styles.secondaryButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.skipText}>Continue without account</Text>
      </TouchableOpacity>
    </View>
  );
}
