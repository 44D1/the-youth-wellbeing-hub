
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cohereApiKey = Deno.env.get('COHERE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mood } = await req.json();

    // Check for self-harm indicators
    const selfHarmKeywords = ['hurt myself', 'end it', 'suicide', 'kill myself', 'want to die', 'better off dead', 'self harm', 'cut myself', 'overdose', 'jump off'];
    const hasSelfHarmContent = selfHarmKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasSelfHarmContent) {
      const emergencyResponse = `I'm very concerned about what you've shared and want you to get immediate support. Please reach out for help right now:

🆘 **EMERGENCY**: Call 000 if you're in immediate danger
📞 **Lifeline Australia**: 13 11 14 (24/7 crisis support)
💬 **Crisis Text Line**: Text HELLO to 741741
🌐 **Beyond Blue**: 1300 22 4636
👤 **Suicide Call Back Service**: 1300 659 467

You matter, your life has value, and there are people who want to help you through this difficult time. Please reach out to one of these services or go to your nearest emergency department.`;

      return new Response(JSON.stringify({ response: emergencyResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a compassionate AI assistant specializing in mental health and wellbeing support. The user has just indicated they are feeling "${mood}". 

Your role is to:
- Provide empathetic, supportive responses
- Offer practical coping strategies and suggestions
- Be encouraging and understanding
- Keep responses concise but meaningful (2-3 sentences max)
- Never provide medical advice, but suggest professional help when appropriate
- Focus on immediate comfort and practical next steps
- If someone mentions any form of self-harm, ALWAYS prioritize their safety and direct them to Australian emergency services: 000 for emergencies, Lifeline 13 11 14, or Beyond Blue 1300 22 4636

Remember to be warm, non-judgmental, and supportive in your tone.`;

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        message: message,
        preamble: systemPrompt,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Cohere API request failed');
    }

    const aiResponse = data.text;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
