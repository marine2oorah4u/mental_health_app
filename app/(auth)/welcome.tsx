import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme.text === '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f0e8' }]}>
      <View style={styles.decorativeElements}>
        <Animated.View
          entering={FadeIn.duration(1000).delay(200)}
          style={[styles.leaf, styles.leafTopLeft]}
        >
          <Text style={styles.leafEmoji}>🌿</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(400)}
          style={[styles.leaf, styles.leafTopRight]}
        >
          <Text style={[styles.leafEmoji, { fontSize: 32 }]}>🌿</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(300)}
          style={[styles.sparkle, { top: 120, left: 50 }]}
        >
          <Text style={styles.sparkleText}>✨</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(500)}
          style={[styles.sparkle, { top: 160, right: 60 }]}
        >
          <Text style={styles.sparkleText}>⚙️</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(700)}
          style={[styles.sparkle, { bottom: 250, left: 80 }]}
        >
          <Text style={[styles.sparkleText, { fontSize: 12 }]}>✨</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(600)}
          style={[styles.sparkle, { top: 200, left: 30 }]}
        >
          <View style={[styles.dot, { backgroundColor: isDark ? '#60A5FA' : '#93C5FD' }]} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(800)}
          style={[styles.sparkle, { top: 140, right: 100 }]}
        >
          <View style={[styles.dot, { backgroundColor: isDark ? '#34D399' : '#6EE7B7' }]} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(900)}
          style={[styles.sparkle, { bottom: 280, right: 50 }]}
        >
          <View style={[styles.dot, { backgroundColor: isDark ? '#F472B6' : '#F9A8D4' }]} />
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(1000).delay(400)}
          style={[styles.leafBottom, styles.leafBottomLeft]}
        >
          <Text style={[styles.leafEmoji, { fontSize: 60 }]}>🌿</Text>
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(600)}
          style={[styles.leafBottom, styles.leafBottomRight]}
        >
          <Text style={[styles.leafEmoji, { fontSize: 50 }]}>🌿</Text>
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          style={styles.illustrationContainer}
        >
          <View style={styles.brainWrapper}>
            <View style={styles.lightBulb}>
              <View style={[styles.lightBulbGlow, { opacity: isDark ? 0.3 : 0.5 }]} />
              <Text style={styles.lightBulbEmoji}>💡</Text>
            </View>
            <View style={styles.brainContainer}>
              <Text style={styles.brainEmoji}>🧠</Text>
            </View>
            <View style={styles.gearTop}>
              <Text style={styles.gearEmoji}>⚙️</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(500)}
          style={styles.textContainer}
        >
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            Take Care Of Your Mind.
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
            Are you feeling overwhelmed by anxiety and stress?{'\n'}
            Our app will help you find calm and balance in your{'\n'}
            day to day life.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(700)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/sign-up')}
          >
            <Text style={styles.primaryButtonText}>Start Now  →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(800).delay(900)}
        style={styles.footer}
      >
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text style={[styles.linkText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
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
  leaf: {
    position: 'absolute',
  },
  leafTopLeft: {
    top: 60,
    left: 30,
    transform: [{ rotate: '-25deg' }],
  },
  leafTopRight: {
    top: 100,
    right: 30,
    transform: [{ rotate: '35deg' }],
  },
  leafBottom: {
    position: 'absolute',
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
  leafEmoji: {
    fontSize: 40,
    opacity: 0.6,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 16,
    opacity: 0.6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  illustrationContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  brainWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  lightBulb: {
    position: 'absolute',
    top: -10,
    left: -20,
    zIndex: 10,
  },
  lightBulbGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEF3C7',
    top: -10,
    left: -10,
  },
  lightBulbEmoji: {
    fontSize: 50,
  },
  brainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainEmoji: {
    fontSize: 140,
  },
  gearTop: {
    position: 'absolute',
    top: -5,
    right: -15,
    zIndex: 5,
  },
  gearEmoji: {
    fontSize: 35,
    opacity: 0.7,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#F97316',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});
