import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInRight,
  SlideInLeft,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme, getFontSize } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Sparkles, Loader, LifeBuoy } from 'lucide-react-native';
import { getAIResponse, trackUserActivity } from '@/lib/companionAI';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AchievementCelebration from '@/components/AchievementCelebration';
import AnimalCompanion from '@/components/AnimalCompanion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const getContextualResponseFallback = (userMessage: string, messageHistory: Message[]): string => {
  const msg = userMessage.toLowerCase().trim();

  // Crisis detection - highest priority
  if (msg.includes('crisis') || msg.includes('emergency') || msg.includes('hurt myself') || msg.includes('suicide') || msg.includes('end it') || msg.includes('kill myself') || msg.includes('want to die')) {
    return "I'm really concerned about you. Please reach out for help immediately:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter, and help is available 24/7. Please don't face this alone.";
  }

  // Simple test/greeting responses
  if ((msg === 'test' || msg === 'testing') || (msg.includes('test') && msg.length < 15)) {
    return "Hey! I'm Buddy, your wellness companion. I'm here and working perfectly! How are you feeling today? I'm ready to listen and support you.";
  }

  // Check for very short messages that might be continuations
  if (msg.length < 3) {
    return "I'm listening. Feel free to share more when you're ready.";
  }

  if (msg.includes('sad') || msg.includes('down') || msg.includes('depressed') || msg.includes('hopeless')) {
    return "I'm sorry you're feeling this way. Your feelings are valid, and it's brave of you to share. Remember, these difficult emotions are temporary. Would you like to:\n• Try a breathing exercise\n• Write in your journal\n• Log your mood to track patterns\n\nOr we can just talk more about what you're experiencing.";
  }

  if (msg.includes('anxious') || msg.includes('worried') || msg.includes('stress') || msg.includes('nervous') || msg.includes('panic')) {
    return "Anxiety can feel overwhelming. Let's take this moment by moment. Try this: Take a slow, deep breath in for 4 counts, hold for 4, then exhale for 4. \n\nI'm here with you. Would you like to try our guided breathing exercises, or tell me more about what's causing the anxiety?";
  }

  if (msg.includes('happy') || msg.includes('good') || msg.includes('great') || msg.includes('better') || msg.includes('excited')) {
    return "That's wonderful! I'm so glad you're feeling positive. It's important to celebrate these moments. What's contributing to these good feelings? Have you logged this mood so you can look back on it later?";
  }

  if (msg.includes('thank') || msg.includes('appreciate') || msg.includes('grateful')) {
    return "You're very welcome! I'm grateful to be here for you. Practicing gratitude is so beneficial for mental health. Have you tried writing about what you're grateful for in your journal?";
  }

  if (msg.includes('help') || msg.includes('support') || msg.includes('what can you do')) {
    return "I'm here to support your mental wellness journey! Here's how I can help:\n\n• Listen and provide emotional support\n• Suggest coping strategies and breathing exercises\n• Help you track your moods and journal\n• Connect you to crisis resources if needed\n• Celebrate your wins and progress\n\nWhat would be most helpful for you right now?";
  }

  if (msg.includes('sleep') || msg.includes('tired') || msg.includes('insomnia') || msg.includes('can\'t sleep')) {
    return "Sleep issues can really impact our mental health. Here are some tips:\n• Try our 4-7-8 breathing exercise before bed\n• Avoid screens 1 hour before sleep\n• Keep your room cool and dark\n• Write worries in your journal to clear your mind\n\nWould you like to try a relaxation exercise now?";
  }

  if (msg.includes('angry') || msg.includes('mad') || msg.includes('frustrated') || msg.includes('irritated')) {
    return "It's okay to feel angry - that's a valid emotion. Let's work through it together:\n• Take some deep breaths to calm your nervous system\n• Write about what's making you angry in your journal\n• Do some physical activity if possible\n• Remember: you can feel angry without acting on it\n\nWant to talk about what triggered this?";
  }

  if (msg.includes('lonely') || msg.includes('alone') || msg.includes('isolated') || msg.includes('no friends')) {
    return "Feeling lonely is really tough, and I want you to know you're not alone in feeling this way. I'm here with you. Our community board lets you share accomplishments and connect with others on similar journeys. Would that help, or would you like to talk more about these feelings?";
  }

  if (msg.includes('work') || msg.includes('job') || msg.includes('school') || msg.includes('study')) {
    return "Work and school stress is really common. Remember to take breaks and practice self-care. It's okay to not be perfect. Have you tried:\n• Breaking tasks into smaller steps?\n• Taking short breathing breaks?\n• Journaling about what's overwhelming you?\n\nYour mental health is more important than productivity.";
  }

  if (msg.includes('relationships') || msg.includes('friend') || msg.includes('family') || msg.includes('partner')) {
    return "Relationships can be complex and sometimes challenging. It's important to communicate your needs and set healthy boundaries. Remember, it's okay to prioritize your mental health. Would journaling about your feelings help clarify things?";
  }

  if (msg.includes('exercise') || msg.includes('walk') || msg.includes('workout')) {
    return "That's great! Physical activity is wonderful for mental health. Even a short walk can boost your mood. Keep it up! Have you noticed how movement affects your mood? You could track this in your mood log.";
  }

  // Greetings
  if (msg.match(/^(hi|hello|hey|greetings|sup|wassup|whats up)/)) {
    const greetings = [
      "Hello! It's great to hear from you. How are you feeling today?",
      "Hey there! I'm here for you. What's on your mind?",
      "Hi! Good to see you. How has your day been?",
      "Hello! This is a safe space - feel free to share how you're doing.",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Positive affirmations requests
  if (msg.includes('affirmation') || msg.includes('something positive') || msg.includes('cheer me up')) {
    const affirmations = [
      "You are stronger than you know, and braver than you feel. Every step forward, no matter how small, is progress worth celebrating.",
      "It's okay to have difficult days. What matters is that you're still here, still trying. That takes real courage.",
      "Remember: You don't have to be perfect. You just have to show up and do your best. And you're doing that right now.",
      "Your feelings are valid, your struggles are real, and you deserve kindness and compassion - especially from yourself.",
    ];
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }

  // Questions about the companion
  if (msg.includes('who are you') || msg.includes('what are you') || msg.includes('tell me about yourself')) {
    return "I'm Buddy, your mental wellness companion! I'm here to provide emotional support, suggest coping strategies, and help you navigate your mental health journey. I can listen without judgment, help you track your moods, suggest breathing exercises, and connect you with resources. Most importantly, I'm always here when you need someone to talk to.";
  }

  // Motivation requests
  if (msg.includes('motivate') || msg.includes('motivation') || msg.includes('give up') || msg.includes('can\'t do this')) {
    return "I know things feel hard right now, but you've made it through 100% of your difficult days so far. That's proof of your strength. Take it one moment at a time. You don't have to climb the whole mountain today - just take the next step. I believe in you.";
  }

  // Progress checks
  if (msg.includes('progress') || msg.includes('getting better') || msg.includes('improving')) {
    return "Progress isn't always linear, and that's completely normal. Some days will feel like steps backward, but you're building resilience with each experience. Have you been tracking your mood? It can help you see patterns and progress you might not notice day-to-day.";
  }

  // Breathing/meditation queries
  if (msg.includes('breathe') || msg.includes('breathing') || msg.includes('meditation') || msg.includes('meditate')) {
    return "Breathing exercises are one of the fastest ways to calm your nervous system. Would you like to try one now? We have several guided patterns available. Just head to the Wellness tab and try the breathing exercises. Even 2 minutes can make a real difference!";
  }

  // Journal queries
  if (msg.includes('journal') || msg.includes('write') || msg.includes('writing')) {
    return "Journaling is such a powerful tool for processing emotions and gaining clarity. It can help you understand patterns in your thoughts and feelings. Would you like to start a journal entry now? You can find it in the Journal tab. Don't worry about perfect sentences - just write what you feel.";
  }

  if (msg.length < 15) {
    return "I'm here and listening. Can you tell me more about what's on your mind or how you're feeling right now?";
  }

  const recentMessages = messageHistory.slice(-4);
  const userHasSharedALot = recentMessages.filter(m => m.isUser).length >= 2;

  if (userHasSharedALot) {
    const deeperResponses = [
      "Thank you for sharing so openly with me. It takes courage to be this vulnerable. I'm hearing that you're going through a lot. Would it help to break this down into smaller, more manageable pieces?",
      "I really appreciate you trusting me with your feelings. Remember, healing isn't linear - it's okay to have ups and downs. What's one small thing that might help you feel even slightly better right now?",
      "You're doing important work by reflecting on your feelings like this. Have you considered writing these thoughts in your journal? Sometimes seeing them on paper can provide new perspective.",
    ];
    return deeperResponses[Math.floor(Math.random() * deeperResponses.length)];
  }

  const supportiveResponses = [
    "I hear you. Your feelings are completely valid, and it's important that you're expressing them. Would you like to explore this more, or would a wellness activity help right now?",
    "Thank you for sharing that with me. Remember, it's okay to take things one step at a time - there's no rush. What do you need most in this moment?",
    "I'm here for you. It takes real strength to acknowledge what you're going through. Have you tried journaling about these thoughts? It can be really helpful.",
    "That sounds like a lot to carry. Please remember to be kind and patient with yourself. Would practicing some breathing exercises help you feel more grounded?",
    "I'm listening, and I want you to know that what you're feeling matters. You deserve support and care. How can I best support you right now?",
  ];

  return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
};

export default function CompanionScreen() {
  const { theme, fontSize } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [celebrationAchievement, setCelebrationAchievement] = useState<any>(null);
  const [companionEmotion, setCompanionEmotion] = useState<'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'celebrating'>('idle');
  const typingOpacity = useSharedValue(0.6);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      typingOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.4, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      typingOpacity.value = withTiming(0.6, { duration: 300 });
    }
  }, [isTyping]);

  // Show greeting on mount (fresh session each time)
  useEffect(() => {
    if (!authLoading) {
      showInitialGreeting();
      if (user?.id) {
        setTimeout(() => checkForNewAchievements(user.id), 1000);
      }
    }
  }, [authLoading]);

  const showInitialGreeting = async () => {
    const greetings = [
      "Hey there! I'm Buddy, your wellness companion. I'm really glad you're here. What's your name?",
      "Hi! I'm Buddy. I'm here to listen, support you, and be a friend on your wellness journey. What should I call you?",
      "Hello! I'm Buddy, and I'm here for you - no judgment, just support. Mind if I ask your name?",
      "Hey! I'm Buddy. Think of me as a friend who's always here when you need someone to talk to. What's your name?",
      "Hi there! I'm Buddy, your companion for this journey. I'd love to get to know you. What's your name?",
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

    setMessages([
      {
        id: '1',
        text: randomGreeting,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setLoading(false);
  };

  const checkForNewAchievements = async (userId?: string) => {
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      console.log('No user ID for checking achievements');
      return;
    }

    console.log('Checking for achievements for user:', targetUserId);

    const { data: recentAchievements, error } = await supabase
      .from('user_achievements')
      .select(`
        earned_at,
        achievements (
          name,
          description,
          points,
          category
        )
      `)
      .eq('user_id', targetUserId)
      .order('earned_at', { ascending: false })
      .limit(1);

    console.log('Achievement check result:', { recentAchievements, error });

    if (recentAchievements && recentAchievements.length > 0) {
      const latest = recentAchievements[0];
      const earnedAt = new Date(latest.earned_at);
      const now = new Date();
      const secondsAgo = (now.getTime() - earnedAt.getTime()) / 1000;

      console.log('Latest achievement:', latest, 'Seconds ago:', secondsAgo);

      if (secondsAgo < 5 && latest.achievements && typeof latest.achievements === 'object' && 'name' in latest.achievements) {
        console.log('🎉 SHOWING CELEBRATION!', latest.achievements);
        setCompanionEmotion('celebrating');
        setCelebrationAchievement({
          name: (latest.achievements as any).name,
          description: (latest.achievements as any).description,
          points: (latest.achievements as any).points,
          category: (latest.achievements as any).category,
        });
        setTimeout(() => setCompanionEmotion('idle'), 4000);
      } else {
        console.log('Achievement too old or missing data', { secondsAgo, hasData: !!latest.achievements });
      }
    } else {
      console.log('No recent achievements found');
    }
  };

  const detectSentiment = (message: string): string => {
    const msg = message.toLowerCase();
    if (msg.match(/anxious|worried|stress|panic/)) return 'anxious';
    if (msg.match(/sad|down|depressed|hopeless/)) return 'sad';
    if (msg.match(/happy|good|great|better/)) return 'positive';
    if (msg.match(/angry|mad|frustrated/)) return 'stressed';
    return 'neutral';
  };

  const extractTopics = (message: string): string[] | null => {
    const topics: string[] = [];
    const msg = message.toLowerCase();

    if (msg.match(/work|job|boss|career/)) topics.push('work_school');
    if (msg.match(/friend|family|relationship|partner/)) topics.push('relationships');
    if (msg.match(/sleep|tired|health/)) topics.push('health');

    return topics.length > 0 ? topics : null;
  };

  const sendMessage = async () => {
    console.log('🔵 sendMessage called');
    console.log('Input text:', inputText);
    console.log('User:', user?.id);
    console.log('Is sending:', isSending);

    if (!inputText.trim() || isSending) {
      console.log('❌ Blocked: no input text or already sending');
      return;
    }

    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    console.log('✅ Adding user message to state');
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      console.log('New messages array length:', newMessages.length);
      return newMessages;
    });

    const userText = inputText;
    setInputText('');
    setIsTyping(true);
    setCompanionEmotion('listening');

    try {
      console.log('Calling getAIResponse with userText:', userText);
      const recentMessages = messages.slice(-10);
      const response = await getAIResponse(userText, user?.id || 'anonymous', recentMessages);
      console.log('Got response:', response);

      if (user?.id && messages.length === 0) {
        await trackUserActivity(user.id, 'conversation');
      }
      if (user?.id) {
        const currentUserId = user.id;
        await trackUserActivity(currentUserId, 'message');

        setTimeout(() => {
          checkForNewAchievements(currentUserId);
        }, 500);
      }

      const sentiment = detectSentiment(userText);
      let emotion: 'idle' | 'listening' | 'speaking' | 'happy' | 'concerned' | 'celebrating' = 'speaking';

      if (sentiment === 'positive') emotion = 'happy';
      else if (sentiment === 'sad' || sentiment === 'anxious') emotion = 'concerned';

      setCompanionEmotion(emotion);

      setTimeout(async () => {
        const companionMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        };
        console.log('Adding companion response');
        setMessages((prev) => [...prev, companionMessage]);
        setIsTyping(false);
        setIsSending(false);
        setTimeout(() => setCompanionEmotion('idle'), 3000);
      }, 800);
    } catch (error) {
      console.error('AI response error:', error);
      setTimeout(async () => {
        const fallbackResponse = getContextualResponseFallback(userText, messages);
        const companionMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse,
          isUser: false,
          timestamp: new Date(),
        };
        console.log('Adding fallback response');
        setMessages((prev) => [...prev, companionMessage]);
        setIsTyping(false);
        setIsSending(false);

        if (user?.id) {
          await supabase.from('companion_conversations').insert({
            user_id: user.id,
            message: userText,
            response: fallbackResponse,
            sentiment: detectSentiment(userText),
            topics: extractTopics(userText),
          });
        }
      }, 800);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerGradient: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
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
    messagesContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: 'transparent',
    },
    messageWrapper: {
      marginBottom: 16,
      flexDirection: 'row',
    },
    userMessageWrapper: {
      justifyContent: 'flex-end',
    },
    companionMessageWrapper: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '75%',
      padding: 16,
      borderRadius: 20,
    },
    userBubble: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: 4,
    },
    companionBubble: {
      backgroundColor: theme.surface,
      borderBottomLeftRadius: 4,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    messageText: {
      fontSize: getFontSize(fontSize, 'body'),
      lineHeight: getFontSize(fontSize, 'body') * 1.5,
    },
    userMessageText: {
      color: '#FFFFFF',
    },
    companionMessageText: {
      color: theme.text,
    },
    timestamp: {
      fontSize: getFontSize(fontSize, 'small'),
      opacity: 0.7,
      marginTop: 4,
    },
    userTimestamp: {
      color: '#FFFFFF',
      textAlign: 'right',
    },
    companionTimestamp: {
      color: theme.textSecondary,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 16,
      paddingBottom: 32,
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: theme.background,
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 12,
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.text,
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    voiceButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    voiceButtonActive: {
      backgroundColor: theme.primary,
    },
    speakingButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    crisisButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#DC2626',
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      gap: 8,
    },
    crisisButtonText: {
      color: '#FFFFFF',
      fontSize: getFontSize(fontSize, 'small'),
      fontWeight: '600',
      flex: 1,
    },
    companionIcon: {
      marginRight: 8,
    },
    typingIndicator: {
      flexDirection: 'row',
      gap: 6,
      paddingVertical: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      fontSize: getFontSize(fontSize, 'body'),
      color: theme.textSecondary,
      marginTop: 16,
    },
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const typingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: typingOpacity.value,
    };
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View entering={FadeIn.duration(800)}>
          <Sparkles size={48} color={theme.primary} />
        </Animated.View>
        <Animated.Text
          entering={FadeIn.duration(800).delay(300)}
          style={styles.loadingText}
        >
          Preparing your companion...
        </Animated.Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Buddy</Text>
            <Text style={styles.headerSubtitle}>Your Wellness Companion</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/crisis-resources')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LifeBuoy size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <AnimalCompanion
            animalType="cat"
            emotion={
              companionEmotion === 'celebrating' ? 'excited' :
              companionEmotion === 'idle' ? 'idle' :
              companionEmotion
            }
            size={140}
            onPress={() => {
              setCompanionEmotion('happy');
              setTimeout(() => setCompanionEmotion('idle'), 2000);
            }}
          />
        </View>
      </LinearGradient>

      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >

        {messages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={[
              styles.messageWrapper,
              message.isUser ? styles.userMessageWrapper : styles.companionMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.companionBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.companionMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.isUser ? styles.userTimestamp : styles.companionTimestamp,
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </Animated.View>
        ))}

        {isTyping && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.messageWrapper, styles.companionMessageWrapper]}
          >
            <View style={[styles.messageBubble, styles.companionBubble]}>
              <Animated.View style={[styles.typingIndicator, typingAnimatedStyle]}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </Animated.View>
            </View>
          </Animated.View>
        )}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor={theme.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Send size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 20 }} />
      <AchievementCelebration
        achievement={celebrationAchievement}
        onDismiss={() => setCelebrationAchievement(null)}
      />
    </KeyboardAvoidingView>
  );
}
