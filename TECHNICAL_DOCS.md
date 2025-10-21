# Taskyon Technical Documentation

Complete technical reference for the Taskyon mental wellness application.

## 🏗️ Architecture Overview

### Technology Stack

**Frontend Framework:**
- React Native 0.81.4
- Expo SDK 54
- TypeScript 5.9.2

**Navigation:**
- Expo Router 6.0.8
- Tab-based navigation
- Stack navigation for modals

**State Management:**
- React Context API
- Local component state
- Supabase real-time subscriptions

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions

**Audio/Voice:**
- expo-av for audio playback
- Web Speech API for voice I/O
- CDN-hosted sound files

**Animations:**
- react-native-reanimated 4.1.1
- Smooth 60fps performance
- Spring physics animations

**UI Components:**
- Custom component library
- lucide-react-native icons
- expo-linear-gradient
- react-native-gesture-handler

## 📁 Project Structure

```
taskyon/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Dashboard
│   │   ├── companion.tsx    # AI chat
│   │   ├── journal.tsx
│   │   ├── breathing.tsx
│   │   ├── wellness.tsx
│   │   ├── achievements.tsx
│   │   ├── community.tsx
│   │   ├── profile.tsx
│   │   ├── sounds.tsx       # Sound browser
│   │   ├── voice-settings.tsx
│   │   ├── companion-appearance.tsx
│   │   ├── companion-environment.tsx
│   │   ├── companion-memories.tsx
│   │   ├── companion-settings.tsx
│   │   └── crisis-resources.tsx
│   ├── _layout.tsx          # Root layout
│   ├── +not-found.tsx
│   └── index.tsx            # Entry redirect
├── components/
│   ├── AnimatedCompanion.tsx
│   ├── AmbientSoundPlayer.tsx
│   ├── AchievementCelebration.tsx
│   ├── ColorPicker.tsx
│   └── SimpleColorPicker.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── lib/
│   ├── supabase.ts          # DB client
│   ├── companionAI.ts       # AI logic
│   ├── voiceHelper.ts       # Voice I/O
│   ├── soundManager.ts      # Audio system
│   └── config.ts            # App config
├── supabase/
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge functions
│       └── ai-chat/
└── assets/
    ├── images/
    └── sounds/
```

## 🗄️ Database Schema

### Core Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `companion_appearance`
```sql
CREATE TABLE companion_appearance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  companion_type TEXT DEFAULT 'orb',
  size TEXT DEFAULT 'medium',
  primary_color TEXT DEFAULT '#6366F1',
  secondary_color TEXT DEFAULT '#8B5CF6',
  accent_color TEXT DEFAULT '#EC4899',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### `companion_environments`
```sql
CREATE TABLE companion_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  theme TEXT DEFAULT 'cozy',
  style TEXT DEFAULT 'stylized',
  floor_color TEXT DEFAULT '#E5E7EB',
  wall_color TEXT DEFAULT '#F3F4F6',
  ceiling_color TEXT DEFAULT '#FFFFFF',
  lighting_type TEXT DEFAULT 'soft',
  ambient_light_color TEXT DEFAULT '#FFFFFF',
  time_of_day TEXT DEFAULT 'day',
  weather_effect TEXT DEFAULT 'clear',
  ambient_sound TEXT DEFAULT 'none',
  ambient_volume DECIMAL(3,2) DEFAULT 0.30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### `user_preferences`
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  theme_preference TEXT DEFAULT 'system',
  font_size TEXT DEFAULT 'medium',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  voice_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### `achievements`
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  icon TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_achievements`
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_id UUID REFERENCES achievements NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:

```sql
-- Example policy structure
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON table_name FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## 🎨 Theme System

### Theme Context

Located in `contexts/ThemeContext.tsx`

**Available Themes:**
- Light
- Dark
- Blue
- Green
- Purple
- Pink

**Theme Structure:**
```typescript
interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}
```

**Font Sizes:**
- Small
- Medium (default)
- Large
- Extra Large

**Usage:**
```typescript
import { useTheme, getFontSize } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, fontSize, setTheme } = useTheme();

  return (
    <Text style={{
      color: theme.text,
      fontSize: getFontSize(fontSize, 'body')
    }}>
      Hello World
    </Text>
  );
}
```

## 🔐 Authentication System

### Auth Context

Located in `contexts/AuthContext.tsx`

**Features:**
- Email/password authentication
- Session management
- Loading states
- Auto-refresh tokens

**Usage:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function ProtectedScreen() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Redirect href="/sign-in" />;

  return <MainContent user={user} />;
}
```

**Sign Up:**
```typescript
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});
```

**Sign In:**
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});
```

