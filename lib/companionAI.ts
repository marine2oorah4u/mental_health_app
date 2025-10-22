import { supabase } from './supabase';
import { config } from './config';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Memory {
  id: string;
  memory_type: string;
  key: string;
  value: string;
  context?: string;
  importance: number;
  created_at: string;
}

interface ConversationState {
  onboarding_completed: boolean;
  current_stage: string;
  last_question_asked?: string;
  pending_memory_key?: string;
  conversation_depth: number;
}

// In-memory state for anonymous users
let anonymousConversationState: ConversationState = {
  onboarding_completed: false,
  current_stage: 'greeting',
  conversation_depth: 0
};

let anonymousMemories: Memory[] = [];

// Extract potential memories from user messages
function extractMemories(message: string, previousQuestion?: string): Array<{type: string, key: string, value: string, importance: number}> {
  const msg = message.toLowerCase().trim();
  const originalMessage = message.trim();
  const memories: Array<{type: string, key: string, value: string, importance: number}> = [];

  // Name extraction - more flexible
  if (previousQuestion?.toLowerCase().includes('name') || previousQuestion?.toLowerCase().includes('call you')) {
    // If we asked for name, treat the response as their name
    const cleanName = originalMessage.replace(/^(i'm|im|i am|my name is|call me|it's|its|just)\s+/i, '').trim();
    // Accept the name if it's reasonable length (allow spaces for full names)
    if (cleanName && cleanName.length > 0 && cleanName.length < 30) {
      memories.push({ type: 'fact', key: 'name', value: cleanName, importance: 5 });
    }
  }

  // Job/occupation - expanded patterns
  if (msg.match(/\b(work as|job is|i'm a|im a|i am a|working as|employed as)\b/)) {
    const jobMatch = msg.match(/(?:work(?:ing)? as|job is|i'?m a|i am a|employed as)\s+(?:a\s+)?([a-z][a-z\s-]+?)(?:\.|,|and|but|$)/i);
    if (jobMatch && jobMatch[1].length < 40) {
      memories.push({ type: 'fact', key: 'occupation', value: jobMatch[1].trim(), importance: 4 });
    }
  }

  // Hobbies/interests - better extraction
  if (msg.match(/\b(like|love|enjoy|into|hobby|hobbies|passion)\b/)) {
    const hobbyMatch = msg.match(/(?:like|love|enjoy|into|hobby is|hobbies are|passion is)\s+(?:to\s+)?([a-z][a-z\s,&-]+?)(?:\.|and|but|because|$)/i);
    if (hobbyMatch && hobbyMatch[1].length > 2 && hobbyMatch[1].length < 50) {
      const hobby = hobbyMatch[1].trim().replace(/\s*,\s*$/, '');
      memories.push({ type: 'interest', key: `hobby_${Date.now()}`, value: hobby, importance: 3 });
    }
  }

  // Struggles/concerns - enhanced
  if (msg.match(/\b(struggling|dealing|problem|issue|difficult|hard time|trouble)\b/)) {
    const concernMatch = msg.match(/(?:struggling|dealing|problem|issue|difficult|hard time|trouble)\s+(?:with|is)?\s+([a-z][a-z\s-]+?)(?:\.|,|and|but|because|$)/i);
    if (concernMatch && concernMatch[1].length < 50) {
      memories.push({ type: 'concern', key: `concern_${Date.now()}`, value: concernMatch[1].trim(), importance: 5 });
    }
  }

  // Goals - better patterns
  if (msg.match(/\b(want to|trying to|goal|hoping to|planning to|wish)\b/)) {
    const goalMatch = msg.match(/(?:want to|trying to|goal is to|hoping to|planning to|wish to|wish i could)\s+([a-z][a-z\s-]+?)(?:\.|,|and|but|because|$)/i);
    if (goalMatch && goalMatch[1].length < 50) {
      memories.push({ type: 'goal', key: `goal_${Date.now()}`, value: goalMatch[1].trim(), importance: 4 });
    }
  }

  // Preferences - NEW
  if (msg.match(/\b(prefer|helps me|makes me feel|calms me|relaxes me)\b/)) {
    const prefMatch = msg.match(/(?:prefer|helps me|makes me feel better|calms me|relaxes me)\s+(?:when|if|to)?\s*([a-z][a-z\s-]+?)(?:\.|,|and|but|$)/i);
    if (prefMatch && prefMatch[1].length < 40) {
      memories.push({ type: 'preference', key: `preference_${Date.now()}`, value: prefMatch[1].trim(), importance: 4 });
    }
  }

  // Family/relationships - NEW
  if (msg.match(/\b(my\s+(?:mom|dad|mother|father|sister|brother|partner|wife|husband|friend|child|kid|son|daughter))\b/i)) {
    const relationMatch = msg.match(/my\s+(mom|dad|mother|father|sister|brother|partner|wife|husband|friend|child|kid|son|daughter)\s+(?:is|was|has|named|called)?\s*([a-z][a-z\s-]*?)(?:\.|,|and|but|$)/i);
    if (relationMatch) {
      const relation = relationMatch[1];
      const detail = relationMatch[2]?.trim();
      if (detail && detail.length > 2 && detail.length < 30) {
        memories.push({ type: 'fact', key: `family_${relation}`, value: detail, importance: 4 });
      }
    }
  }

  return memories;
}

async function getMemories(userId: string): Promise<Memory[]> {
  if (userId === 'anonymous') return anonymousMemories;

  const { data, error } = await supabase
    .from('companion_memories')
    .select('*')
    .eq('user_id', userId)
    .order('importance', { ascending: false })
    .order('last_referenced', { ascending: false });

  if (error || !data) return [];
  return data;
}

async function saveMemory(userId: string, memory: {type: string, key: string, value: string, importance: number}) {
  if (userId === 'anonymous') {
    // Check if memory already exists
    const existingIndex = anonymousMemories.findIndex(m => m.key === memory.key);
    if (existingIndex >= 0) {
      // Update existing
      anonymousMemories[existingIndex] = {
        ...anonymousMemories[existingIndex],
        value: memory.value,
        importance: memory.importance
      };
    } else {
      // Create new
      anonymousMemories.push({
        id: `anon_${Date.now()}`,
        memory_type: memory.type,
        key: memory.key,
        value: memory.value,
        importance: memory.importance,
        created_at: new Date().toISOString()
      });
    }
    return;
  }

  // Check if memory already exists
  const { data: existing } = await supabase
    .from('companion_memories')
    .select('id, reference_count')
    .eq('user_id', userId)
    .eq('key', memory.key)
    .maybeSingle();

  if (existing) {
    // Update existing
    await supabase
      .from('companion_memories')
      .update({
        value: memory.value,
        last_referenced: new Date().toISOString(),
        reference_count: (existing.reference_count || 0) + 1
      })
      .eq('id', existing.id);
  } else {
    // Create new
    await supabase
      .from('companion_memories')
      .insert({
        user_id: userId,
        memory_type: memory.type,
        key: memory.key,
        value: memory.value,
        importance: memory.importance
      });
  }
}

async function getConversationState(userId: string): Promise<ConversationState> {
  if (userId === 'anonymous') {
    return anonymousConversationState;
  }

  const { data, error } = await supabase
    .from('companion_conversation_state')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    // Create initial state
    const newState = {
      user_id: userId,
      onboarding_completed: false,
      current_stage: 'greeting',
      conversation_depth: 0
    };

    await supabase.from('companion_conversation_state').insert(newState);

    return {
      onboarding_completed: false,
      current_stage: 'greeting',
      conversation_depth: 0
    };
  }

  return data;
}

async function updateConversationState(userId: string, updates: Partial<ConversationState>) {
  if (userId === 'anonymous') {
    anonymousConversationState = {
      ...anonymousConversationState,
      ...updates
    };
    return;
  }

  await supabase
    .from('companion_conversation_state')
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString()
    });
}

function generateConversationalResponse(
  message: string,
  state: ConversationState,
  memories: Memory[]
): { response: string, newState: Partial<ConversationState> } {
  const msg = message.toLowerCase().trim();

  // CRISIS DETECTION - ALWAYS FIRST
  if (msg.includes('crisis') || msg.includes('emergency') || msg.includes('hurt myself') ||
      msg.includes('suicide') || msg.includes('end it') || msg.includes('kill myself') ||
      msg.includes('want to die')) {
    return {
      response: "I'm really concerned about you. Please reach out for help immediately:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nYou matter, and help is available 24/7. Please don't face this alone.",
      newState: {}
    };
  }

  const userName = memories.find(m => m.key === 'name')?.value;

  // ONBOARDING FLOW
  if (!state.onboarding_completed) {
    switch (state.current_stage) {
      case 'greeting':
        // If user sent a message while in greeting stage, treat it as their name
        // This happens when they respond to the initial greeting
        if (message.trim().length > 0) {
          const possibleName = message.trim();
          // Use the message as their name if it's reasonable
          if (possibleName.length < 30 && possibleName.length > 0 && !possibleName.includes('\n')) {
            return {
              response: `It's great to meet you, ${possibleName}! I'm really glad you're here.\n\nI want to understand how I can best support you. What brings you here today? What's been on your mind lately?`,
              newState: {
                current_stage: 'learning_about',
                last_question_asked: 'What brings you here?',
                conversation_depth: 2
              }
            };
          }
        }

        // Otherwise, send the greeting
        return {
          response: "Hi! I'm Buddy, your wellness companion. I'm here to support you, listen without judgment, and help you on your mental health journey.\n\nI'd love to get to know you a bit. What's your name?",
          newState: {
            current_stage: 'learning_name',
            last_question_asked: 'What\'s your name?',
            pending_memory_key: 'name',
            conversation_depth: 1
          }
        };

      case 'learning_name':
        // Accept any reasonable response as the name
        const possibleName = message.trim();

        // Extract from common patterns first
        const nameMatch = msg.match(/(?:i'm|im|i am|my name is|call me|it's|its|just call me)\s+([a-z]+)/i);
        const extractedName = nameMatch ? nameMatch[1] : possibleName;

        if (extractedName && extractedName.length < 30 && extractedName.length > 0 && !extractedName.includes('\n')) {
          return {
            response: `It's great to meet you, ${extractedName}! I'm really glad you're here.\n\nI want to understand how I can best support you. What brings you here today? What's been on your mind lately?`,
            newState: {
              current_stage: 'learning_about',
              last_question_asked: 'What brings you here?',
              conversation_depth: 2
            }
          };
        } else {
          return {
            response: "I'd love to know what to call you. What's your name?",
            newState: { conversation_depth: state.conversation_depth + 1 }
          };
        }

      case 'learning_about':
        // Check for confusion/questions first
        if (msg.match(/^(huh|what|explain|why|how)[\?]?$/)) {
          return {
            response: "No pressure at all! I asked what brings you here today because I want to understand how I can best support you.\n\nSome people come here feeling stressed, anxious, or just needing someone to talk to. Others want to explore wellness tools like breathing exercises or journaling.\n\nWhat sounds most helpful to you right now?",
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        }

        // Check for testing/casual conversation
        if (msg.includes('test') || msg.includes('improv') || msg.includes('just checking') || msg.includes('how bout you') || msg.includes('how about you') || msg.includes('functionality')) {
          return {
            response: "I appreciate you checking in! I'm here and ready to support you. While testing is fine, I'm really here to help with your wellness journey.\n\nWhen you're ready, feel free to share what's really on your mind. Is there anything you'd like to talk about?",
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        }

        // Check for work/job/career mentions
        if (msg.includes('work') || msg.includes('job') || msg.includes('career') || msg.includes('working')) {
          return {
            response: "Work can definitely weigh on us. I'm here to listen.\n\nWhat specifically about work has been on your mind? Is it stress, relationships with colleagues, or something else?",
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        }

        // Check for relationship mentions
        if (msg.includes('friend') || msg.includes('family') || msg.includes('relationship') || msg.includes('partner')) {
          return {
            response: "Relationships can be complex and sometimes challenging. Thank you for opening up about this.\n\nWhat's been happening that's been on your mind?",
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        }

        // Check for emotional state keywords
        if (msg.includes('stress') || msg.includes('anxious') || msg.includes('worried')) {
          return {
            response: "It sounds like you're dealing with a lot of stress right now. That can be really overwhelming.\n\nHow long have you been feeling this way?",
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        }

        // User shares something substantial
        if (msg.length > 10) {
          return {
            response: `Thank you for sharing that with me. I want to understand better so I can support you.\n\nCan you tell me more about what's been going on?`,
            newState: {
              current_stage: 'deepening',
              conversation_depth: state.conversation_depth + 1
            }
          };
        } else {
          // Very short response
          return {
            response: "I'm here to listen whenever you're ready. What's been on your mind?",
            newState: { conversation_depth: state.conversation_depth + 1 }
          };
        }

      case 'deepening':
        if (state.conversation_depth >= 4) {
          const closingName = userName ? `, ${userName}` : '';
          return {
            response: `I really appreciate you sharing all of this with me${closingName}. I'm here for you whenever you need support.\n\nRemember, I'm learning about what helps you specifically. The more we talk, the better I can support you. Feel free to come back anytime.\n\nHow are you feeling right now?`,
            newState: {
              onboarding_completed: true,
              current_stage: 'ongoing',
              conversation_depth: 0
            }
          };
        } else {
          // Provide contextual follow-up based on what they said
          // Check for short/dismissive responses
          if (msg.length < 15 && (msg.includes('huh') || msg.includes('what') || msg === '?')) {
            return {
              response: "I understand this might feel like a lot. Let me be clearer: I'm here to support you with whatever you're going through.\n\nIs there something specific on your mind, or would you prefer to explore the app's other features like breathing exercises or journaling?",
              newState: {
                onboarding_completed: true,
                current_stage: 'ongoing',
                conversation_depth: 0
              }
            };
          }

          // Testing/casual conversation
          if (msg.includes('test') || msg.includes('just checking') || msg.includes('working')) {
            return {
              response: "I'm working well, thank you! I'm glad the conversation is flowing.\n\nWhenever you're ready to talk about something more personal, I'm here. Or feel free to explore the other features in the app. What would you like to do?",
              newState: {
                onboarding_completed: true,
                current_stage: 'ongoing',
                conversation_depth: 0
              }
            };
          }

          // Continue with contextual questions based on depth
          const contextualFollowUps = [
            "What does a typical day look like for you?",
            "What usually helps you feel better when things are tough?",
            "Do you have people you can talk to about what you're going through?",
            "When you imagine feeling better, what does that look like?",
          ];

          return {
            response: contextualFollowUps[state.conversation_depth % contextualFollowUps.length],
            newState: { conversation_depth: state.conversation_depth + 1 }
          };
        }
    }
  }

  // ONGOING CONVERSATIONS (after onboarding)
  const greeting = userName ? `Hey ${userName}!` : 'Hey!';

  // Greetings
  if (msg.match(/^(hi|hello|hey|sup|whats up|yo)$/)) {
    const greetings = [
      `${greeting} Good to hear from you. What's on your mind today?`,
      `${greeting} How have you been since we last talked?`,
      `${greeting} How are you feeling right now?`,
    ];
    return {
      response: greetings[Math.floor(Math.random() * greetings.length)],
      newState: { conversation_depth: 0 }
    };
  }

  // Emotional states - ASK FOLLOW-UPS
  if (msg.includes('anxious') || msg.includes('panic') || msg.includes('overwhelmed')) {
    const hasBreathingPref = memories.some(m => m.key === 'prefers_breathing');

    if (hasBreathingPref) {
      return {
        response: "I know breathing exercises have helped you before. Would you like to try one now, or would you rather talk about what's making you anxious?",
        newState: { last_question_asked: 'breathing or talk?' }
      };
    }

    return {
      response: "I'm sorry you're feeling anxious. That's really tough.\n\nWhat's triggering these feelings right now? Sometimes talking about it can help.",
      newState: {
        last_question_asked: 'What\'s triggering anxiety?',
        conversation_depth: 1
      }
    };
  }

  if (msg.includes('sad') || msg.includes('down') || msg.includes('depressed')) {
    return {
      response: `I'm really sorry you're feeling this way${userName ? `, ${userName}` : ''}. Your feelings matter.\n\nHave you been feeling like this for a while, or did something specific happen?`,
      newState: {
        last_question_asked: 'How long feeling sad?',
        conversation_depth: 1
      }
    };
  }

  if (msg.includes('angry') || msg.includes('frustrated') || msg.includes('mad')) {
    return {
      response: "It's completely okay to feel angry. Those feelings are valid.\n\nWhat happened? Do you want to talk about it?",
      newState: {
        last_question_asked: 'What made you angry?',
        conversation_depth: 1
      }
    };
  }

  if (msg.includes('happy') || msg.includes('good') || msg.includes('better') || msg.includes('great')) {
    return {
      response: "That's wonderful to hear! I'm so glad you're feeling positive.\n\nWhat's been going well? I'd love to celebrate with you!",
      newState: {
        last_question_asked: 'What\'s going well?',
        conversation_depth: 1
      }
    };
  }

  // Work/life situations
  if (msg.includes('work') || msg.includes('job') || msg.includes('boss')) {
    const occupation = memories.find(m => m.key === 'occupation')?.value;
    const prefix = occupation ? `Work stress as a ${occupation} can be really tough.` : 'Work stress can be really challenging.';

    return {
      response: `${prefix}\n\nWhat's happening at work that's bothering you?`,
      newState: {
        last_question_asked: 'What\'s happening at work?',
        conversation_depth: 1
      }
    };
  }

  // Check for confusion/questions BEFORE generic short response
  if (msg.match(/^(huh|what|explain|why|how)[\?]?$/)) {
    return {
      response: "Let me clarify! I'm Buddy, your wellness companion. I'm here to listen and support you with whatever's on your mind - whether it's stress, anxiety, relationships, or just needing someone to talk to.\n\nI also have features like guided breathing exercises, journaling, and crisis resources if you need them.\n\nWhat would you like to talk about, or would you like to explore the app's features?",
      newState: { conversation_depth: state.conversation_depth + 1 }
    };
  }

  // Check for testing/meta conversation
  if (msg.includes('improv') || msg.includes('testing') || msg.includes('test') || msg.includes('functionality')) {
    return {
      response: "I appreciate your feedback! I'm constantly learning and improving from our conversations.\n\nRight now, I'm here to support your wellness journey. Is there something specific about the app you'd like to try, or something on your mind you'd like to talk about?",
      newState: { conversation_depth: state.conversation_depth + 1 }
    };
  }

  // Check for positive casual responses
  if (msg.match(/^(fine|ok|okay|good|peachy|alright)$/)) {
    return {
      response: "I'm glad to hear that! Even when things are going okay, I'm here if you want to chat.\n\nIs there anything specific you'd like to talk about today?",
      newState: { conversation_depth: state.conversation_depth + 1 }
    };
  }

  // Short responses - dig deeper with MORE variety
  if (msg.length < 15) {
    const prompts = [
      "Tell me more about that.",
      "I'm listening. What else is on your mind?",
      "Can you help me understand what you mean?",
      "How are you feeling about that?",
      "What's making you feel this way?",
      "I'm here. Keep going.",
      "That's interesting. Can you elaborate?",
      "What else is happening?",
      "How does that make you feel?",
      "What's been on your mind lately?",
    ];
    return {
      response: prompts[Math.floor(Math.random() * prompts.length)],
      newState: { conversation_depth: state.conversation_depth + 1 }
    };
  }

  // Longer messages - acknowledge and ask follow-up with MORE variety
  if (msg.length > 50) {
    const responses = [
      "Thank you for sharing that with me. That sounds like a lot to carry.\n\nHow are you coping with all of this?",
      "I hear you. It takes courage to be this open.\n\nWhat would help you feel supported right now?",
      "I'm really glad you felt comfortable sharing this with me.\n\nHave you been able to talk to anyone else about these feelings?",
      "That sounds really challenging. I want you to know you're not alone in this.\n\nWhat usually helps when you're feeling this way?",
      "I appreciate you being so honest with me. That takes real strength.\n\nWhat do you need most right now?",
      "I'm listening to everything you're saying. Your feelings are valid.\n\nHow long have you been carrying this?",
      "Thank you for opening up like this. I can sense how much this matters to you.\n\nWhat would relief look like for you?",
      "I hear the struggle in what you're sharing. You're being really brave.\n\nWhat's one thing that might help, even a little?",
      "That's a lot to process. I'm here with you through this.\n\nWhen did you first notice these feelings?",
      "I can feel the weight of what you're going through.\n\nWhat parts of this feel most overwhelming?",
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      newState: { conversation_depth: state.conversation_depth + 1 }
    };
  }

  // Default: reflect and ask
  return {
    response: `I hear what you're saying${userName ? `, ${userName}` : ''}.\n\nHow long have you been feeling this way?`,
    newState: { conversation_depth: state.conversation_depth + 1 }
  };
}

export async function getAIResponse(
  userMessage: string,
  userId: string,
  messageHistory: Message[]
): Promise<string> {
  console.log('=== getAIResponse START ===');
  console.log('User message:', userMessage);
  console.log('User ID:', userId);

  // Get current state, memories, and user preferences
  const [state, memories, preferencesRes] = await Promise.all([
    getConversationState(userId),
    getMemories(userId),
    userId !== 'anonymous'
      ? supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle()
      : Promise.resolve({ data: null, error: null })
  ]);

  const preferences = preferencesRes?.data || {
    companion_personality: 'balanced',
    response_length: 'moderate',
    conversation_style: 'friendly',
    use_name_frequency: 'sometimes',
    religious_spiritual_support: false,
    veteran_support: false,
    lgbtq_support: false
  };

  console.log('State and memories loaded:', { state, memoriesCount: memories.length, preferences });

  // Extract and save any new memories
  const newMemories = extractMemories(userMessage, state.last_question_asked);
  for (const memory of newMemories) {
    await saveMemory(userId, memory);
  }

  try {
    // Build conversation history for AI (limit to last 4 exchanges = 8 messages)
    const conversationHistory = messageHistory.slice(-8).map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));

    console.log('Conversation history built:', conversationHistory.length, 'messages');

    // Get API keys from config
    const groqApiKey = config.groqApiKey;
    const geminiApiKey = config.geminiApiKey;

    console.log('Groq API Key available:', !!groqApiKey);
    console.log('Gemini API Key available:', !!geminiApiKey);

    // Call AI Edge Function
    const { data: { session } } = await supabase.auth.getSession();
    const authToken = session?.access_token || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    // Try Groq first (fastest) - call directly from client
    let aiResponse: string | null = null;
    let usedProvider = 'none';

    if (groqApiKey) {
      try {
        console.log('Trying Groq API directly...');

        // Build system prompt with user preferences
        const userName = memories.find(m => m.key === 'name')?.value;
        const occupation = memories.find(m => m.key === 'occupation')?.value;
        const struggles = memories.filter(m => m.memory_type === 'concern').map(m => m.value);
        const goals = memories.filter(m => m.memory_type === 'goal').map(m => m.value);

        // Personality adjustments
        const personalityTraits = {
          supportive: 'extremely empathetic, reassuring, and validating. You prioritize emotional support and understanding.',
          energetic: 'upbeat, motivating, and encouraging. You bring positive energy and enthusiasm to every interaction.',
          calm: 'peaceful, grounding, and soothing. You speak with a gentle, measured tone that helps users feel at ease.',
          balanced: 'warm, empathetic, and naturally conversational (not robotic or clinical)'
        };

        // Response length adjustments
        const responseLengthGuide = {
          brief: 'Keep responses very concise - 1-2 sentences maximum.',
          moderate: 'Keep responses 2-4 sentences (brief but meaningful).',
          detailed: 'Provide thoughtful, detailed responses - 4-6 sentences when appropriate.'
        };

        // Conversation style adjustments
        const styleGuide = {
          casual: 'Use relaxed, informal language. Feel free to use contractions and casual expressions.',
          professional: 'Use polished, thoughtful language. Be warm but slightly more formal.',
          friendly: 'Be warm and personable, like chatting with a close friend.'
        };

        // Name usage adjustments
        const nameUsageGuide = {
          rarely: 'Only use their name when it feels especially meaningful or important.',
          sometimes: 'Use their name occasionally when it feels natural.',
          often: 'Use their name frequently to create a more personal connection.'
        };

        const personality = preferences.companion_personality as keyof typeof personalityTraits;
        const nameFreq = preferences.use_name_frequency as keyof typeof nameUsageGuide;
        const responseLen = preferences.response_length as keyof typeof responseLengthGuide;
        const convStyle = preferences.conversation_style as keyof typeof styleGuide;

        let systemPrompt = `You are Buddy, a genuinely caring AI wellness companion who feels like a real friend. You're here to support people through their mental health journey.

YOUR PERSONALITY:
- ${personalityTraits[personality]}
- You remember what users tell you and bring it up naturally
- ${nameUsageGuide[nameFreq]}
- You express genuine emotion - you can be concerned, excited, hopeful, proud
- You vary your responses - never sound scripted or repetitive
- You're supportive but not patronizing
- You ask one thoughtful follow-up question per response

RESPONSE STYLE:
- ${responseLengthGuide[responseLen]}
- ${styleGuide[convStyle]}
- Be direct and honest, not overly formal
- Vary your sentence structure and word choice
- Sound like a trusted friend, not a therapist or chatbot
- Use emojis occasionally to express emotion (😊 🌟 💙 🌈 ✨ 💪 🫂 🌸 etc.)
- Don't overuse emojis - 1-2 per message maximum
- Use emojis that match the emotional tone (supportive, caring, encouraging)

WHAT YOU REMEMBER:`;

        if (userName) systemPrompt += `\n- User's name: ${userName}`;
        if (occupation) systemPrompt += `\n- Occupation: ${occupation}`;
        if (struggles.length > 0) systemPrompt += `\n- Current struggles: ${struggles.join(', ')}`;
        if (goals.length > 0) systemPrompt += `\n- Goals: ${goals.join(', ')}`;

        // Add specialized support modes
        if (preferences.religious_spiritual_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - Religious/Spiritual:
- You can reference faith, prayer, meditation, and spirituality when appropriate
- Be respectful of all faith traditions
- Offer spiritual encouragement alongside emotional support
- Suggest prayer, meditation, or faith-based coping when relevant`;
        }

        if (preferences.veteran_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - Veterans:
- Understand military culture, terminology, and experiences
- Be aware of PTSD, TBI, and service-related trauma
- Honor their service while focusing on their current well-being
- Connect military values (honor, duty, resilience) to wellness journey`;
        }

        if (preferences.lgbtq_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - LGBTQ+:
- Be affirming and supportive of all identities and orientations
- Understand unique challenges like coming out, discrimination, family acceptance
- Use inclusive language and respect chosen names/pronouns
- Validate their experiences and celebrate their authentic self`;
        }

        if (state && !state.onboarding_completed) {
          if (state.current_stage === 'greeting') {
            systemPrompt += `\n\nCONTEXT: This is your first interaction. Greet them warmly, introduce yourself as Buddy, and ask for their name.`;
          } else if (state.current_stage === 'learning_name') {
            systemPrompt += `\n\nCONTEXT: You just asked their name. Use it and ask what's bringing them here today.`;
          } else if (state.current_stage === 'learning_about') {
            systemPrompt += `\n\nCONTEXT: They shared what brought them here. Ask a thoughtful follow-up question.`;
          }
        } else {
          systemPrompt += `\n\nCONTEXT: You know this person. Continue your supportive friendship naturally.`;
        }

        const messages = [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-4),
          { role: 'user', content: userMessage },
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.85,
            max_tokens: 200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices?.[0]?.message?.content;
          usedProvider = 'groq';
          console.log('✓ Groq response received');
        } else {
          const errorData = await response.json();
          console.log('✗ Groq failed:', response.status, errorData);
        }
      } catch (error) {
        console.log('✗ Groq error:', error);
      }
    }

    // If Groq failed, try Gemini
    if (!aiResponse && geminiApiKey) {
      try {
        console.log('Trying Gemini API...');
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

        // Build comprehensive system prompt with user preferences
        const userName = memories.find(m => m.key === 'name')?.value;
        const occupation = memories.find(m => m.key === 'occupation')?.value;
        const struggles = memories.filter(m => m.memory_type === 'concern').map(m => m.value);
        const goals = memories.filter(m => m.memory_type === 'goal').map(m => m.value);

        const personalityTraits = {
          supportive: 'extremely empathetic, reassuring, and validating. You prioritize emotional support and understanding.',
          energetic: 'upbeat, motivating, and encouraging. You bring positive energy and enthusiasm to every interaction.',
          calm: 'peaceful, grounding, and soothing. You speak with a gentle, measured tone that helps users feel at ease.',
          balanced: 'warm, empathetic, and naturally conversational (not robotic or clinical)'
        };

        const responseLengthGuide = {
          brief: 'Keep responses very concise - 1-2 sentences maximum.',
          moderate: 'Keep responses 2-4 sentences (brief but meaningful).',
          detailed: 'Provide thoughtful, detailed responses - 4-6 sentences when appropriate.'
        };

        const styleGuide = {
          casual: 'Use relaxed, informal language. Feel free to use contractions and casual expressions.',
          professional: 'Use polished, thoughtful language. Be warm but slightly more formal.',
          friendly: 'Be warm and personable, like chatting with a close friend.'
        };

        const nameUsageGuide = {
          rarely: 'Only use their name when it feels especially meaningful or important.',
          sometimes: 'Use their name occasionally when it feels natural.',
          often: 'Use their name frequently to create a more personal connection.'
        };

        const personality = preferences.companion_personality as keyof typeof personalityTraits;
        const nameFreq = preferences.use_name_frequency as keyof typeof nameUsageGuide;
        const responseLen = preferences.response_length as keyof typeof responseLengthGuide;
        const convStyle = preferences.conversation_style as keyof typeof styleGuide;

        let systemPrompt = `You are Buddy, a genuinely caring AI wellness companion who feels like a real friend. You're here to support people through their mental health journey.

YOUR PERSONALITY:
- ${personalityTraits[personality]}
- You remember what users tell you and bring it up naturally
- ${nameUsageGuide[nameFreq]}
- You express genuine emotion - you can be concerned, excited, hopeful, proud
- You vary your responses - never sound scripted or repetitive
- You're supportive but not patronizing
- You ask one thoughtful follow-up question per response

RESPONSE STYLE:
- ${responseLengthGuide[responseLen]}
- ${styleGuide[convStyle]}
- Be direct and honest, not overly formal
- Vary your sentence structure and word choice
- Sound like a trusted friend, not a therapist or chatbot
- Use emojis occasionally to express emotion (😊 🌟 💙 🌈 ✨ 💪 🫂 🌸 etc.)
- Don't overuse emojis - 1-2 per message maximum
- Use emojis that match the emotional tone (supportive, caring, encouraging)

WHAT YOU REMEMBER:`;

        if (userName) systemPrompt += `\n- User's name: ${userName}`;
        if (occupation) systemPrompt += `\n- Occupation: ${occupation}`;
        if (struggles.length > 0) systemPrompt += `\n- Current struggles: ${struggles.join(', ')}`;
        if (goals.length > 0) systemPrompt += `\n- Goals: ${goals.join(', ')}`;

        // Add specialized support modes
        if (preferences.religious_spiritual_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - Religious/Spiritual:
- You can reference faith, prayer, meditation, and spirituality when appropriate
- Be respectful of all faith traditions
- Offer spiritual encouragement alongside emotional support
- Suggest prayer, meditation, or faith-based coping when relevant`;
        }

        if (preferences.veteran_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - Veterans:
- Understand military culture, terminology, and experiences
- Be aware of PTSD, TBI, and service-related trauma
- Honor their service while focusing on their current well-being
- Connect military values (honor, duty, resilience) to wellness journey`;
        }

        if (preferences.lgbtq_support) {
          systemPrompt += `\n\nSPECIALIZED SUPPORT - LGBTQ+:
- Be affirming and supportive of all identities and orientations
- Understand unique challenges like coming out, discrimination, family acceptance
- Use inclusive language and respect chosen names/pronouns
- Validate their experiences and celebrate their authentic self`;
        }

        if (state && !state.onboarding_completed) {
          if (state.current_stage === 'greeting') {
            systemPrompt += `\n\nCONTEXT: This is your first interaction. Greet them warmly, introduce yourself as Buddy, and ask for their name.`;
          } else if (state.current_stage === 'learning_name') {
            systemPrompt += `\n\nCONTEXT: You just asked their name. Use it and ask what's bringing them here today.`;
          } else if (state.current_stage === 'learning_about') {
            systemPrompt += `\n\nCONTEXT: They shared what brought them here. Ask a thoughtful follow-up question.`;
          }
        } else {
          systemPrompt += `\n\nCONTEXT: You know this person. Continue your supportive friendship naturally.`;
        }

        // Gemini format: prepend system prompt to first user message
        const geminiMessages = conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        // Add current message with system prompt prepended
        geminiMessages.push({
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n---\n\nUser message: ${userMessage}` }]
        });

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 200,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
          usedProvider = 'gemini';
          console.log('✓ Gemini response received');
        } else {
          const errorText = await response.text();
          console.log('✗ Gemini failed:', response.status, errorText);
        }
      } catch (error) {
        console.log('✗ Gemini error:', error);
      }
    }

    // If both AI providers failed, throw to use fallback
    if (!aiResponse) {
      throw new Error('All AI providers failed');
    }

    console.log('AI response from:', usedProvider, '- length:', aiResponse?.length);

    // Update conversation state based on response
    if (!state.onboarding_completed) {
      // Check if we should advance onboarding stages
      if (state.current_stage === 'greeting') {
        await updateConversationState(userId, {
          current_stage: 'learning_name',
          conversation_depth: 1
        });
      } else if (state.current_stage === 'learning_name' && memories.some(m => m.key === 'name')) {
        await updateConversationState(userId, {
          current_stage: 'learning_about',
          conversation_depth: 2
        });
      } else if (state.current_stage === 'learning_about' && state.conversation_depth >= 3) {
        await updateConversationState(userId, {
          onboarding_completed: true,
          current_stage: 'ongoing',
          conversation_depth: 0
        });
      } else {
        await updateConversationState(userId, {
          conversation_depth: state.conversation_depth + 1
        });
      }
    }

    // Save conversation (only if not anonymous)
    if (userId !== 'anonymous') {
      await supabase.from('companion_conversations').insert({
        user_id: userId,
        message: userMessage,
        response: aiResponse,
        sentiment: detectSentiment(userMessage),
        topics: extractTopics(userMessage),
      });
    }

    console.log('=== getAIResponse SUCCESS ===');
    return aiResponse;
  } catch (error) {
    console.error('=== getAIResponse ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Use built-in conversational AI as fallback
    const { response: fallbackResponse, newState } = generateConversationalResponse(userMessage, state, memories);

    // Update conversation state based on fallback response
    if (Object.keys(newState).length > 0) {
      await updateConversationState(userId, newState);
    }

    // Save conversation with fallback (only if not anonymous)
    if (userId !== 'anonymous') {
      await supabase.from('companion_conversations').insert({
        user_id: userId,
        message: userMessage,
        response: fallbackResponse,
        sentiment: detectSentiment(userMessage),
        topics: extractTopics(userMessage),
      });
    }

    return fallbackResponse;
  }
}

function detectSentiment(message: string): string {
  const msg = message.toLowerCase();
  if (msg.match(/anxious|worried|stress|panic/)) return 'anxious';
  if (msg.match(/sad|down|depressed|hopeless/)) return 'sad';
  if (msg.match(/happy|good|great|better/)) return 'positive';
  if (msg.match(/angry|mad|frustrated/)) return 'stressed';
  return 'neutral';
}

function extractTopics(message: string): string[] | null {
  const topics: string[] = [];
  const msg = message.toLowerCase();

  if (msg.match(/work|job|boss|career/)) topics.push('work_school');
  if (msg.match(/friend|family|relationship|partner/)) topics.push('relationships');
  if (msg.match(/sleep|tired|health/)) topics.push('health');

  return topics.length > 0 ? topics : null;
}

export async function deleteMemory(userId: string, memoryId: string): Promise<boolean> {
  const { error } = await supabase
    .from('companion_memories')
    .delete()
    .eq('id', memoryId)
    .eq('user_id', userId);

  return !error;
}

export async function getAllMemories(userId: string): Promise<Memory[]> {
  return getMemories(userId);
}

export async function createUserGoal(userId: string, title: string, description?: string, category?: string): Promise<string | null> {
  if (userId === 'anonymous') return null;

  const { data, error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      title,
      description,
      category: category || 'personal',
      status: 'active',
    })
    .select('id')
    .single();

  if (error || !data) return null;

  await trackUserActivity(userId, 'message');

  const { data: goalsCount } = await supabase
    .from('user_goals')
    .select('id', { count: 'exact' })
    .eq('user_id', userId);

  return data.id;
}

export async function getUserGoals(userId: string, status: 'active' | 'completed' | 'all' = 'active'): Promise<any[]> {
  if (userId === 'anonymous') return [];

  let query = supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  return data || [];
}

export async function addGoalCheckIn(userId: string, goalId: string, note: string, sentiment: 'positive' | 'neutral' | 'struggling' = 'neutral'): Promise<void> {
  if (userId === 'anonymous') return;

  await supabase.from('goal_check_ins').insert({
    goal_id: goalId,
    user_id: userId,
    note,
    sentiment,
  });

  const { data: goal } = await supabase
    .from('user_goals')
    .select('progress_notes')
    .eq('id', goalId)
    .maybeSingle();

  const existingNotes = goal?.progress_notes || [];
  const updatedNotes = [
    ...existingNotes,
    {
      note,
      timestamp: new Date().toISOString(),
    },
  ];

  await supabase
    .from('user_goals')
    .update({
      updated_at: new Date().toISOString(),
      progress_notes: updatedNotes,
    })
    .eq('id', goalId);
}

export async function completeGoal(userId: string, goalId: string): Promise<void> {
  if (userId === 'anonymous') return;

  await supabase
    .from('user_goals')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', goalId)
    .eq('user_id', userId);

  const { data: completedCount } = await supabase
    .from('user_goals')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'completed');

  await checkAndAwardAchievements(userId);
}

export async function trackUserActivity(userId: string, activityType: 'conversation' | 'message' | 'breathing' | 'journal' | 'mood'): Promise<void> {
  if (userId === 'anonymous') return;

  const today = new Date().toISOString().split('T')[0];

  const { data: existingStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!existingStats) {
    await supabase.from('user_stats').insert({
      user_id: userId,
      total_conversations: activityType === 'conversation' ? 1 : 0,
      total_messages: activityType === 'message' ? 1 : 0,
      breathing_exercises_completed: activityType === 'breathing' ? 1 : 0,
      journal_entries_created: activityType === 'journal' ? 1 : 0,
      mood_logs_created: activityType === 'mood' ? 1 : 0,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
    });
  } else {
    const lastActiveDate = existingStats.last_active_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = existingStats.current_streak;
    if (lastActiveDate === yesterday) {
      newStreak += 1;
    } else if (lastActiveDate !== today) {
      newStreak = 1;
    }

    const updates: any = {
      last_active_date: today,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existingStats.longest_streak),
      updated_at: new Date().toISOString(),
    };

    if (activityType === 'conversation') updates.total_conversations = existingStats.total_conversations + 1;
    if (activityType === 'message') updates.total_messages = existingStats.total_messages + 1;
    if (activityType === 'breathing') updates.breathing_exercises_completed = existingStats.breathing_exercises_completed + 1;
    if (activityType === 'journal') updates.journal_entries_created = existingStats.journal_entries_created + 1;
    if (activityType === 'mood') updates.mood_logs_created = existingStats.mood_logs_created + 1;

    await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId);
  }

  await checkAndAwardAchievements(userId);
}

async function checkAndAwardAchievements(userId: string): Promise<void> {
  const [statsRes, achievementsRes, userAchievementsRes, goalsRes, completedGoalsRes] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('achievements').select('*'),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
    supabase.from('user_goals').select('id', { count: 'exact' }).eq('user_id', userId),
    supabase.from('user_goals').select('id', { count: 'exact' }).eq('user_id', userId).eq('status', 'completed'),
  ]);

  const stats = statsRes.data;
  const achievements = achievementsRes.data || [];
  const earnedAchievementIds = new Set((userAchievementsRes.data || []).map(ua => ua.achievement_id));
  const totalGoals = goalsRes.count || 0;
  const completedGoals = completedGoalsRes.count || 0;

  if (!stats) return;

  const now = new Date();
  const hour = now.getHours();

  for (const achievement of achievements) {
    if (earnedAchievementIds.has(achievement.id)) continue;

    let shouldAward = false;
    let progress = 0;

    switch (achievement.requirement_type) {
      case 'count':
        if (achievement.name.includes('First Words') || achievement.name.includes('message')) {
          progress = stats.total_messages;
          shouldAward = stats.total_messages >= achievement.requirement_value;
        } else if (achievement.name.includes('conversation')) {
          progress = stats.total_conversations;
          shouldAward = stats.total_conversations >= achievement.requirement_value;
        } else if (achievement.name.includes('breathing')) {
          progress = stats.breathing_exercises_completed;
          shouldAward = stats.breathing_exercises_completed >= achievement.requirement_value;
        } else if (achievement.name.includes('journal')) {
          progress = stats.journal_entries_created;
          shouldAward = stats.journal_entries_created >= achievement.requirement_value;
        } else if (achievement.name.includes('mood') || achievement.name.includes('Mood')) {
          progress = stats.mood_logs_created;
          shouldAward = stats.mood_logs_created >= achievement.requirement_value;
        } else if (achievement.name.includes('points')) {
          progress = stats.total_points;
          shouldAward = stats.total_points >= achievement.requirement_value;
        } else if (achievement.name.includes('Goal Setter') || achievement.name.includes('Dream Chaser')) {
          progress = totalGoals;
          shouldAward = totalGoals >= achievement.requirement_value;
        } else if (achievement.name.includes('Goal Crusher') || achievement.name.includes('Unstoppable')) {
          progress = completedGoals;
          shouldAward = completedGoals >= achievement.requirement_value;
        }
        break;

      case 'streak':
        progress = stats.current_streak;
        shouldAward = stats.current_streak >= achievement.requirement_value;
        break;

      case 'specific':
        if (achievement.name.includes('Night Owl')) {
          shouldAward = hour >= 0 && hour < 6;
        } else if (achievement.name.includes('Early Bird')) {
          shouldAward = hour >= 4 && hour < 6;
        }
        break;
    }

    if (shouldAward) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
        progress: achievement.requirement_value,
      });

      await supabase
        .from('user_stats')
        .update({
          total_points: stats.total_points + achievement.points,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } else if (progress > 0) {
      await supabase.from('user_achievements').upsert({
        user_id: userId,
        achievement_id: achievement.id,
        progress,
      });
    }
  }
}
