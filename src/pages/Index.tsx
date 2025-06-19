
import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import AIChatbot from '@/components/AIChatbot';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import JournalingActivity from '@/components/activities/JournalingActivity';
import BreathingActivity from '@/components/activities/BreathingActivity';
import MoodSharingActivity from '@/components/activities/MoodSharingActivity';
import SupportActivity from '@/components/activities/SupportActivity';
import StretchingActivity from '@/components/activities/StretchingActivity';
import GoalSettingActivity from '@/components/activities/GoalSettingActivity';
import RoutineTrackingActivity from '@/components/activities/RoutineTrackingActivity';
import DailyChallengeActivity from '@/components/activities/DailyChallengeActivity';
import PlaylistActivity from '@/components/activities/PlaylistActivity';
import { MoodType } from '@/components/MoodCheckIn';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppState = 'login' | 'chat' | 'activities' | 'journaling' | 'breathing' | 'mood-sharing' | 'support' | 'stretching' | 'goal-setting' | 'routine-tracking' | 'daily-challenge' | 'playlist';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setCurrentUser(session.user.email?.split('@')[0] || '');
          setAppState('chat');
        } else {
          setAppState('login');
          setCurrentUser('');
          setSelectedMood(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setCurrentUser(session.user.email?.split('@')[0] || '');
        setAppState('chat');
      } else {
        setAppState('login');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (email: string) => {
    console.log('Login handler called for:', email);
  };

  const handleMoodDetected = async (mood: string) => {
    // Convert detected mood to MoodType and save to database
    let moodType: MoodType = 'neutral';
    if (mood === 'happy') moodType = 'happy';
    else if (mood === 'sad') moodType = 'sad';
    
    setSelectedMood(moodType);
    
    // Save mood check-in to database
    try {
      await supabase.from('mood_checkins').insert({
        user_id: user?.id,
        mood: moodType
      });
    } catch (error) {
      console.error('Error saving mood check-in:', error);
    }
    
    // Automatically show activities after mood detection
    setTimeout(() => {
      setAppState('activities');
    }, 2000);
  };

  const handleBackToChat = () => {
    setAppState('chat');
    setSelectedMood(null);
  };

  const handleActivitySelect = (activityType: string) => {
    switch (activityType) {
      case 'journaling':
        setAppState('journaling');
        break;
      case 'breathing':
        setAppState('breathing');
        break;
      case 'mood-sharing':
        setAppState('mood-sharing');
        break;
      case 'support':
        setAppState('support');
        break;
      case 'stretching':
        setAppState('stretching');
        break;
      case 'goal-setting':
        setAppState('goal-setting');
        break;
      case 'routine-tracking':
        setAppState('routine-tracking');
        break;
      case 'daily-challenge':
        setAppState('daily-challenge');
        break;
      case 'playlist':
        setAppState('playlist');
        break;
      default:
        console.log(`Activity ${activityType} not implemented yet`);
    }
  };

  const handleBackToActivities = () => {
    setAppState('activities');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'chat':
        return (
          <AIChatbot
            userName={currentUser}
            onMoodDetected={handleMoodDetected}
          />
        );
      case 'activities':
        return selectedMood ? (
          <ActivityRecommendations
            selectedMood={selectedMood}
            onBackToMoodCheck={handleBackToChat}
            onActivitySelect={handleActivitySelect}
          />
        ) : null;
      case 'journaling':
        return selectedMood ? (
          <JournalingActivity
            onBack={handleBackToActivities}
            mood={selectedMood}
          />
        ) : null;
      case 'breathing':
        return (
          <BreathingActivity
            onBack={handleBackToActivities}
          />
        );
      case 'mood-sharing':
        return (
          <MoodSharingActivity
            onBack={handleBackToActivities}
          />
        );
      case 'support':
        return (
          <SupportActivity
            onBack={handleBackToActivities}
          />
        );
      case 'stretching':
        return (
          <StretchingActivity
            onBack={handleBackToActivities}
          />
        );
      case 'goal-setting':
        return (
          <GoalSettingActivity
            onBack={handleBackToActivities}
          />
        );
      case 'routine-tracking':
        return (
          <RoutineTrackingActivity
            onBack={handleBackToActivities}
          />
        );
      case 'daily-challenge':
        return (
          <DailyChallengeActivity
            onBack={handleBackToActivities}
          />
        );
      case 'playlist':
        return (
          <PlaylistActivity
            onBack={handleBackToActivities}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
