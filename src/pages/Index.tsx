
import React, { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import MoodCheckIn from '@/components/MoodCheckIn';
import ActivityRecommendations from '@/components/ActivityRecommendations';
import { MoodType } from '@/components/MoodCheckIn';

type AppState = 'login' | 'mood-check' | 'activities';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleLogin = (email: string) => {
    setCurrentUser(email.split('@')[0]); // Use first part of email as name
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
          />
        ) : null;
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
