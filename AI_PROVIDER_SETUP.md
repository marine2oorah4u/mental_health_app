# AI Provider Setup Guide

Buddy uses multiple AI providers to ensure reliable, natural conversations. The system automatically tries providers in order until one succeeds - **users never see which AI is responding**.

## How It Works

```
User Message
    ↓
Try Groq (Primary - Fastest)
    ↓ (if fails)
Try Gemini (Backup - Also Free)
    ↓ (if both fail)
Smart Contextual Fallback
    ↓
Response saved to Supabase
```

**All conversation history, memories, and state are stored in Supabase** - completely independent of which AI provider responds. This means:

- ✅ Seamless switching between providers
- ✅ Conversation continuity preserved
- ✅ Memories work across all providers
- ✅ User never knows which AI responded
- ✅ No data loss if a provider fails

## Setup Instructions

### 1. Groq (Primary - Free)

**Speed**: ⚡ Extremely fast (~500ms response time)
**Quality**: 🎯 Very good with Llama 3.1 70B
**Free Tier**: 30 requests/min, 14,400/day

1. Go to: https://console.groq.com/keys
2. Create account (free)
3. Generate API key
4. Add to `.env`:
   ```
   EXPO_PUBLIC_GROQ_API_KEY=your_key_here
   ```

### 2. Google Gemini (Backup - Free)

**Speed**: ⚡ Fast (~1-2s response time)
**Quality**: 🎯 Excellent with Gemini 1.5 Flash
**Free Tier**: 15 requests/min, 1500/day

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Add to `.env`:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
   ```

## Testing the Setup

Once you've added the API keys, Buddy will automatically:

1. Try Groq first (fastest)
2. If Groq fails, try Gemini
3. If both fail, use smart contextual fallback

Check the console logs to see which provider responded:
- `✓ Groq response received`
- `✓ Gemini response received`

## FAQ

**Q: Do I need both API keys?**
A: No! You only need one. But having both provides better reliability.

**Q: Which one should I prioritize?**
A: Groq is faster, so it's tried first. But Gemini is also excellent.

**Q: Will users know which AI is responding?**
A: No! The system is completely transparent to users.

**Q: What happens if both fail?**
A: Buddy falls back to smart contextual responses that detect keywords and respond appropriately.

**Q: Is conversation continuity maintained when switching providers?**
A: Yes! All history, memories, and state are stored in Supabase, not with the AI provider.

**Q: Are these really free?**
A: Yes! Both have generous free tiers sufficient for most applications.

## Cost Comparison

| Provider | Free Tier | Response Time | Quality |
|----------|-----------|---------------|---------|
| Groq | 14,400 req/day | ~500ms | Very Good |
| Gemini | 1,500 req/day | ~1-2s | Excellent |
| Fallback | Unlimited | Instant | Context-aware |

## Advanced: Adding More Providers

To add additional providers (OpenRouter, Together AI, etc.):

1. Add API key to `.env`
2. Add to `lib/config.ts`
3. Add try/catch block in `lib/companionAI.ts` after Gemini
4. Follow the same pattern for automatic fallback

The system is designed to be extensible!
