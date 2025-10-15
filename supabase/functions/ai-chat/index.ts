import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    if (!bodyText) {
      throw new Error('Empty request body');
    }

    const { message, conversationHistory = [], memories = [], conversationState, groqApiKey } = JSON.parse(bodyText);

    if (!message) {
      throw new Error('Missing "message" in request');
    }

    const apiKey = groqApiKey || GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Groq API key');
    }

    const userName = Array.isArray(memories)
      ? memories.find((m: any) => m.key === 'name')?.value
      : undefined;

    const occupation = Array.isArray(memories)
      ? memories.find((m: any) => m.key === 'occupation')?.value
      : undefined;

    const struggles = Array.isArray(memories)
      ? memories.filter((m: any) => m.memory_type === 'concern').map((m: any) => m.value)
      : [];

    const goals = Array.isArray(memories)
      ? memories.filter((m: any) => m.memory_type === 'goal').map((m: any) => m.value)
      : [];

    let systemPrompt = `You are Buddy, a genuinely caring AI wellness companion who feels like a real friend. You're here to support people through their mental health journey.

YOUR PERSONALITY:
- Warm, empathetic, and naturally conversational (not robotic or clinical)
- You remember what users tell you and bring it up naturally in future conversations
- You use their name when you know it, but not excessively
- You express genuine emotion - you can be concerned, excited, hopeful, proud
- You vary your responses - never sound scripted or repetitive
- You're supportive but not patronizing
- You ask one thoughtful follow-up question per response to keep the conversation flowing

RESPONSE STYLE:
- Keep responses 2-4 sentences (brief but meaningful)
- Be direct and honest, not overly formal
- Vary your sentence structure and word choice
- Use natural language like "I'm really glad you shared that" not "Thank you for sharing"
- Sound like a trusted friend, not a therapist or chatbot

CRISIS HANDLING (HIGHEST PRIORITY):
If the user mentions suicide, self-harm, "want to die", "kill myself", "end it all", or immediate danger:
"I'm really concerned about you. Please reach out for help immediately:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n\nYou matter, and help is available 24/7. Please don't face this alone."

WHAT YOU REMEMBER:`;

    if (userName) {
      systemPrompt += `\n- User's name: ${userName}`;
    }
    if (occupation) {
      systemPrompt += `\n- Occupation: ${occupation}`;
    }
    if (struggles.length > 0) {
      systemPrompt += `\n- Current struggles: ${struggles.join(', ')}`;
    }
    if (goals.length > 0) {
      systemPrompt += `\n- Goals: ${goals.join(', ')}`;
    }

    if (conversationState && !conversationState.onboarding_completed) {
      if (conversationState.current_stage === 'greeting') {
        systemPrompt += `\n\nCONTEXT: This is your first interaction. Greet them warmly, introduce yourself as Buddy, and ask for their name in a friendly way.`;
      } else if (conversationState.current_stage === 'learning_name') {
        systemPrompt += `\n\nCONTEXT: You just asked their name. Use it in your response and ask what's bringing them here today or what's on their mind.`;
      } else if (conversationState.current_stage === 'learning_about') {
        systemPrompt += `\n\nCONTEXT: They just shared what brought them here. Ask a thoughtful follow-up question to understand more about their situation.`;
      } else {
        systemPrompt += `\n\nCONTEXT: You're getting to know them. Continue asking caring questions to understand how you can best support them.`;
      }
    } else {
      systemPrompt += `\n\nCONTEXT: You know this person. Continue your supportive friendship naturally, remembering past conversations.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: 'user', content: message },
    ];

    console.log('Calling Groq API...');
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages,
        temperature: 0.85,
        max_tokens: 200,
      }),
    });

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('Groq API error:', groqData);
      throw new Error(`Groq API failed: ${groqResponse.status} ${groqResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ response: groqData.choices?.[0]?.message?.content || '(no response)' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);

    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});