# Companion AI Setup Guide

Your wellness companion AI now uses **Groq + Llama 3.1 70B** - a free, powerful AI that creates natural conversations with true memory!

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account (no credit card needed!)
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy your new API key

### Step 2: Add Your API Key to Supabase

The API key needs to be stored as a Supabase secret so the edge function can use it:

1. Go to your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions** → **Secrets**
4. Click **Add Secret**
5. Name: `GROQ_API_KEY`
6. Value: Paste your Groq API key
7. Click **Save**

### Step 3: Deploy the Edge Function

The edge function is already created in your project. Now we need to deploy it:

```bash
# Make sure you're in the project directory
npx supabase functions deploy ai-chat
```

That's it! Your companion AI is now ready to use.

---

## 🧠 What Makes This Special

### Real Memory System
- Buddy remembers your name, occupation, hobbies, goals, and concerns
- Memories are stored in Supabase and recalled naturally in conversation
- The more you chat, the better Buddy knows you

### Dynamic Personality
- Never uses the same greeting twice
- Responses vary based on context and history
- Feels like a real friend, not a chatbot

### Emotional Intelligence
- Detects sentiment (anxious, sad, happy, stressed)
- Asks thoughtful follow-up questions
- Provides support tailored to your situation

### Crisis Detection
- Automatically detects crisis language
- Provides immediate crisis resources
- Prioritizes user safety above all

---

## 💡 How It Works

1. **You chat with Buddy** - Natural conversation through the app
2. **Memories are extracted** - Important details (name, goals, concerns) are automatically saved
3. **Context is built** - Your conversation history + memories create rich context
4. **AI generates response** - Groq's Llama 3.1 70B creates empathetic, personalized replies
5. **Everything is saved** - Conversations and memories persist for future sessions

---

## 🎯 Key Features

### Varied Greetings
- 5+ different intro messages
- Never feels repetitive
- Always welcoming

### Memory Types
- **Facts**: Name, occupation, personal details
- **Interests**: Hobbies, passions, likes
- **Goals**: Things you're working towards
- **Concerns**: Current struggles or worries
- **Preferences**: What helps you feel better
- **Achievements**: Wins you've shared

### View Your Memories
- Tap the "Memories" tab to see what Buddy remembers
- Delete any memory you want
- See when each memory was created

---

## 📊 Groq Free Tier Limits

- **500,000 free tokens** to start
- **Llama 3.1 70B model** - extremely capable and empathetic
- Super fast responses (sub-second!)
- No credit card required

---

## 🔒 Privacy & Security

- Your API key is stored securely in Supabase secrets
- All conversations are private to your account
- Memories can be deleted anytime
- No data is shared with third parties

---

## 🛠 Troubleshooting

### "Groq API key not configured" error
→ Make sure you added `GROQ_API_KEY` as a Supabase secret

### Companion not responding
→ Check that the edge function deployed successfully
→ Verify your Groq API key is valid

### Want to use a different AI model?
→ Edit `/supabase/functions/ai-chat/index.ts`
→ Change the model name (e.g., `llama-3.1-8b-instant` for faster responses)

---

## 🎉 You're All Set!

Open the app and start chatting with Buddy. The more you talk, the better your companion becomes at supporting you!

Questions? The code is well-documented and easy to customize.
