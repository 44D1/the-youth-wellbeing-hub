
import React, { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import MoodCheckIn from '@/components/MoodCheckIn';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import JournalingActivity from '@/components/activities/JournalingActivity';
import BreathingActivity from '@/components/activities/BreathingActivity';
import MoodSharingActivity from '@/components/activities/MoodSharingActivity';
import SupportActivity from '@/components/activities/SupportActivity';
import { MoodType } from '@/components/MoodCheckIn';

type AppState = 'login' | 'mood-check' | 'activities' | 'journaling' | 'breathing' | 'mood-sharing' | 'support';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleLogin = (email: string) => {
    setCurrentUser(email.split('@')[0]);
    setAppState('mood-check');
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
