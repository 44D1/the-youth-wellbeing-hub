import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to run locally in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

export class FreeAIService {
  private chatPipeline: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('Initializing free AI service...');
      // Use a lightweight conversational model that works well for mental health support
      this.chatPipeline = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-small',
        { device: 'webgpu' } // Use WebGPU for better performance, falls back to CPU
      );
      this.isInitialized = true;
      console.log('Free AI service initialized successfully');
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      try {
        this.chatPipeline = await pipeline(
          'text-generation',
          'microsoft/DialoGPT-small'
        );
        this.isInitialized = true;
        console.log('Free AI service initialized with CPU');
      } catch (cpuError) {
        console.error('Failed to initialize AI service:', cpuError);
        throw new Error('Unable to initialize AI service');
      }
    }
  }

  async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Create a wellness-focused prompt
      const systemPrompt = `You are a caring AI wellness companion. Provide empathetic, supportive responses focused on mental health and wellbeing. Keep responses concise and encouraging.`;
      
      // Combine conversation history
      const context = conversationHistory.length > 0 
        ? conversationHistory.slice(-3).join(' ') + ' ' + userMessage
        : userMessage;

      const fullPrompt = `${systemPrompt}\n\nUser: ${context}\nAssistant:`;

      const result = await this.chatPipeline(fullPrompt, {
        max_new_tokens: 100,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
        pad_token_id: 50256
      });

      // Extract the response
      let response = result[0].generated_text;
      
      // Clean up the response
      const assistantIndex = response.lastIndexOf('Assistant:');
      if (assistantIndex !== -1) {
        response = response.substring(assistantIndex + 'Assistant:'.length).trim();
      }

      // Fallback responses for better mental health support
      if (!response || response.length < 10) {
        const supportiveResponses = [
          "I hear you, and I want you to know that your feelings are valid. How can I support you today?",
          "Thank you for sharing with me. It takes courage to open up. What would help you feel a bit better right now?",
          "I'm here to listen and support you. Remember that it's okay to take things one step at a time.",
          "Your wellbeing matters, and I'm glad you're taking time to check in with yourself. What's on your mind?",
          "I appreciate you reaching out. Sometimes just talking about what we're feeling can be helpful. How are you doing today?"
        ];
        response = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      }

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm here to support you, though I'm having a technical moment. How are you feeling today, and what would be most helpful for you right now?";
    }
  }

  async generateMoodInsight(mood: string, notes?: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const insights = {
      happy: "It's wonderful that you're feeling happy! This positive energy can be a great foundation for connecting with others and pursuing activities you enjoy.",
      sad: "It's okay to feel sad sometimes. These feelings are valid and temporary. Consider gentle self-care activities or reaching out to someone you trust.",
      anxious: "Feeling anxious is common and manageable. Try some deep breathing exercises or grounding techniques. Remember that you've gotten through difficult times before.",
      stressed: "Stress can feel overwhelming, but you have the strength to handle this. Break things down into smaller, manageable steps and be kind to yourself.",
      excited: "Your excitement is energizing! Channel this positive feeling into something meaningful to you, whether that's a project, hobby, or time with loved ones.",
      tired: "Feeling tired is your body and mind asking for care. Rest is productive and necessary. Consider what type of rest would serve you best right now.",
      angry: "Anger can signal that something important to you needs attention. Take some time to breathe and reflect on what might be behind this feeling.",
      grateful: "Gratitude is a powerful emotion that can enhance your wellbeing. Consider keeping a gratitude journal or sharing your appreciation with others."
    };

    const baseInsight = insights[mood as keyof typeof insights] || 
      "Every feeling you experience is valid and part of your human experience. Be gentle with yourself as you navigate these emotions.";

    if (notes) {
      return `${baseInsight}\n\nBased on your notes: "${notes}" - Remember that self-awareness is the first step toward growth and healing.`;
    }

    return baseInsight;
  }
}

export const freeAI = new FreeAIService();