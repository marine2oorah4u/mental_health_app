import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Sparkles, Heart, Leaf } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#F0FDFA']}
      style={styles.container}
    >
      <View style={styles.decorativeElements}>
        <Animated.View
          entering={FadeIn.duration(1000).delay(200)}
          style={[styles.leaf, styles.leafTopLeft]}
        >
          <Leaf size={40} color="#10B981" opacity={0.3} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(400)}
          style={[styles.leaf, styles.leafTopRight]}
        >
          <Leaf size={32} color="#34D399" opacity={0.3} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(600)}
          style={[styles.sparkle, styles.sparkleTop]}
        >
          <Sparkles size={20} color="#FCD34D" opacity={0.5} />
        </Animated.View>
        <Animated.View
          entering={FadeIn.duration(1000).delay(800)}
          style={[styles.sparkle, styles.sparkleBottom]}
        >
          <Sparkles size={16} color="#FCD34D" opacity={0.5} />
        </Animated.View>
      </View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          style={styles.illustrationContainer}
        >
          <View style={styles.brainWrapper}>
            <View style={styles.lightBulb}>
              <View style={styles.lightBulbGlow} />
              <Text style={styles.lightBulbEmoji}>💡</Text>
            </View>
            <View style={styles.brainContainer}>
              <Brain size={120} color="#EC4899" strokeWidth={1.5} />
              <View style={styles.brainAccent} />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(500)}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Take Care Of Your Mind.</Text>
          <Text style={styles.subtitle}>
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
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>Start Now →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-in')}
          >
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>
    </LinearGradient>
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
    transform: [{ rotate: '-15deg' }],
  },
  leafTopRight: {
    top: 100,
    right: 40,
    transform: [{ rotate: '25deg' }],
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleTop: {
    top: 140,
    right: 80,
  },
  sparkleBottom: {
    bottom: 200,
    left: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  brainWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightBulb: {
    position: 'absolute',
    top: -20,
    right: -10,
    zIndex: 10,
  },
  lightBulbGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    opacity: 0.6,
    top: -10,
    left: -10,
  },
  lightBulbEmoji: {
    fontSize: 40,
  },
  brainContainer: {
    position: 'relative',
    padding: 30,
    backgroundColor: '#FCE7F3',
    borderRadius: 100,
  },
  brainAccent: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#FBCFE8',
    borderStyle: 'dashed',
    top: -5,
    left: -5,
    opacity: 0.5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#F97316',
  },
});
