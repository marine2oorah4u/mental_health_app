import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme.text === '#FFFFFF';

  const handleSignUp = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password);
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f0e8' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.decorativeElements}>
        <Text style={[styles.leafEmoji, styles.leafTopLeft]}>🌿</Text>
        <Text style={[styles.leafEmoji, styles.leafTopRight, { fontSize: 32 }]}>🌿</Text>
        <Text style={[styles.leafEmoji, styles.leafBottomLeft, { fontSize: 60 }]}>🌿</Text>
        <Text style={[styles.leafEmoji, styles.leafBottomRight, { fontSize: 50 }]}>🌿</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#1a1a1a'} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
              Welcome!
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              Start your journey today.
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF',
                  borderColor: isDark ? '#3a3a3a' : '#E5E7EB',
                  color: isDark ? '#FFFFFF' : '#1a1a1a',
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF',
                    borderColor: isDark ? '#3a3a3a' : '#E5E7EB',
                    color: isDark ? '#FFFFFF' : '#1a1a1a',
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                ) : (
                  <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#3a3a3a' : '#E5E7EB' }]} />
            <Text style={[styles.dividerText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#3a3a3a' : '#E5E7EB' }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF' }]}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF' }]}>
              <Text style={styles.socialIcon}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: isDark ? '#2a2a2a' : '#FFFFFF' }]}>
              <Text style={styles.socialIcon}></Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text style={[styles.footerLink, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  leafEmoji: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.4,
  },
  leafTopLeft: {
    top: 60,
    left: 20,
    transform: [{ rotate: '-25deg' }],
  },
  leafTopRight: {
    top: 80,
    right: 20,
    transform: [{ rotate: '35deg' }],
  },
  leafBottomLeft: {
    bottom: 0,
    left: -10,
    transform: [{ rotate: '15deg' }],
  },
  leafBottomRight: {
    bottom: 0,
    right: -5,
    transform: [{ rotate: '-15deg' }],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#F97316',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
