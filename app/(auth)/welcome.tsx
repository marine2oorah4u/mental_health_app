import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  BrainIllustration,
  LeafDecoration,
  SparkleDecoration,
  FloatingCircles,
  GearDecoration,
} from '@/components/Illustrations';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme.text === '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f0e8' }]}>
      <FloatingCircles isDark={isDark} />

      <View style={styles.decorativeElements}>
        <Animated.View entering={FadeIn.duration(1000).delay(200)} style={styles.leafTopLeft}>
          <LeafDecoration size={50} color={isDark ? '#10B981' : '#059669'} />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(400)} style={styles.leafTopRight}>
          <LeafDecoration size={40} color={isDark ? '#34D399' : '#10B981'} />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(600)} style={styles.sparkleTop}>
          <SparkleDecoration size={30} color={isDark ? '#FCD34D' : '#F59E0B'} />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(800)} style={styles.gearTop}>
          <GearDecoration size={35} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(400)} style={styles.leafBottomLeft}>
          <LeafDecoration size={70} color={isDark ? '#10B981' : '#059669'} />
        </Animated.View>
        <Animated.View entering={FadeIn.duration(1000).delay(600)} style={styles.leafBottomRight}>
          <LeafDecoration size={60} color={isDark ? '#34D399' : '#10B981'} />
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          style={styles.illustrationContainer}
        >
          <BrainIllustration size={220} isDark={isDark} />
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
  leafTopLeft: {
    position: 'absolute',
    top: 70,
    left: 20,
    transform: [{ rotate: '-25deg' }],
  },
  leafTopRight: {
    position: 'absolute',
    top: 100,
    right: 30,
    transform: [{ rotate: '35deg' }],
  },
  sparkleTop: {
    position: 'absolute',
    top: 130,
    left: 60,
  },
  gearTop: {
    position: 'absolute',
    top: 160,
    right: 70,
    transform: [{ rotate: '15deg' }],
  },
  leafBottomLeft: {
    position: 'absolute',
    bottom: -10,
    left: -15,
    transform: [{ rotate: '15deg' }],
  },
  leafBottomRight: {
    position: 'absolute',
    bottom: -5,
    right: -10,
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
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
