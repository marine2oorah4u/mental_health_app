import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  emoji: string;
  delay: number;
  offsetX: number;
}

interface EmojiParticlesProps {
  mood: 'happy' | 'sad' | 'anxious' | 'calm' | 'excited' | 'tired';
  trigger?: number;
}

const MOOD_EMOJIS = {
  happy: ['😊', '💛', '✨', '🌟', '💫'],
  sad: ['💙', '💜', '🌧️', '🫂'],
  anxious: ['🌀', '💭', '🫧', '🍃'],
  calm: ['🌊', '☁️', '🌸', '🕊️', '✨'],
  excited: ['🎉', '⭐', '💫', '🎊', '✨'],
  tired: ['😴', '💤', '🌙', '☁️'],
};

export default function EmojiParticles({ mood, trigger = 0 }: EmojiParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;

    const emojis = MOOD_EMOJIS[mood] || MOOD_EMOJIS.happy;
    const newParticles: Particle[] = [];

    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: Date.now() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: i * 150,
        offsetX: (Math.random() - 0.5) * 60,
      });
    }

    setParticles(newParticles);
    setShowParticles(true);

    const timer = setTimeout(() => {
      setShowParticles(false);
      setTimeout(() => setParticles([]), 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [trigger, mood]);

  if (!showParticles || particles.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleEmoji
          key={particle.id}
          emoji={particle.emoji}
          delay={particle.delay}
          offsetX={particle.offsetX}
        />
      ))}
    </View>
  );
}

function ParticleEmoji({ emoji, delay, offsetX }: { emoji: string; delay: number; offsetX: number }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) })
    );

    translateY.value = withDelay(
      delay,
      withTiming(-150, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(offsetX, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      })
    );

    opacity.value = withDelay(
      delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 24,
  },
});
