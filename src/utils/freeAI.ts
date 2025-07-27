export class FreeAIService {
  private isInitialized = false;

  async initialize() {
    console.log('Initializing free AI service...');
    this.isInitialized = true;
    console.log('Free AI service initialized successfully');
  }

  async generateResponse(userMessage: string, conversationHistory: string[] = []): Promise<string> {
    console.log('FreeAI: generateResponse called with:', { userMessage, conversationHistory });
    
    try {
      console.log('FreeAI: Starting response generation...');
      
      if (!this.isInitialized) {
        console.log('FreeAI: Not initialized, calling initialize...');
        await this.initialize();
      }

      // For now, use intelligent pattern matching with pre-written supportive responses
      // This ensures immediate functionality while being genuinely helpful
      console.log('FreeAI: Calling getContextualResponse...');
      const responses = this.getContextualResponse(userMessage, conversationHistory);
      
      console.log('FreeAI: Generated response:', responses);
      return responses;
    } catch (error) {
      console.error('FreeAI: Error generating AI response:', error);
      return "I'm here to support you, though I'm having a technical moment. How are you feeling today, and what would be most helpful for you right now?";
    }
  }

  private getContextualResponse(userMessage: string, conversationHistory: string[] = []): string {
    const message = userMessage.toLowerCase();
    
    // Check if we've used this response recently to avoid repetition
    const recentResponses = conversationHistory.filter(msg => msg.startsWith('ai:')).slice(-2);
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const greetings = [
        "Hello! I'm so glad you're here. How are you feeling today, and what would you like to talk about?",
        "Hi there! It's wonderful to connect with you. What's on your mind right now?",
        "Hey! Thanks for reaching out. I'm here to listen and support you. How can I help today?"
      ];
      return this.getRandomResponse(greetings, recentResponses);
    }

    // Mood-related responses
    if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
      const sadResponses = [
        "I hear that you're feeling sad, and I want you to know that these feelings are valid and temporary. What's been weighing on your mind lately?",
        "It sounds like you're going through a difficult time. Sadness is a natural emotion, and it's okay to feel this way. Would you like to share what's causing these feelings?",
        "I'm sorry you're feeling down. Remember that it's okay to not be okay sometimes. What kind of support would be most helpful for you right now?"
      ];
      return this.getRandomResponse(sadResponses, recentResponses);
    }

    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      const anxiousResponses = [
        "Anxiety can feel overwhelming, but you're not alone in this. Try taking some slow, deep breaths with me. What specific thoughts or situations are making you feel anxious?",
        "I understand that you're feeling anxious. That's a very common experience, and there are ways to work through it. What's been triggering these feelings for you?",
        "Feeling nervous or worried is completely normal. Let's focus on what you can control right now. What would help you feel a bit more grounded?"
      ];
      return this.getRandomResponse(anxiousResponses, recentResponses);
    }

    if (message.includes('stressed') || message.includes('overwhelmed')) {
      const stressResponses = [
        "Stress can feel like carrying a heavy load. Remember that you don't have to handle everything at once. What's the most pressing thing we could break down together?",
        "I hear that you're feeling overwhelmed. That's a sign that you're taking on a lot. What specific stressors would you like to talk through?",
        "When we're stressed, everything can feel urgent. Let's take a step back. What's one thing that would make the biggest difference if we addressed it first?"
      ];
      return this.getRandomResponse(stressResponses, recentResponses);
    }

    if (message.includes('happy') || message.includes('good') || message.includes('great') || message.includes('excited')) {
      const happyResponses = [
        "It's wonderful to hear you're feeling positive! These good moments are worth celebrating and appreciating. What's been contributing to your happiness?",
        "I love hearing that you're doing well! Positive emotions are so important for our wellbeing. What's brought this joy into your life?",
        "That's fantastic! It's beautiful when we can recognize and embrace these positive feelings. Tell me more about what's going well for you."
      ];
      return this.getRandomResponse(happyResponses, recentResponses);
    }

    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      const angryResponses = [
        "Anger often signals that something important to you needs attention. It's a valid emotion, and you're allowed to feel it. What situation is triggering these feelings?",
        "I hear your frustration, and it's completely understandable to feel this way. Anger can actually give us valuable information. What's behind these feelings?",
        "It sounds like something has really upset you. Your feelings are valid. Would you like to talk about what's causing this anger?"
      ];
      return this.getRandomResponse(angryResponses, recentResponses);
    }

    if (message.includes('tired') || message.includes('exhausted') || message.includes('sleepy')) {
      const tiredResponses = [
        "Feeling tired is your body and mind asking for care. Rest isn't just okay—it's necessary for your wellbeing. What's been draining your energy lately?",
        "Exhaustion can affect everything we do. It's important to listen to what your body is telling you. Have you been able to get quality rest?",
        "Being tired can make everything feel harder. You deserve rest and restoration. What kind of rest would feel most helpful right now?"
      ];
      return this.getRandomResponse(tiredResponses, recentResponses);
    }

    // Self-care and coping responses
    if (message.includes('help') || message.includes('support') || message.includes('advice')) {
      const helpResponses = [
        "I'm here to support you through whatever you're facing. Sometimes the best help starts with being heard and understood. What specific support would feel most helpful?",
        "It takes strength to ask for help, and I'm honored that you're reaching out. What's the main thing you'd like support with today?",
        "I'm glad you're seeking support - that's a sign of wisdom and self-care. What kind of guidance would be most valuable for you right now?"
      ];
      return this.getRandomResponse(helpResponses, recentResponses);
    }

    if (message.includes('alone') || message.includes('lonely') || message.includes('isolated')) {
      const lonelyResponses = [
        "Feeling alone can be really difficult, but reaching out like you're doing now shows incredible strength. I'm here with you. What connection would feel most meaningful?",
        "Loneliness is a tough emotion to sit with. But you're not truly alone - I'm here, and there are people who care about you. What kind of connection are you longing for?",
        "I hear that you're feeling isolated. That takes courage to share. Even though it might not feel like it, you matter and your presence makes a difference."
      ];
      return this.getRandomResponse(lonelyResponses, recentResponses);
    }

    // Thanks and positive feedback
    if (message.includes('thank') || message.includes('appreciate')) {
      const thanksResponses = [
        "You're so welcome! It means a lot that you're taking time for your mental wellbeing. How else can I support you today?",
        "I'm honored to be part of your wellness journey. Thank you for being open and trusting me with your thoughts and feelings.",
        "Your gratitude touches my heart. It's a privilege to support you. What else would be helpful to explore together?"
      ];
      return this.getRandomResponse(thanksResponses, recentResponses);
    }

    // Crisis or serious concern responses
    if (message.includes('hurt myself') || message.includes('end it') || message.includes('suicide')) {
      return "I'm really concerned about you and want you to get the support you deserve. Please reach out to a crisis helpline or trusted person immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. You matter, and there are people who want to help you through this.";
    }

    // Conversation starters and general responses
    const conversationLength = conversationHistory.length;
    
    if (conversationLength === 0) {
      // First interaction
      const firstResponses = [
        "I'm so glad you're here and willing to share with me. How are you feeling in this moment, and what brought you here today?",
        "Welcome! I'm here to listen and support you. What's something that's been on your mind lately that you'd like to talk about?",
        "Thank you for reaching out. It takes courage to start a conversation about our wellbeing. What would you like to explore together?"
      ];
      return this.getRandomResponse(firstResponses, recentResponses);
    } else if (conversationLength < 3) {
      // Early conversation
      const earlyResponses = [
        "I appreciate you sharing that with me. How does it feel to put those thoughts into words?",
        "Thank you for being open with me. What else has been on your mind that you'd like to explore?",
        "I hear you. Sometimes talking through our experiences can bring new clarity. What stands out most to you about what you just shared?"
      ];
      return this.getRandomResponse(earlyResponses, recentResponses);
    } else {
      // Ongoing conversation
      const ongoingResponses = [
        "As we continue talking, I'm noticing themes in what you're sharing. What feels most important for you to focus on right now?",
        "You've been really thoughtful in our conversation. What insights are emerging for you as we talk?",
        "I value the trust you're showing by continuing to share with me. What direction would feel most helpful for our conversation?",
        "You're doing important work by reflecting on your experiences. What would you like to explore more deeply?",
        "I'm curious about what you're discovering about yourself through our conversation. What's resonating most with you?"
      ];
      return this.getRandomResponse(ongoingResponses, recentResponses);
    }
  }

  private getRandomResponse(responses: string[], recentResponses: string[]): string {
    // Filter out responses that were used recently
    const availableResponses = responses.filter(response => 
      !recentResponses.some(recent => recent.includes(response.substring(0, 20)))
    );
    
    // If all responses were used recently, use all responses (but still random)
    const responsePool = availableResponses.length > 0 ? availableResponses : responses;
    
    return responsePool[Math.floor(Math.random() * responsePool.length)];
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