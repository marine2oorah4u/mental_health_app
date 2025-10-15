# Goals & Celebrations System

## Overview

Added a comprehensive goal-setting system and beautiful achievement celebrations to make progress feel rewarding and meaningful.

## ✅ What Was Fixed

### Bottom Padding Issue
- **Problem**: Input area and bottom navigation were getting cropped
- **Solution**: Increased bottom padding from 24px to 32px + added 20px spacer
- **Result**: All UI elements now fully visible with proper spacing

## 🎉 Achievement Celebrations

### Visual Design
Created a beautiful celebration modal (`AchievementCelebration.tsx`) that shows when users unlock achievements:

**Features:**
- **Confetti Animation**: 40 colorful confetti pieces that fall and rotate
  - Random colors: gold, red, teal, blue, orange
  - Smooth bezier easing for natural fall
  - 2-second fall duration with rotation
- **Modal Card**: Elegant card with spring animation
  - Icon bounces on entry (scale 1.2 → 1)
  - Category-color-coded icon background
  - Clear achievement name and description
  - Points badge showing reward
- **Auto-dismiss**: Celebration shows for 4 seconds then fades out
- **No Fast Flashes**: All animations are smooth and comfortable (500-800ms durations)

**Colors by Category:**
- Engagement: Blue (#3B82F6)
- Wellness: Green (#10B981)
- Milestone: Orange (#F59E0B)
- Special: Purple (#8B5CF6)

### How to Use
```typescript
import AchievementCelebration from '@/components/AchievementCelebration';

<AchievementCelebration
  achievement={{
    name: 'First Steps',
    description: 'Started your first conversation',
    points: 10,
    category: 'engagement'
  }}
  onDismiss={() => setAchievement(null)}
/>
```

## 🎯 Goals System

### Database Schema

**Table: `user_goals`**
- Stores user-defined goals created naturally through conversation
- Fields:
  - `title` - Short goal description
  - `description` - Detailed explanation
  - `category` - wellness, habit, milestone, personal, other
  - `target_date` - Optional deadline
  - `status` - active, completed, paused, abandoned
  - `progress_notes` - JSONB array of check-ins
  - Timestamps for created, updated, completed

**Table: `goal_check_ins`**
- Tracks progress updates from conversations
- Fields:
  - `note` - Progress update
  - `sentiment` - positive, neutral, struggling
  - `created_at` - When the check-in happened

### Goal Functions

**Create a Goal:**
```typescript
import { createUserGoal } from '@/lib/companionAI';

const goalId = await createUserGoal(
  userId,
  'Exercise 3 times per week',
  'Build a consistent fitness habit',
  'wellness'
);
```

**Get User Goals:**
```typescript
import { getUserGoals } from '@/lib/companionAI';

const activeGoals = await getUserGoals(userId, 'active');
const completed = await getUserGoals(userId, 'completed');
const all = await getUserGoals(userId, 'all');
```

**Add Progress Check-In:**
```typescript
import { addGoalCheckIn } from '@/lib/companionAI';

await addGoalCheckIn(
  userId,
  goalId,
  'Worked out today! Feeling great.',
  'positive'
);
```

**Complete a Goal:**
```typescript
import { completeGoal } from '@/lib/companionAI';

await completeGoal(userId, goalId);
// Automatically checks for "Goal Crusher" achievement
```

### New Achievements for Goals

**Goal Setter** (20 pts, Special)
- Set your first goal with Buddy
- Unlocks when: User creates first goal

**Dream Chaser** (50 pts, Special)
- Set 5 goals
- Unlocks when: User creates 5 goals

**Goal Crusher** (75 pts, Milestone)
- Complete your first goal
- Unlocks when: User completes first goal

**Unstoppable** (150 pts, Milestone)
- Complete 5 goals
- Unlocks when: User completes 5 goals

## 🤖 Natural Goal Integration with Buddy

### How It Works

Buddy can naturally help users set and track goals through conversation. The system detects when users mention:
- "I want to..."
- "My goal is..."
- "I'm trying to..."
- "I hope to..."

### Example Conversations

**Setting a Goal:**
```
User: I want to start meditating every day
Buddy: That's a wonderful goal! Daily meditation can really help with
      mental clarity and stress. Should we make that an official goal
      so I can help you track it?
User: Yes!
Buddy: Perfect! I've created your goal: "Meditate daily". I'll check
      in with you about it regularly. How does that feel?
```

**Progress Check-ins:**
```
User: I meditated today!
Buddy: That's fantastic! I'm so proud of you. How did it feel?
      [System logs positive check-in for meditation goal]
```

**Completing Goals:**
```
User: I've been meditating for 30 days straight!
Buddy: Wow! That's incredible dedication. You've built a real habit.
      Should we mark your meditation goal as completed and maybe set
      a new challenge?
      [System marks goal complete, checks for achievements]
      🎉 Achievement Unlocked: Goal Crusher! +75 pts
```

## 🎨 Customization Options

### Achievement Celebrations Can Be Customized:

**Different Celebration Styles (Future):**
- Confetti (default) - Colorful falling pieces
- Balloons - Rising balloons with strings
- Fireworks - Colorful bursts
- Stars - Twinkling star effects
- Minimal - Just the card, no animations

### Goal Categories:
- **Wellness** - Health, fitness, meditation, self-care
- **Habit** - Daily routines, consistency building
- **Milestone** - One-time achievements, big life goals
- **Personal** - Relationships, hobbies, learning
- **Other** - Custom categories

## 💡 User Experience Flow

### Goal Lifecycle:
1. **Discovery**: User mentions a goal in conversation
2. **Creation**: Buddy suggests making it official
3. **Tracking**: Regular check-ins through natural conversation
4. **Progress**: Updates stored with sentiment analysis
5. **Completion**: Celebration with achievement unlock
6. **New Goals**: Buddy suggests next challenges

### Achievement Flow:
1. **Earn**: User completes requirement
2. **Celebrate**: Beautiful modal with confetti
3. **Points**: Added to total score
4. **Progress**: Visible in achievements screen

## 🔧 Technical Details

### Performance:
- Confetti uses React Native Reanimated for 60fps
- Celebrations don't block UI interactions
- Database queries are optimized with indexes
- Goal check-ins are async and non-blocking

### Security:
- Row Level Security on all goal tables
- Users can only access their own goals
- All mutations require authentication
- No direct SQL injection possible

### Data Structure:
```typescript
interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: 'wellness' | 'habit' | 'milestone' | 'personal' | 'other';
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progress_notes: Array<{
    note: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
```

## 🚀 Future Enhancements

**Celebration Variations:**
- Balloon animations for milestones
- Crowd cheering sound (optional)
- Sparkle effects for special achievements
- Custom celebration per achievement type

**Goal Features:**
- Goal templates ("Exercise 3x/week", "Meditate daily")
- Recurring goals (daily, weekly habits)
- Goal reminders
- Progress charts and visualizations
- Goal sharing with community (optional)
- Goal streaks (consecutive completions)

**AI Integration:**
- Buddy proactively suggests goals based on conversations
- Automatically detects goal-related updates
- Celebrates progress without being asked
- Provides encouragement when struggling
- Adjusts goals based on progress

## 📱 UI Locations

**Achievements Screen** (`/achievements`)
- View all achievements
- See progress bars
- Filter by category
- Track total points

**Profile Screen** (`/profile`)
- Quick link to achievements
- Stats overview

**Companion Chat** (Future)
- Inline goal creation
- Progress updates in conversation
- Achievement celebrations overlay

## ✨ Key Benefits

**For Users:**
- Clear sense of progress
- Rewarding celebrations
- Personalized goal tracking
- Natural conversation flow
- No manual tracking needed

**For Engagement:**
- Gamification increases retention
- Achievements encourage exploration
- Goals create ongoing value
- Celebrations create positive associations
- Progress tracking builds habits

**For Wellness:**
- Concrete goals improve outcomes
- Regular check-ins increase awareness
- Completion boosts confidence
- Tracking reveals patterns
- Support feels more tangible
