import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage';
import MoodCheckIn from '@/components/MoodCheckIn';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import AIChatScreen from '@/components/AIChatScreen';
import MoodHistoryPage from '@/components/MoodHistoryPage';
import MentalHealthResources from '@/components/MentalHealthResources';
import NicknamePrompt from '@/components/NicknamePrompt';
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

type AppState = 'login' | 'nickname-prompt' | 'mood-check' | 'activities' | 'ai-chat' | 'mood-history' | 'resources' | 'journaling' | 'breathing' | 'mood-sharing' | 'support' | 'stretching' | 'goal-setting' | 'routine-tracking' | 'daily-challenge' | 'playlist';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSetNickname, setHasSetNickname] = useState(false);

  const checkIfFirstTimeUser = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking if first time user for userId:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('user_id', userId)
        .single();
      
      console.log('Profile query result:', { data, error });
      
      if (error && error.code === 'PGRST116') {
        // No profile found - first time user
        console.log('No profile found for user, showing nickname prompt');
        return true;
      } else if (error) {
        console.error('Error checking user profile:', error);
        return true; // Assume first time user if error
      }
      
      // User is first time if they don't have a nickname set
      const isFirstTime = !data?.nickname;
      console.log('Profile check result:', { data, isFirstTime, nickname: data?.nickname });
      return isFirstTime;
    } catch (error) {
      console.error('Error checking first time user:', error);
      return true; // Assume first time user if error
    }
  };

  const saveAppState = (state: AppState) => {
    if (user) {
      localStorage.setItem(`app_state_${user.id}`, state);
    }
  };

  const getSavedAppState = (userId: string): AppState | null => {
    const savedState = localStorage.getItem(`app_state_${userId}`);
    return savedState as AppState || null;
  };

  const saveMoodState = (mood: MoodType) => {
    if (user) {
      localStorage.setItem(`selected_mood_${user.id}`, mood);
    }
  };

  const getSavedMoodState = (userId: string): MoodType | null => {
    const savedMood = localStorage.getItem(`selected_mood_${userId}`);
    return savedMood as MoodType || null;
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer async operations to avoid blocking the auth state change
          setTimeout(async () => {
            const emailName = session.user.email?.split('@')[0] || '';
            
            try {
              // Check if this is the user's first time
              const isFirstTime = await checkIfFirstTimeUser(session.user.id);
              
              if (isFirstTime) {
                // First time user - show nickname prompt
                setCurrentUser(emailName);
                setHasSetNickname(false);
                setAppState('nickname-prompt');
              } else {
                // Returning user - get nickname from database
                const { data } = await supabase
                  .from('profiles')
                  .select('nickname')
                  .eq('user_id', session.user.id)
                  .single();
                
                const nickname = data?.nickname || emailName;
                setCurrentUser(nickname);
                setHasSetNickname(true);
                
                // Restore previous app state and mood if available
                const savedState = getSavedAppState(session.user.id);
                const savedMood = getSavedMoodState(session.user.id);
                
                if (savedState && savedState !== 'login' && savedState !== 'nickname-prompt') {
                  setAppState(savedState);
                  if (savedMood) {
                    setSelectedMood(savedMood);
                  }
                } else {
                  setAppState('mood-check');
                }
              }
            } catch (error) {
              console.error('Error during auth state setup:', error);
              // Fallback to nickname prompt on error
              setCurrentUser(emailName);
              setHasSetNickname(false);
              setAppState('nickname-prompt');
            }
            setIsLoading(false);
          }, 0);
        } else {
          // User logged out or not authenticated
          setAppState('login');
          setCurrentUser('');
          setSelectedMood(null);
          setHasSetNickname(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const emailName = session.user.email?.split('@')[0] || '';
        
        try {
          // Check if this is the user's first time
          const isFirstTime = await checkIfFirstTimeUser(session.user.id);
          
          if (isFirstTime) {
            // First time user - show nickname prompt
            setCurrentUser(emailName);
            setHasSetNickname(false);
            setAppState('nickname-prompt');
          } else {
            // Returning user - get nickname from database
            const { data } = await supabase
              .from('profiles')
              .select('nickname')
              .eq('user_id', session.user.id)
              .single();
            
            const nickname = data?.nickname || emailName;
            setCurrentUser(nickname);
            setHasSetNickname(true);
            
            // Restore previous app state and mood if available
            const savedState = getSavedAppState(session.user.id);
            const savedMood = getSavedMoodState(session.user.id);
            
            if (savedState && savedState !== 'login' && savedState !== 'nickname-prompt') {
              setAppState(savedState);
              if (savedMood) {
                setSelectedMood(savedMood);
              }
            } else {
              setAppState('mood-check');
            }
          }
        } catch (error) {
          console.error('Error during initial session setup:', error);
          // Fallback to nickname prompt on error
          setCurrentUser(emailName);
          setHasSetNickname(false);
          setAppState('nickname-prompt');
        }
      } else {
        setAppState('login');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (email: string) => {
    console.log('Login handler called for:', email);
    // The actual login is handled in LoginPage component
    // This is just for any additional logic if needed
  };

  const handleNicknameSet = async (nickname: string) => {
    if (user) {
      try {
        // Save the nickname to the database
        const { error } = await supabase
          .from('profiles')
          .update({ nickname })
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error saving nickname:', error);
          return;
        }
        
        setCurrentUser(nickname);
        setHasSetNickname(true);
        setAppState('mood-check');
        saveAppState('mood-check');
      } catch (error) {
        console.error('Error in handleNicknameSet:', error);
      }
    }
  };

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setAppState('activities');
    saveMoodState(mood);
    saveAppState('activities');
  };

  const handleBackToMoodCheck = () => {
    setAppState('mood-check');
    setSelectedMood(null);
    saveAppState('mood-check');
    if (user) {
      localStorage.removeItem(`selected_mood_${user.id}`);
    }
  };

  const handleOpenAIChat = () => {
    setAppState('ai-chat');
    saveAppState('ai-chat');
  };

  const handleCloseAIChat = () => {
    setAppState('mood-check');
    saveAppState('mood-check');
  };

  const handleOpenMoodHistory = () => {
    setAppState('mood-history');
    saveAppState('mood-history');
  };

  const handleOpenResources = () => {
    setAppState('resources');
    saveAppState('resources');
  };

  const handleActivitySelect = (activityType: string) => {
    switch (activityType) {
      case 'journaling':
        setAppState('journaling');
        saveAppState('journaling');
        break;
      case 'breathing':
        setAppState('breathing');
        saveAppState('breathing');
        break;
      case 'mood-sharing':
        setAppState('mood-sharing');
        saveAppState('mood-sharing');
        break;
      case 'support':
        setAppState('support');
        saveAppState('support');
        break;
      case 'stretching':
        setAppState('stretching');
        saveAppState('stretching');
        break;
      case 'goal-setting':
        setAppState('goal-setting');
        saveAppState('goal-setting');
        break;
      case 'routine-tracking':
        setAppState('routine-tracking');
        saveAppState('routine-tracking');
        break;
      case 'daily-challenge':
        setAppState('daily-challenge');
        saveAppState('daily-challenge');
        break;
      case 'playlist':
        setAppState('playlist');
        saveAppState('playlist');
        break;
      default:
        console.log(`Activity ${activityType} not implemented yet`);
    }
  };

  const handleBackToActivities = () => {
    setAppState('activities');
    saveAppState('activities');
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
    console.log('Current app state:', appState, 'User:', user);
    
    switch (appState) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'nickname-prompt':
        return (
          <NicknamePrompt
            onNicknameSet={handleNicknameSet}
            currentName={currentUser}
          />
        );
      case 'mood-check':
        return (
          <MoodCheckIn
            onMoodSelect={handleMoodSelect}
            onOpenAIChat={handleOpenAIChat}
            onOpenMoodHistory={handleOpenMoodHistory}
            onOpenResources={handleOpenResources}
            userName={currentUser}
          />
        );
      case 'ai-chat':
        return (
          <AIChatScreen
            onClose={handleCloseAIChat}
            userName={currentUser}
          />
        );
      case 'mood-history':
        return (
          <MoodHistoryPage
            onBack={handleBackToMoodCheck}
          />
        );
      case 'resources':
        return (
          <MentalHealthResources
            onBack={handleBackToMoodCheck}
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
            mood={selectedMood}
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
