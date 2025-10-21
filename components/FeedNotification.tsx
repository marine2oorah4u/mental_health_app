import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Sparkles, Heart, TrendingUp } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface FeedNotificationProps {
  type: 'achievement' | 'post';
  username: string;
  content: string;
  onPress?: () => void;
  onDismiss: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FeedNotification({
  type,
  username,
  content,
  onPress,
  onDismiss,
}: FeedNotificationProps) {
  const translateX = useSharedValue(SCREEN_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Play notification sound
    playNotificationSound();

    // Slide in from right
    translateX.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
    opacity.value = withTiming(1, { duration: 300 });

    // Stay for 4 seconds, then slide out
    const timer = setTimeout(() => {
      translateX.value = withTiming(
        SCREEN_WIDTH,
        { duration: 400 },
        (finished) => {
          if (finished) {
            runOnJS(onDismiss)();
          }
        }
      );
      opacity.value = withTiming(0, { duration: 400 });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/notification-sound-269266.mp3'),
        { volume: 0.5 }
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const getIcon = () => {
    if (type === 'achievement') {
      return <Sparkles size={20} color="#FFD700" />;
    }
    return <Heart size={20} color="#FF69B4" />;
  };

  const getBackgroundColor = () => {
    if (type === 'achievement') {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => {
          if (onPress) {
            onPress();
          }
          onDismiss();
        }}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.notification,
            type === 'achievement' ? styles.achievementBg : styles.postBg,
          ]}
        >
          <View style={styles.iconContainer}>{getIcon()}</View>
          <View style={styles.content}>
            <Text style={styles.username} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.text} numberOfLines={2}>
              {content}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 16,
    left: 16,
    zIndex: 1000,
  },
  touchable: {
    width: '100%',
  },
  notification: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  achievementBg: {
    backgroundColor: '#667eea',
  },
  postBg: {
    backgroundColor: '#f5576c',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
});
