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

    // Mood-related responses with actual help
    if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
      const sadResponses = [
        "I hear that you're feeling sad. Here are some things that can help: Try gentle movement like a short walk, listen to music that comforts you, or do something creative like drawing or writing. It's also okay to let yourself feel sad - these emotions will pass.",
        "Sadness is heavy, but you don't have to carry it alone. Consider reaching out to a friend, practicing deep breathing for 5 minutes, or doing one small self-care activity like making tea or taking a warm shower. These feelings are temporary.",
        "When we're feeling down, small actions can make a big difference. Try getting some sunlight, eating something nourishing, or watching something that usually makes you smile. Remember: this feeling will shift, even if it doesn't feel like it right now."
      ];
      return this.getRandomResponse(sadResponses, recentResponses);
    }

    if (message.includes('anxious') || message.includes('worried') || message.includes('nervous')) {
      const anxiousResponses = [
        "Anxiety can be overwhelming, but here are some immediate tools: Try the 4-7-8 breathing technique (breathe in for 4, hold for 7, out for 8). Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This grounds you in the present moment.",
        "For anxiety, focus on what you can control right now. Take slow, deep breaths and remind yourself: 'I am safe in this moment.' Try progressive muscle relaxation - tense and release each muscle group from your toes to your head.",
        "Anxiety often comes from worrying about the future. Bring yourself back to now: feel your feet on the ground, take three deep breaths, and remind yourself that most of what we worry about never happens. You're stronger than your anxiety."
      ];
      return this.getRandomResponse(anxiousResponses, recentResponses);
    }

    if (message.includes('stressed') || message.includes('overwhelmed')) {
      const stressResponses = [
        "Stress can feel overwhelming, but let's break it down: First, take 5 deep breaths. Then write down 3 things stressing you and tackle just ONE today. Try the 'two-minute rule' - if something takes less than 2 minutes, do it now. For bigger tasks, break them into smaller steps.",
        "When overwhelmed, your brain needs a reset. Try this: Step away for 10 minutes, go outside if possible, and do some gentle stretching. Then prioritize your tasks by importance and tackle them one at a time. You don't have to do everything at once.",
        "Overwhelm happens when we try to hold too much at once. Here's what helps: Make a list of everything on your mind, choose the TOP 3 priorities, and ignore the rest for today. Take breaks between tasks and celebrate small wins."
      ];
      return this.getRandomResponse(stressResponses, recentResponses);
    }

    if (message.includes('happy') || message.includes('good') || message.includes('great') || message.includes('excited')) {
      const happyResponses = [
        "That's wonderful! When we're feeling good, it's great to anchor these positive moments. Consider writing down what made you happy today, sharing your joy with someone you care about, or doing something creative to express this positive energy.",
        "I love hearing that you're doing well! Positive emotions are so valuable. You could enhance this feeling by practicing gratitude, spending time in nature, or engaging in activities that bring you more joy. Savor this moment!",
        "That's fantastic! Good feelings deserve to be celebrated. Consider taking a moment to appreciate this happiness, maybe do something kind for yourself or others, or use this positive energy to tackle something you've been putting off."
      ];
      return this.getRandomResponse(happyResponses, recentResponses);
    }

    if (message.includes('angry') || message.includes('frustrated') || message.includes('mad')) {
      const angryResponses = [
        "Anger is a valid emotion that often signals something needs attention. Here's what can help: Take 10 deep breaths, go for a walk or do some physical exercise, write down your feelings without censoring, or talk to someone you trust. Physical release often helps with anger.",
        "When we're frustrated, our body holds tension. Try this: clench your fists tight for 10 seconds, then release. Do some jumping jacks or push-ups. Sometimes we need to move the energy before we can think clearly. Then consider what specific action might address what's bothering you.",
        "Anger can be powerful fuel for positive change. Channel it constructively: write about what's bothering you, then brainstorm 3 possible solutions. Do something physical to release the tension. Remember: you can feel angry and still respond thoughtfully."
      ];
      return this.getRandomResponse(angryResponses, recentResponses);
    }

    if (message.includes('tired') || message.includes('exhausted') || message.includes('sleepy')) {
      const tiredResponses = [
        "Exhaustion is your body asking for care. Here's what helps: Aim for 7-9 hours of sleep tonight, take a 10-20 minute power nap if possible, drink water and eat something nourishing, and consider what's draining your energy so you can address it.",
        "Being tired affects everything. Priority one: rest when you can. Create a calming bedtime routine, limit screen time before sleep, and consider if you're taking on too much. Sometimes 'tired' means we need emotional rest too, not just physical.",
        "Fatigue can be physical, mental, or emotional. Try gentle movement like stretching, get some fresh air, stay hydrated, and be honest about your limits. It's okay to say no to things when you're running on empty. Rest is productive."
      ];
      return this.getRandomResponse(tiredResponses, recentResponses);
    }

    // Self-care and coping responses with actual techniques
    if (message.includes('help') || message.includes('support') || message.includes('advice')) {
      const helpResponses = [
        "Here are some immediate self-care tools you can use: Practice the 5-4-3-2-1 grounding technique, take 10 deep breaths, drink a glass of water, step outside for fresh air, or call someone who cares about you. Small actions can create big shifts in how we feel.",
        "I want to give you some practical help: Create a daily routine that includes one thing you enjoy, set boundaries with people and activities that drain you, move your body in ways that feel good, and practice saying kind things to yourself like you would to a good friend.",
        "Here are proven strategies that can help: Keep a gratitude journal (write 3 things daily), practice deep breathing when stressed, maintain a regular sleep schedule, limit news/social media if it increases anxiety, and remember that asking for help is a sign of strength."
      ];
      return this.getRandomResponse(helpResponses, recentResponses);
    }

    if (message.includes('alone') || message.includes('lonely') || message.includes('isolated')) {
      const lonelyResponses = [
        "Loneliness is painful, but there are ways to connect: Reach out to one person today, even with a simple text. Join a class, volunteer, or visit a place where people gather like a library or coffee shop. Even small interactions with cashiers or neighbors can help you feel more connected.",
        "Connection doesn't always mean big social events. Try: calling a family member, commenting on a friend's social media, joining an online community about your interests, or simply being around people at a park or cafe. You matter, and the world is better with you in it.",
        "Feeling isolated is hard, but you can take small steps to connect: Write a letter or email to someone from your past, join a local club or hobby group, volunteer for a cause you care about, or even just make eye contact and smile at people you encounter today."
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
      return "I'm really concerned about you and want you to get the support you deserve. Please reach out immediately: 🆘 Call 000 for emergencies, 📞 Lifeline Australia 13 11 14 (24/7), or 🌐 Beyond Blue 1300 22 4636. You matter, and there are people who want to help you through this.";
    }

    // Specific life situations and concerns
    if (message.includes('work') || message.includes('job') || message.includes('boss') || message.includes('career')) {
      return `I hear you're dealing with work-related challenges. Work stress is really common. Consider setting clearer boundaries between work and personal time, taking short breaks during your day, and having an honest conversation with your supervisor if needed. What specific work situation is bothering you most?`;
    }

    if (message.includes('relationship') || message.includes('partner') || message.includes('boyfriend') || message.includes('girlfriend') || message.includes('marriage')) {
      return `Relationship concerns can be emotionally draining. Good communication is key - try expressing your feelings using "I" statements rather than "you" statements. Also, make sure you're taking care of your own needs too. Sometimes couples counseling can provide helpful tools. What's the main relationship challenge you're facing?`;
    }

    if (message.includes('family') || message.includes('parents') || message.includes('mom') || message.includes('dad') || message.includes('sibling')) {
      return `Family dynamics can be complex and emotionally charged. Remember that you can only control your own actions and responses, not others' behavior. Setting healthy boundaries while still showing love is possible. Sometimes family therapy or individual counseling can help navigate these relationships. What family situation is weighing on you?`;
    }

    if (message.includes('school') || message.includes('college') || message.includes('university') || message.includes('grades') || message.includes('exam')) {
      return `Academic pressure is really challenging. Break large assignments into smaller tasks, create a study schedule that includes breaks, and don't hesitate to reach out to teachers or tutors for help. Remember that grades don't define your worth as a person. What specific school challenge are you dealing with?`;
    }

    if (message.includes('friend') || message.includes('social') || message.includes('people')) {
      return `Social situations can be tricky to navigate. Good friendships require mutual respect and effort from both sides. It's okay to outgrow some friendships or set boundaries with people who drain your energy. Focus on quality connections over quantity. What's going on with your social situation?`;
    }

    if (message.includes('money') || message.includes('financial') || message.includes('bills') || message.includes('debt')) {
      return `Financial stress affects mental health significantly. Start by listing all your expenses and income to see the full picture. Look for small ways to cut costs, consider talking to a financial counselor if available, and remember that your worth isn't tied to your bank account. What specific financial concern is causing you stress?`;
    }

    if (message.includes('health') || message.includes('sick') || message.includes('pain') || message.includes('medical')) {
      return `Health concerns can be frightening and overwhelming. Make sure you're advocating for yourself with healthcare providers, seeking second opinions when needed, and focusing on what you can control like rest, nutrition, and stress management. Don't hesitate to ask for support from friends and family. What health issue is worrying you?`;
    }

    if (message.includes('future') || message.includes('plans') || message.includes('goals') || message.includes('direction')) {
      return `Uncertainty about the future is incredibly common and anxiety-provoking. Focus on taking small steps forward rather than needing to see the whole path. Set short-term goals that align with your values, and remember that it's okay to change direction as you learn and grow. What aspect of your future feels most uncertain right now?`;
    }

    // Better general response that acknowledges what they said
    const concernKeywords = ['problem', 'issue', 'trouble', 'difficult', 'hard', 'struggle', 'worry', 'concern', 'question'];
    const hasConcern = concernKeywords.some(keyword => message.includes(keyword));
    
    if (hasConcern) {
      return `I can hear that you're dealing with something challenging. While I may not have caught all the details, I want you to know that whatever you're going through is valid. Often it helps to break problems down into smaller parts - what feels like the most pressing aspect of what you're dealing with? I'm here to listen and offer support.`;
    }

    // Response for when they share something specific but not emotion-focused
    if (message.length > 10) { // They wrote something substantial
      return `Thank you for sharing that with me. I want to make sure I understand what you're going through. It sounds like there's something important on your mind. Can you tell me more about what's bothering you or what kind of support would be most helpful right now?`;
    }

    // Final fallback - acknowledge what they said and ask for clarification
    return `I hear what you're saying, though I want to make sure I fully understand your situation. Based on what you've shared, it seems like you have something important on your mind. Could you help me understand what's bothering you most, or what specific kind of support you're looking for? I'm here to help in whatever way I can.`;
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