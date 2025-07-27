export class FreeAIService {
  private isInitialized = false;

  async initialize() {
    console.log('Initializing free AI service...');
    this.isInitialized = true;
    console.log('Free AI service initialized successfully');
  }

  async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<string> {
    console.log('Generating response for:', userMessage);
    
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // For now, use intelligent pattern matching with pre-written supportive responses
      // This ensures immediate functionality while being genuinely helpful
      const responses = this.getContextualResponse(userMessage, conversationHistory);
      
      console.log('Generated response:', responses);
      return responses;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm here to support you, though I'm having a technical moment. How are you feeling today, and what would be most helpful for you right now?";
    }
  }

  private getContextualResponse(userMessage: string, conversationHistory: string[] = []): string {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm so glad you're here. How are you feeling today, and what would you like to talk about?";
    }

    // Mood-related responses
    if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
      return "I hear that you're feeling sad, and I want you to know that these feelings are valid and temporary. It's okay to sit with difficult emotions. What's been weighing on your mind lately?";
    }

    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      return "Anxiety can feel overwhelming, but you're not alone in this. Try taking some slow, deep breaths with me. What specific thoughts or situations are making you feel anxious right now?";
    }

    if (message.includes('stressed') || message.includes('overwhelmed')) {
      return "Stress can feel like carrying a heavy load. Remember that you don't have to handle everything at once. What's the most pressing thing on your mind that we could break down into smaller steps?";
    }

    if (message.includes('happy') || message.includes('good') || message.includes('great')) {
      return "It's wonderful to hear you're feeling positive! These good moments are worth celebrating. What's been contributing to your happiness today?";
    }

    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      return "Anger often signals that something important to you needs attention. It's a valid emotion, and you're allowed to feel it. What situation or thought is triggering these feelings?";
    }

    if (message.includes('tired') || message.includes('exhausted') || message.includes('sleepy')) {
      return "Feeling tired is your body and mind asking for care. Rest isn't just okay—it's necessary for your wellbeing. Have you been able to get quality sleep, or is there something keeping you from rest?";
    }

    // Self-care and coping responses
    if (message.includes('help') || message.includes('support') || message.includes('advice')) {
      return "I'm here to support you through whatever you're facing. Sometimes the best help starts with being heard and understood. What specific support would feel most helpful to you right now?";
    }

    if (message.includes('cope') || message.includes('manage') || message.includes('handle')) {
      return "Coping with difficult situations takes courage, and you're already showing that by reaching out. Some helpful strategies include deep breathing, mindfulness, or talking to someone you trust. What coping methods have you found helpful before?";
    }

    if (message.includes('alone') || message.includes('lonely') || message.includes('isolated')) {
      return "Feeling alone can be really difficult, but reaching out like you're doing now shows incredible strength. You're not truly alone—I'm here with you, and there are people who care about you. What connection would feel most meaningful to you right now?";
    }

    // Thanks and positive feedback
    if (message.includes('thank') || message.includes('appreciate')) {
      return "You're so welcome! It means a lot that you're taking time for your mental wellbeing. How else can I support you today?";
    }

    // Crisis or serious concern responses
    if (message.includes('hurt myself') || message.includes('end it') || message.includes('suicide')) {
      return "I'm really concerned about you and want you to get the support you deserve. Please reach out to a crisis helpline or trusted person immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. You matter, and there are people who want to help you through this.";
    }

    // Default supportive responses based on conversation context
    const recentHistory = conversationHistory.slice(-2).join(' ').toLowerCase();
    
    if (recentHistory.includes('feeling') || recentHistory.includes('emotion')) {
      return "Thank you for sharing your feelings with me. It takes courage to be vulnerable and open up. What would help you process these emotions right now?";
    }

    // General supportive responses
    const generalResponses = [
      "I hear you, and I want you to know that your feelings are completely valid. What's been on your mind lately that you'd like to explore together?",
      "Thank you for sharing with me. It takes courage to open up about how you're feeling. How can I best support you right now?",
      "I'm here to listen and support you through whatever you're experiencing. What would be most helpful for you in this moment?",
      "Your wellbeing matters so much, and I'm glad you're taking time to check in with yourself. What's something that's been weighing on your heart?",
      "I appreciate you reaching out and being willing to talk. Sometimes just expressing what we're feeling can be incredibly healing. What's going on for you today?",
      "Every feeling you experience is part of your unique human journey, and they all deserve acknowledgment. What emotion are you sitting with right now?",
      "You're showing real strength by being here and being willing to explore your thoughts and feelings. What would you like to focus on in our conversation?"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  async generateMoodInsight(mood: string, notes?: string): Promise<string> {
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