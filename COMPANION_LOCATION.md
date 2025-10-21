# Where Does the Companion Appear?

## 🎯 Primary Location: Chat Screen

The animated companion appears prominently in the **Buddy chat screen** (`app/(tabs)/companion.tsx`).

### Visual Layout

```
┌─────────────────────────────────────┐
│  [Gradient Header]                  │
│                                     │
│  Buddy                    [Crisis]  │
│  Your Wellness Companion            │
│                                     │
│         ╭─────────╮                 │
│         │    🌟   │  ← COMPANION    │
│         │  (Orb)  │    (Animated)   │
│         ╰─────────╯                 │
│      "Tap me for a smile!"          │
│                                     │
├─────────────────────────────────────┤
│  [Ambient Sound Player]             │
│  🎵 Ocean Waves        [50%] [⏸]   │
├─────────────────────────────────────┤
│                                     │
│  [Chat Messages]                    │
│                                     │
│  ┌─────────────────────┐            │
│  │ Hi! How are you?    │ (You)      │
│  └─────────────────────┘            │
│                                     │
│      ┌─────────────────────┐        │
│      │ I'm here for you!   │ (Buddy)│
│      └─────────────────────┘        │
│                                     │
├─────────────────────────────────────┤
│  [Message Input]                    │
│  Type a message... [🎤] [Send]      │
└─────────────────────────────────────┘
```

## 📍 Exact Location Details

### Position in DOM Hierarchy

```
KeyboardAvoidingView (container)
└── LinearGradient (header)
    ├── View (title row)
    │   ├── View (title section)
    │   │   ├── Text "Buddy"
    │   │   └── Text "Your Wellness Companion"
    │   └── TouchableOpacity (crisis button)
    │       └── LifeBuoy Icon
    │
    └── View (companion section) ← HERE
        ├── AnimatedCompanion
        └── Text "Tap me for a smile!"
```

### Styling Details

**Container:**
- Centered horizontally (`alignItems: 'center'`)
- Margin top: 20px
- Margin bottom: 8px

**Companion Size:**
- Small: 80px
- Medium: 100px (default)
- Large: 140px

**Colors:**
- Primary: From user customization
- Secondary: From user customization
- Default: `#6366F1` (indigo)

## 🎬 Companion States & Animations

### Emotion States

The companion animates based on conversation context:

1. **Idle** (Default)
   - Gentle breathing animation
   - Soft glow pulse
   - Calm, resting state

2. **Listening** (When recording voice)
   - Attentive pulse
   - Focused energy
   - Shows it's processing input

3. **Speaking** (When AI responds)
   - Active movement
   - Dynamic animation
   - Indicates response being generated

4. **Happy** (Positive responses)
   - Joyful bounce
   - Bright colors
   - Celebratory feel

5. **Concerned** (Empathetic responses)
   - Calm, steady breathing
   - Softer glow
   - Supportive presence

6. **Celebrating** (Achievements)
   - Energetic spin
   - Particle effects
   - Confetti animation

### When Does It Change?

**Automatic Changes:**
- Voice input → "listening"
- AI generating response → "speaking"
- Positive sentiment detected → "happy"
- Concern detected → "concerned"
- Achievement earned → "celebrating"
- After interaction → returns to "idle"

**Manual Change:**
- Tap the companion → "happy" for 2 seconds

## 🔍 Additional Appearances

### 2. Appearance Customization Screen

Location: `app/(tabs)/companion-appearance.tsx`

```
┌─────────────────────────────────────┐
│  Customize Appearance               │
│                                     │
│  [Preview Section]                  │
│  ┌─────────────────────────┐        │
│  │                         │        │
│  │      ╭─────────╮        │        │
│  │      │   🌟    │        │        │
│  │      │  (Orb)  │ ← PREVIEW        │
│  │      ╰─────────╯        │        │
│  │                         │        │
│  │  [Test Happy]           │        │
│  │  [Test Concerned]       │        │
│  └─────────────────────────┘        │
│                                     │
│  [Customization Options]            │
│  Type: Orb                          │
│  Size: Medium                       │
│  Primary Color: 🎨                  │
│  Secondary Color: 🎨                │
└─────────────────────────────────────┘
```

**Purpose:** Live preview while customizing

**Features:**
- Shows real-time color changes
- Test different emotion animations
- See size variations
- Preview before saving

## 🎨 Customization Impact

### What Users Can Change

**Companion Type:**
- Current: Orb
- Coming: Animal (Cat, Dog, Bird)
- Coming: Humanoid

**Size Options:**
- Small (80px) - Subtle, less prominent
- Medium (100px) - Balanced, default
- Large (140px) - Bold, eye-catching

**Colors:**
- **Primary Color:** Main body color
- **Secondary Color:** Accent/glow color
- **Accent Color:** (Future: details, eyes, etc.)

**Where to Customize:**
- Profile tab
- → "Customize Appearance"
- → Make changes
- → See live preview
- → Changes save automatically

