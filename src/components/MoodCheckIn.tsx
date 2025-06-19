
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MoodChatbot from './MoodChatbot';
import LogoutButton from './LogoutButton';
import DailyBadge from './DailyBadge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type MoodType = 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';

interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  color: string;
}

interface MoodCheckInProps {
  onMoodSelect: (mood: MoodType) => void;
  onBackToMoodCheck?: () => void;
  onOpenAIChat?: () => void;
  onOpenMoodHistory?: () => void;
  onOpenResources?: () => void;
  userName?: string;
  showBackButton?: boolean;
}

const moodOptions: MoodOption[] = [
  { id: 'very-sad', emoji: '😔', label: 'Very Sad', color: 'from-blue-400 to-blue-500' },
  { id: 'sad', emoji: '🙁', label: 'Sad', color: 'from-blue-300 to-blue-400' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'from-gray-300 to-gray-400' },
  { id: 'happy', emoji: '🙂', label: 'Happy', color: 'from-green-300 to-green-400' },
  { id: 'very-happy', emoji: '😄', label: 'Very Happy', color: 'from-green-400 to-green-500' },
];

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ 
  onMoodSelect, 
  onBackToMoodCheck, 
  onOpenAIChat, 
  onOpenMoodHistory,
  onOpenResources,
  userName, 
  showBackButton = false 
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const saveMoodToDatabase = async (mood: MoodType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('mood_checkins')
        .insert({
          user_id: user.id,
          mood: mood,
        });

      if (error) {
        throw error;
      }

      console.log('Mood saved successfully:', mood);
      toast({
        title: "Mood Saved",
        description: "Your mood has been recorded successfully!",
        className: "bg-white border-green-200 text-slate-900",
      });
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save your mood. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleMoodClick = async (mood: MoodType) => {
    if (isSubmitting) return;
    
    setSelectedMood(mood);
    setIsSubmitting(true);

    try {
      await saveMoodToDatabase(mood);
      
      setTimeout(() => {
        onMoodSelect(mood);
      }, 300);
    } catch (error) {
      // Reset selection if save failed
      setSelectedMood(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with badge, back button and logout button */}
        <div className="flex justify-between items-start mb-8">
          {/* Left side - Badge and Back button */}
          <div className="flex items-center gap-4">
            <DailyBadge />
            {showBackButton && onBackToMoodCheck && (
              <Button
                onClick={onBackToMoodCheck}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>
          
          {/* Center - Welcome message */}
          <div className="text-center flex-1 mx-8">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-200 inline-block mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-700 mb-2">
                Welcome back{userName ? `, ${userName}` : ''}! 
              </h1>
              <p className="text-xl text-slate-600 gentle-pulse">
                How are you feeling today?
              </p>
            </div>
          </div>
          
          {/* Right side - Logout button */}
          <LogoutButton />
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-lg text-slate-700">
              Choose your current mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {moodOptions.map((mood) => (
                <div
                  key={mood.id}
                  onClick={() => handleMoodClick(mood.id)}
                  className={`mood-card ${
                    selectedMood === mood.id ? 'ring-4 ring-purple-300 scale-105' : ''
                  } ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="text-center">
                    <span className="mood-emoji hover:scale-110">
                      {mood.emoji}
                    </span>
                    <h3 className="font-medium text-slate-700 mb-2">
                      {mood.label}
                    </h3>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${mood.color} opacity-60`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {isSubmitting && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 text-purple-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm">Saving your mood...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Your mood check-ins help us provide personalized support for your wellbeing journey
          </p>
          
          {/* Button row */}
          <div className="flex justify-center gap-4 flex-wrap">
            {onOpenResources && (
              <Button
                onClick={onOpenResources}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-3 rounded-lg font-medium shadow-sm"
              >
                Mental Health Resources
              </Button>
            )}
            
            {onOpenAIChat && (
              <Button
                onClick={onOpenAIChat}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                Chat with our Helper AI
              </Button>
            )}
            
            {onOpenMoodHistory && (
              <Button
                onClick={onOpenMoodHistory}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-6 py-3 rounded-lg font-medium shadow-sm"
              >
                Mood History Log
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot component */}
      {selectedMood && (
        <MoodChatbot mood={selectedMood} userName={userName} />
      )}
    </div>
  );
};

export default MoodCheckIn;