**Sign Out:**
```typescript
await supabase.auth.signOut();
```

## 🤖 AI Companion System

### Companion AI Module

Located in `lib/companionAI.ts`

**Core Functions:**

#### `getAIResponse()`
```typescript
async function getAIResponse(
  message: string,
  userId: string,
  conversationHistory: Message[]
): Promise<string>
```

Makes request to `/ai-chat` edge function with:
- User message
- Conversation context
- User preferences
- Recent activities

**Response Processing:**
- Emotion detection
- Intent classification
- Context-aware replies
- Personalization

#### `trackUserActivity()`
```typescript
async function trackUserActivity(
  userId: string,
  activityType: string,
  metadata?: Record<string, any>
): Promise<void>
```

Tracks user actions for:
- Achievement progress
- Usage patterns
- AI context
- Analytics

**Activity Types:**
- `chat_message`
- `breathing_exercise`
- `journal_entry`
- `goal_created`
- `achievement_earned`

### Edge Function: ai-chat

Located in `supabase/functions/ai-chat/index.ts`

**Endpoint:** `POST /functions/v1/ai-chat`

**Request Body:**
```typescript
{
  message: string;
  userId: string;
  conversationHistory?: Message[];
}
```

**Response:**
```typescript
{
  response: string;
  emotion?: 'happy' | 'concerned' | 'celebrating' | 'idle';
}
```

**Environment Variables:**
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 🎵 Sound System

### Sound Manager

Located in `lib/soundManager.ts`

**Sound Library:**
```typescript
interface SoundTrack {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'ambient' | 'white-noise' | 'music';
  url?: string;
  localFile?: any;
  environments: string[];
}
```

**Available Sounds:**
- Ocean Waves
- Gentle Rain
- Forest Birds
- Gentle Wind
- Fireplace
- City Ambience
- White Noise
- Space Ambient
- Calm Piano
- Meditation Bowl

**Core Methods:**

```typescript
// Initialize audio system
await soundManager.initialize();

// Play sound with options
await soundManager.playSound(trackId, {
  volume: 0.5,
  loop: true
});

// Control playback
await soundManager.pauseSound();
await soundManager.resumeSound();
await soundManager.stopSound();

// Adjust volume
await soundManager.setVolume(0.7);

// Fade effects
await soundManager.fadeIn(2000);  // 2 seconds
await soundManager.fadeOut(2000);

// Get sounds by environment
const sounds = soundManager.getSoundsForEnvironment('beach');
```

**Audio Format:**
- MP3 streaming
- ~128kbps quality
- CDN hosted (FreeSoundorg)
- Low bandwidth usage

## 🎤 Voice System

### Voice Helper

Located in `lib/voiceHelper.ts`

**Platform Support:**
- ✅ Web (Chrome, Edge, Safari)
- ⚠️ Mobile (limited browser support)

**Voice Settings:**
```typescript
interface VoiceSettings {
  pitch: number;      // 0.5 - 2.0
  rate: number;       // 0.5 - 2.0
  volume: number;     // 0.0 - 1.0
  autoSpeak: boolean;
  selectedVoice?: string;
}
```

**Speech Recognition:**
```typescript
// Check availability
if (voiceHelper.isRecognitionAvailable()) {
  // Start listening
  await voiceHelper.startRecognition(
    (transcript) => {
      console.log('Heard:', transcript);
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

// Stop listening
voiceHelper.stopRecognition();
```

**Text-to-Speech:**
```typescript
// Speak text
await voiceHelper.speak(
  "Hello, how are you today?",
  {
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0
  }
);

// Stop speaking
voiceHelper.stopSpeaking();

// Get available voices
const voices = voiceHelper.getAvailableVoices();
```

**Browser Permissions:**
```typescript
// Request microphone access
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone access granted'))
  .catch(() => console.log('Microphone access denied'));
```

## 🎬 Animation System

### Reanimated Integration

**Shared Values:**
```typescript
import { useSharedValue, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);

// Animate value
scale.value = withSpring(1.2, {
  damping: 10,
  stiffness: 100
});
```

**Animated Styles:**
```typescript
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}));

return <Animated.View style={animatedStyle} />;
```

**Preset Animations:**
```typescript
import { FadeIn, FadeOut, SlideInLeft } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn.duration(500)}
  exiting={FadeOut.duration(300)}
/>
```

### Companion Animations

Located in `components/AnimatedCompanion.tsx`

**Emotion States:**
```typescript
type Emotion =
  | 'idle'        // Gentle breathing
  | 'listening'   // Attentive pulse
  | 'speaking'    // Active movement
  | 'happy'       // Joyful bounce
  | 'concerned'   // Calm, steady
  | 'celebrating' // Energetic spin
```

