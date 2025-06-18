
import React from 'react';
import { Heart, Book, Smile, Star, Calendar, Phone } from 'lucide-react';
import { MoodType } from '@/components/MoodCheckIn';

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  category: string;
  action?: string;
}

export const getActivitiesForMood = (mood: MoodType): Activity[] => {
  const activities: Record<MoodType, Activity[]> = {
    'very-sad': [
      {
        id: 'breathing',
        title: 'Guided Breathing Exercise',
        description: 'Gentle breathing techniques to help you feel calmer and more centered',
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        duration: '5-10 min',
        category: 'Mindfulness',
        action: 'breathing'
      },
      {
        id: 'journaling',
        title: 'Express Your Feelings',
        description: 'Write down your thoughts in a safe, private space',
        icon: React.createElement(Book, { className: "w-5 h-5" }),
        duration: '10-15 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'support',
        title: 'Get Support',
        description: 'Access trusted helplines and support resources',
        icon: React.createElement(Phone, { className: "w-5 h-5" }),
        duration: 'Immediate',
        category: 'Support',
        action: 'support'
      }
    ],
    'sad': [
      {
        id: 'breathing-basic',
        title: 'Simple Breathing',
        description: 'Basic breathing exercises to help lift your mood',
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        duration: '3-5 min',
        category: 'Mindfulness',
        action: 'breathing'
      },
      {
        id: 'gentle-journal',
        title: 'Gentle Journaling',
        description: 'Light journaling prompts to help process your feelings',
        icon: React.createElement(Book, { className: "w-5 h-5" }),
        duration: '5-10 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'support',
        title: 'Talk to Someone',
        description: 'Connect with trusted adults and support services',
        icon: React.createElement(Phone, { className: "w-5 h-5" }),
        duration: 'Immediate',
        category: 'Support',
        action: 'support'
      }
    ],
    'neutral': [
      {
        id: 'stretching',
        title: 'Light Stretching',
        description: 'Gentle movements to energize your body and mind',
        icon: React.createElement(Star, { className: "w-5 h-5" }),
        duration: '10-15 min',
        category: 'Movement'
      },
      {
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'Reflect on positive aspects of your day',
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        duration: '5-10 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'quick-meditation',
        title: 'Quick Meditation',
        description: 'Short guided breathing meditation',
        icon: React.createElement(Smile, { className: "w-5 h-5" }),
        duration: '5-10 min',
        category: 'Mindfulness',
        action: 'breathing'
      }
    ],
    'happy': [
      {
        id: 'share-mood',
        title: 'Share Your Joy',
        description: 'Create a digital postcard to celebrate your positive mood',
        icon: React.createElement(Smile, { className: "w-5 h-5" }),
        duration: '5-10 min',
        category: 'Social',
        action: 'mood-sharing'
      },
      {
        id: 'goal-setting',
        title: 'Set a Mini Goal',
        description: 'Channel your positive energy into achieving something today',
        icon: React.createElement(Star, { className: "w-5 h-5" }),
        duration: '10-15 min',
        category: 'Growth'
      },
      {
        id: 'habit-tracker',
        title: 'Track Your Habits',
        description: 'Update your daily habits and celebrate your progress',
        icon: React.createElement(Calendar, { className: "w-5 h-5" }),
        duration: '5 min',
        category: 'Growth'
      }
    ],
    'very-happy': [
      {
        id: 'celebration',
        title: 'Celebrate Your Joy',
        description: 'Create something special to remember this wonderful moment',
        icon: React.createElement(Star, { className: "w-5 h-5" }),
        duration: '10-20 min',
        category: 'Celebration',
        action: 'mood-sharing'
      },
      {
        id: 'daily-challenge',
        title: 'Fun Daily Challenge',
        description: 'Take on an exciting challenge while you\'re feeling great',
        icon: React.createElement(Smile, { className: "w-5 h-5" }),
        duration: '15-30 min',
        category: 'Growth'
      },
      {
        id: 'music-playlist',
        title: 'Uplifting Playlist',
        description: 'Listen to music that matches your amazing energy',
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        duration: '20-30 min',
        category: 'Entertainment'
      }
    ]
  };

  return activities[mood] || [];
};
