# 🗺️ Wellness Companion App - Roadmap

## ✅ Completed Features

### Core Companion System
- ✅ Animal companions (cat, dog, bird, bunny)
- ✅ Emotion-based animations (idle, listening, speaking, happy, concerned, excited, thinking)
- ✅ Emoji indicators floating above companion
- ✅ Smooth Tamagotchi-style animations
- ✅ Colored glow effects based on emotion
- ✅ 3D plugin framework ready (see `ADDING_3D_COMPANION.md`)

### Communication
- ✅ AI chat with companion
- ✅ Voice input (speech-to-text)
- ✅ Voice output (text-to-speech)
- ✅ Auto-speak responses
- ✅ Conversation memory system
- ✅ Sentiment analysis

### Community Features
- ✅ Achievement feed (auto-refreshes 10-60 sec)
- ✅ Share accomplishments
- ✅ Reaction system (heart, thumbs up, sparkles)
- ✅ Moderation queue
- ✅ User display names

### Customization
- ✅ 4 animal types to choose from
- ✅ Size options (small, medium, large)
- ✅ Color customization (primary, secondary, accent)
- ✅ 6 environment themes (cozy, garden, office, beach, mountain, space)
- ✅ Environment-based backgrounds in chat
- ✅ Ambient sounds per environment

### Database
- ✅ User profiles
- ✅ Companion appearance storage
- ✅ Companion environment storage
- ✅ Conversation history
- ✅ Memory system
- ✅ Achievements system
- ✅ Goals tracking
- ✅ User stats and streaks

---

## 🚧 In Progress

### Crisis Support
- 🔨 Crisis hotline quick access button
- 🔨 Emergency resources page improvements

### Feed Notifications
- 🔨 Sliding notification boxes for new posts
- 🔨 Smooth animations (slide in from right, pause, slide out)

---

## 📋 Next Up (Priority Order)

### 1. Crisis Chat Button ⭐⭐⭐
**Priority: HIGH**

Add a prominent button that connects to crisis hotlines:
- Button in chat interface
- Direct link to crisis text line (text HOME to 741741)
- Direct call to 988 (Suicide & Crisis Lifeline)
- Emergency resources accessible immediately

**Estimated effort:** 2-3 hours

---

### 2. Feed Notification Pop-ups ⭐⭐⭐
**Priority: HIGH**

**Description:**
When new posts/achievements appear in feed:
- Notification box slides in from right side
- Shows brief preview (username + achievement/post)
- Stays for 3-5 seconds
- Slides back out
- Tappable to go to community feed

**Technical approach:**
- Use React Native Animated API
- Store last seen post ID in state
- Compare with new posts on refresh
- Trigger animation for new items

**Estimated effort:** 4-6 hours

---

### 3. Virtual Room Editor 🏠⭐⭐
**Priority: MEDIUM-HIGH**

**Concept:** Animal Crossing-style room where companion lives

**Features:**
- Top-down or side-view 2D room
- Grid-based placement system (like Sims)
- Draggable furniture/decorations
- Companion appears in room
- Save room layout to database
- Unlock decorations via achievements

**Implementation options:**

**Option A: 2D Grid System (Doable now)**
```typescript
// Room grid: 8x8 tiles
// Each decoration has:
{
  id: 'plant_001',
  emoji: '🪴',
  x: 2,
  y: 3,
  size: 1, // 1x1, 2x2, etc.
  unlocked: true
}
```

**Option B: Custom sprites (Need artist)**
- Commission pixel art decorations
- More polished look
- Higher cost

**Database schema:**
```sql
-- environment_decorations table (already exists!)
- user_id
- decoration_id
- position_x
- position_y
- is_visible

-- decoration_catalog table (already exists!)
- id
- name
- category (furniture, plants, art, etc.)
- unlock_requirement
- emoji/thumbnail
```

**Estimated effort:**
- Option A (emoji-based): 8-12 hours
- Option B (custom art): 20-30 hours + art commission

---

### 4. Background Music System 🎵⭐⭐
**Priority: MEDIUM**

**Concept:** Lofi/chill music for relaxation sessions

**Features:**
- Music player in wellness/sounds screen
- Downloadable music packs
- Stream from URL or local storage
- Volume control
- Playlist management

**Size management:**
```
Core app: ~15-20 MB
Music Pack 1 (Lofi Beats): ~25 MB (5 tracks)
Music Pack 2 (Nature Sounds): ~20 MB (10 tracks)
Music Pack 3 (Piano): ~30 MB (6 tracks)
```

**Technical approach:**
- Use expo-av for playback
- Store music URLs in Supabase
- Download to device on demand
- Allow deletion to free space
- Track which packs are installed