## 💡 Design Philosophy

### Why It's in the Header

**Visibility:**
- Always visible during conversation
- Doesn't get scrolled away
- Acts as conversation anchor

**Context:**
- Companion is the "speaker"
- Natural position for avatar
- Similar to video call UI

**Interaction:**
- Easy to tap for interaction
- Prominent but not intrusive
- Balances with content below

### Visual Hierarchy

```
1. Companion (Primary focus)
   ↓
2. Ambient Sound Player (Context)
   ↓
3. Chat Messages (Content)
   ↓
4. Input Field (Action)
```

## 🔧 Technical Details

### Component Props

```typescript
<AnimatedCompanion
  companionType="orb"           // Type of companion
  emotion="idle"                // Current emotion state
  primaryColor="#6366F1"        // Main color
  secondaryColor="#8B5CF6"      // Accent color
  size={100}                    // Size in pixels
  onPress={() => {}}            // Tap handler
/>
```

### File Location

**Component:** `components/AnimatedCompanion.tsx`
**Usage in Chat:** `app/(tabs)/companion.tsx` (lines 734-746)
**Usage in Preview:** `app/(tabs)/companion-appearance.tsx` (line 322)

### Animation System

**Library:** react-native-reanimated
**Performance:** 60fps, GPU-accelerated
**Triggers:** Emotion state changes
**Duration:** 1-3 seconds per animation

## 📱 Responsive Behavior

### Different Screen Sizes

**Small Screens:**
- Companion scales proportionally
- Header remains prominent
- Sufficient space maintained

**Large Screens:**
- More breathing room
- Enhanced visual presence
- Better animation visibility

**Tablet/Desktop:**
- Centered in wider viewport
- Maintains aspect ratio
- Optimized padding

## 🎯 User Discovery

### How Users Find It

1. **First Time:**
   - Sign up → redirected to chat
   - Companion greeting appears
   - Obvious presence in header

2. **Onboarding Hints:**
   - "Tap me for a smile!" text
   - Animated to draw attention
   - Interactive response on tap

3. **Natural Flow:**
   - Chat tab in navigation
   - "Buddy" label is clear
   - Icon indicates companion

### Making It More Discoverable

**Current:**
- ✅ Prominent header position
- ✅ Animated to catch eye
- ✅ Interactive hint text
- ✅ Color contrasts with background

**Potential Enhancements:**
- 🔲 First-time tutorial overlay
- 🔲 Animated arrow on first visit
- 🔲 "Try tapping me!" message
- 🔲 Subtle glow when idle

## 📊 User Testing Insights

### Expected User Behavior

**First Interaction:**
1. Opens chat tab
2. Sees animated companion
3. Reads hint text
4. Taps companion
5. Sees happy animation
6. Understands it's interactive

**Regular Usage:**
1. Opens chat
2. Glances at companion
3. Reads its emotion
4. Understands conversation mood
5. Interacts via text/voice

### Common Questions

**Q: "Where is my companion?"**
A: In the Buddy (chat) tab, at the top of the screen in the colored header.

**Q: "How do I make it bigger?"**
A: Profile → Customize Appearance → Size → Large

**Q: "Why isn't it moving?"**
A: It has subtle idle animation. Try tapping it or starting a conversation!

**Q: "Can I change its look?"**
A: Yes! Profile → Customize Appearance to change colors, size, and type.

## 🎨 Visual Examples

### Companion in Different Themes

**Light Theme:**
```
Gradient: Light blue → Light purple
Companion: Colorful, stands out
Background: White/light gray
```

**Dark Theme:**
```
Gradient: Deep blue → Deep purple
Companion: Glowing, ethereal
Background: Dark gray/black
```

**Custom Themes:**
```
User's chosen colors throughout
Companion colors fully customizable
Harmonious with theme selection
```

## 🚀 Future Enhancements

### Planned Improvements

1. **More Companion Types**
   - Animal: Cat, Dog, Bird
   - Humanoid: Customizable avatar
   - Robot: Mechanical companion

2. **Enhanced Animations**
   - More emotion variations
   - Smoother transitions
   - Interactive gestures

3. **3D Companion**
   - Three.js integration
   - Rotate/view from angles
   - More realistic presence

4. **Companion Memory**
   - Remembers preferences
   - References past conversations
   - Personalized reactions

## 📝 Summary

**The companion appears in the chat screen header, prominently displayed and animated to provide an engaging, emotional presence throughout your wellness journey.**

**Location:** Buddy tab → Top of screen in gradient header
**Size:** Customizable (80-140px)
**Interactive:** Tap for happy animation
**States:** 6 emotion animations
**Customizable:** Colors, size, type (more coming)

---

*For more details, see:*
- `COMPANION_FEATURES.md` - Feature documentation
- `ANIMATED_COMPANION_SYSTEM.md` - Animation details
- `USER_GUIDE.md` - User instructions
