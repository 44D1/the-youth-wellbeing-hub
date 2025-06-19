
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  created_at: string;
}

interface AIChatbotProps {
  userName?: string;
  onMoodDetected?: (mood: string) => void;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ userName, onMoodDetected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveChatMessage = async (message: string, sender: 'user' | 'ai') => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          message,
          sender
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simple AI response logic - in a real app, you'd connect to an AI service
    const responses = {
      greeting: [
        "Hello! I'm here to support your mental wellbeing. How are you feeling today?",
        "Hi there! I'm your personal wellness companion. What's on your mind?",
        "Welcome! I'm here to listen and help. How can I support you today?"
      ],
      sad: [
        "I understand you're feeling sad. It's okay to feel this way. Would you like to talk about what's bothering you?",
        "Sadness is a natural emotion. I'm here to listen. What's making you feel this way?",
        "I hear that you're going through a tough time. Can you tell me more about what's happening?"
      ],
      happy: [
        "That's wonderful to hear! I'm glad you're feeling good. What's bringing you joy today?",
        "It's great that you're feeling happy! Would you like to share what's making you feel this way?",
        "I love hearing about positive moments! What's been going well for you?"
      ],
      anxious: [
        "Anxiety can be overwhelming. Remember to take deep breaths. What's causing you to feel anxious?",
        "I understand anxiety can be difficult. You're not alone. What triggers are you experiencing?",
        "Feeling anxious is valid. Let's work through this together. What's on your mind?"
      ],
      default: [
        "Thank you for sharing that with me. How does that make you feel?",
        "I'm here to listen and support you. Can you tell me more about that?",
        "It's great that you're opening up. What would you like to explore further?"
      ]
    };

    const lowerMessage = userMessage.toLowerCase();
    
    // Detect mood from message
    let detectedMood = 'neutral';
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      detectedMood = 'sad';
      if (onMoodDetected) onMoodDetected('sad');
      return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      detectedMood = 'happy';
      if (onMoodDetected) onMoodDetected('happy');
      return responses.happy[Math.floor(Math.random() * responses.happy.length)];
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      detectedMood = 'anxious';
      if (onMoodDetected) onMoodDetected('sad');
      return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }

    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to UI immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      message: userMessage,
      sender: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Save user message to database
      await saveChatMessage(userMessage, 'user');

      // Generate AI response
      const aiResponse = await generateAIResponse(userMessage);
      
      // Add AI response to UI
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        sender: 'ai',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);

      // Save AI response to database
      await saveChatMessage(aiResponse, 'ai');

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-700">Loading your chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center float mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-700 mb-2">
            Welcome back{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-lg text-slate-600">
            Chat with your AI wellness companion
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-lg text-slate-700 flex items-center justify-center gap-2">
              <Bot className="w-5 h-5" />
              AI Wellness Companion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-slate-50 rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p>Start a conversation with your AI wellness companion!</p>
                  <p className="text-sm mt-2">I'm here to listen and support your mental wellbeing.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 mb-4 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 text-slate-700"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-red-700 mb-2 font-medium">
              Need immediate help?
            </p>
            <p className="text-sm text-red-600">
              Call Kids Helpline: <strong>1800 55 1800</strong> or visit your local emergency services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
