
import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import MoodCheckIn from '@/components/MoodCheckIn';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import JournalingActivity from '@/components/activities/JournalingActivity';
import BreathingActivity from '@/components/activities/BreathingActivity';
import MoodSharingActivity from '@/components/activities/MoodSharingActivity';
import SupportActivity from '@/components/activities/SupportActivity';
import { MoodType } from '@/components/MoodCheckIn';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AppState = 'login' | 'mood-check' | 'activities' | 'journaling' | 'breathing' | 'mood-sharing' | 'support';

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
          setAppState('mood-check');
        } else {
          setAppState('login');
          setCurrentUser('');
          setSelectedMood(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setCurrentUser(session.user.email?.split('@')[0] || '');
        setAppState('mood-check');
      } else {
        setAppState('login');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (email: string) => {
    // This will be handled by the auth state change listener
    console.log('Login handler called for:', email);
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setAppState('activities');
  };

  const handleBackToMoodCheck = () => {
    setAppState('mood-check');
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
      case 'mood-check':
        return (
          <MoodCheckIn
            onMoodSelect={handleMoodSelect}
            userName={currentUser}
          />
        );
      case 'activities':
        return selectedMood ? (
          <ActivityRecommendations
            selectedMood={selectedMood}
            onBackToMoodCheck={handleBackToMoodCheck}
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