**Implementation:**
```typescript
<AnimatedCompanion
  companionType="orb"
  emotion="happy"
  primaryColor="#6366F1"
  secondaryColor="#8B5CF6"
  size={100}
  onPress={() => console.log('Tapped!')}
/>
```

**Animation Timing:**
- Idle: 3s loop
- Listening: 2s pulse
- Speaking: Continuous
- Happy: 1.5s bounce
- Concerned: 4s slow breath
- Celebrating: 2s spin with particles

## 🔌 API Integration

### Supabase Client

Located in `lib/supabase.ts`

**Configuration:**
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

**Database Queries:**
```typescript
// Select with RLS
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();

// Insert
const { error } = await supabase
  .from('journal_entries')
  .insert({
    user_id: userId,
    content: 'Today was great!',
    mood: 'happy'
  });

// Update
const { error } = await supabase
  .from('companion_appearance')
  .update({ primary_color: '#FF0000' })
  .eq('user_id', userId);

// Delete
const { error } = await supabase
  .from('user_achievements')
  .delete()
  .eq('id', achievementId);
```

**Real-time Subscriptions:**
```typescript
const subscription = supabase
  .channel('achievements')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'user_achievements',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New achievement!', payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build:web
```

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Sign out
- [ ] Session persistence
- [ ] Auto-redirect when logged out

**Companion Chat:**
- [ ] Send text message
- [ ] Receive AI response
- [ ] Voice input works
- [ ] Voice output works
- [ ] Companion animates
- [ ] Ambient sounds play

**Customization:**
- [ ] Change companion appearance
- [ ] Modify environment theme
- [ ] Adjust colors
- [ ] Settings persist
- [ ] Live preview works

**Voice Features:**
- [ ] Microphone permission
- [ ] Speech recognition
- [ ] Text-to-speech
- [ ] Voice settings apply
- [ ] Auto-speak toggle

**Sound System:**
- [ ] Browse sounds
- [ ] Preview playback
- [ ] Volume control
- [ ] Category filtering
- [ ] Search functionality

## 🚀 Deployment

### Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

Edge function environment:
```
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
```

### Build Commands

**Web Build:**
```bash
npm run build:web
```

Output: `dist/` directory

**Development:**
```bash
npm run dev
```

Starts Expo development server

### Deployment Platforms

**Recommended:**
- **Vercel** - Web hosting
- **Netlify** - Web hosting
- **Supabase** - Database + Edge Functions
- **Expo EAS** - Mobile builds (when ready)

## 📊 Performance Optimization

### Best Practices Implemented

**Component Optimization:**
- React.memo for expensive components
- useCallback for event handlers
- useMemo for computed values
- Lazy loading for heavy screens

**Animation Performance:**
- Native driver enabled
- 60fps target
- GPU-accelerated transforms
- Optimized re-renders

**Database Queries:**
- Indexed columns
- Limited result sets
- Efficient RLS policies
- Real-time only when needed

**Asset Management:**
- CDN for sounds
- Compressed images
- Lazy audio loading
- Cached responses

## 🐛 Debugging

### Common Issues

**Voice not working:**
- Check browser support
- Verify microphone permissions
- Test in incognito mode
- Check Web Speech API availability

**Sounds not playing:**
- Verify network connection
- Check browser autoplay policy
- Test audio context state
- Confirm CDN accessibility

**Database errors:**
- Check RLS policies
- Verify user authentication
- Review Supabase logs
- Test queries in dashboard

**Build failures:**
- Clear node_modules
- Delete lock file
- Reinstall dependencies
- Check TypeScript errors

### Debug Tools

**React Native Debugger:**
```bash
# Enable debug mode
npm run dev
# Press 'j' to open debugger
```

**Supabase Logs:**
- Dashboard → Logs
- Edge Function logs
- Database logs
- Auth logs

**Performance Monitoring:**
```typescript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Expensive operation after animations
});
```

## 📚 Additional Resources

### Documentation Links

- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Code Style Guide

**Naming Conventions:**
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case or PascalCase

**Import Order:**
1. React/React Native
2. Third-party libraries
3. Local components
4. Utils/helpers
5. Types
6. Styles

**Component Structure:**
```typescript
// 1. Imports
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export default function MyComponent({ title }: Props) {
  // 4. Hooks
  const { theme } = useTheme();

  // 5. State
  const [value, setValue] = useState('');

  // 6. Effects
  useEffect(() => {}, []);

  // 7. Handlers
  const handlePress = () => {};

  // 8. Render
  return <View />;
}

// 9. Styles
const styles = StyleSheet.create({});
```

---

*Technical Documentation v1.0.0*
*Last Updated: October 2025*