**Database schema:**
```sql
-- music_packs table
- id
- name
- description
- file_size_mb
- track_count
- download_url (Supabase Storage)
- is_free
- price (future monetization)

-- user_downloaded_music table
- user_id
- music_pack_id
- downloaded_at
```

**Music sourcing options:**
1. **Free options:**
   - YouTube Audio Library
   - Free Music Archive
   - Incompetech (royalty-free)

2. **Paid options:**
   - Epidemic Sound
   - Artlist
   - Commission original tracks

3. **User-generated:**
   - Allow users to upload (moderation needed)

**Estimated effort:** 10-15 hours + music licensing

---

### 5. Companion Accessories System 👒⭐
**Priority: MEDIUM-LOW**

**Concept:** Dress up your companion (like Neko Atsume)

**Implementation options:**

**Option A: Emoji overlays (Doable now)**
```typescript
accessories = {
  hat: '🎩',      // Top of animal
  glasses: '👓',  // On face
  bow: '🎀',      // Near head
  collar: '🦴'    // Around neck
}
```

**Option B: Custom SVG (Better quality)**
- Design SVG accessories
- Position dynamically based on animal type
- More professional look

**Option C: AI-generated (Experimental)**
- Use Stable Diffusion API
- Generate custom accessories
- User prompts: "wizard hat" → generates sprite
- Expensive (API costs)

**Unlocking system:**
- Earn via achievements
- Purchase with points
- Special event items
- Daily login rewards

**Database schema:**
```sql
-- accessory_catalog table
- id
- name
- category (hat, glasses, collar, etc.)
- emoji/svg/image_url
- unlock_requirement
- rarity (common, rare, legendary)

-- user_accessories table
- user_id
- accessory_id
- unlocked_at
- is_equipped
```

**Estimated effort:**
- Option A: 6-8 hours
- Option B: 15-20 hours + design
- Option C: 20-30 hours + API costs

---

## 🔮 Future Ideas

### Social Features
- Friend system
- Visit friends' companion rooms
- Send gifts
- Group challenges
- Leaderboards

### Gamification
- Daily quests
- Streak rewards
- Level system for companion
- Evolution/growth system
- Mini-games with companion

### Wellness Tools
- Mood journal with AI insights
- Breathing exercises with companion
- Guided meditation
- Sleep tracker
- Habit tracker

### Monetization (Optional)
- Premium themes
- Exclusive accessories
- Music packs
- Ad-free experience
- Custom companion designs

### AR Features (Advanced)
- View companion in real world
- AR room decoration
- Photo mode with companion

---

## 📊 Size Estimates

### Current App Size
- Base app: ~15-20 MB
- With all current features: ~20-25 MB

### With Planned Features
- + Room editor (emoji-based): +2-3 MB
- + Music system (core): +3-5 MB
- + Music Pack 1: +25 MB (optional download)
- + Music Pack 2: +20 MB (optional download)
- + Accessories (emoji): +1-2 MB
- + Accessories (custom art): +5-10 MB

**Total max size:** ~35-40 MB (without music packs)
**With all music downloaded:** ~85-90 MB

**Mobile app size is reasonable!** Most apps are 50-200 MB.

---

## 🎯 Suggested Development Order

### Phase 1: Safety & Core UX (1-2 weeks)
1. Crisis chat button ⭐⭐⭐
2. Feed notifications ⭐⭐⭐
3. Bug fixes and polish

### Phase 2: Engagement (2-3 weeks)
4. Virtual room editor (emoji-based) ⭐⭐
5. Companion accessories (emoji-based) ⭐
6. Daily quests/challenges

### Phase 3: Content & Polish (2-3 weeks)
7. Music system + 1-2 free packs ⭐⭐
8. More decorations/accessories
9. Improved animations

### Phase 4: Advanced Features (3-4 weeks)
10. Custom art for room/accessories
11. Friend system
12. AI-generated accessories (experimental)

---

## 💡 Technical Debt / Improvements

- [ ] Add loading states everywhere
- [ ] Error handling improvements
- [ ] Offline mode support
- [ ] Performance optimization for large conversation histories
- [ ] Image optimization
- [ ] Code splitting for faster load times
- [ ] E2E testing setup
- [ ] Analytics integration

---

## 🤔 Open Questions

1. **Music licensing:** Which approach for sourcing music?
2. **Room editor:** 2D grid or free placement?
3. **Accessories:** Emoji, SVG, or AI-generated?
4. **Monetization:** Free with optional purchases, or premium features?
5. **3D companions:** Invest in Three.js or wait for community plugins?
6. **Platform priority:** Web, iOS, or Android first?

---

## 📝 Notes

- Database tables already support decorations and accessories
- Plugin system ready for 3D companions
- Environment system can be extended easily
- Achievement system can unlock any content type
- Community features working well

**Current state:** MVP is solid, ready for next feature set!
