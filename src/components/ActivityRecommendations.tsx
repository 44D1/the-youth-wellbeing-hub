
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Book, Smile, Star, Calendar, Phone } from 'lucide-react';
import { MoodType } from './MoodCheckIn';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  category: string;
  action?: string;
}

interface ActivityRecommendationsProps {
  selectedMood: MoodType;
  onBackToMoodCheck: () => void;
  onActivitySelect: (activityType: string) => void;
}

const getActivitiesForMood = (mood: MoodType): Activity[] => {
  const activities: Record<MoodType, Activity[]> = {
    'very-sad': [
      {
        id: 'breathing',
        title: 'Guided Breathing Exercise',
        description: 'Gentle breathing techniques to help you feel calmer and more centered',
        icon: <Heart className="w-5 h-5" />,
        duration: '5-10 min',
        category: 'Mindfulness',
        action: 'breathing'
      },
      {
        id: 'journaling',
        title: 'Express Your Feelings',
        description: 'Write down your thoughts in a safe, private space',
        icon: <Book className="w-5 h-5" />,
        duration: '10-15 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'support',
        title: 'Get Support',
        description: 'Access trusted helplines and support resources',
        icon: <Phone className="w-5 h-5" />,
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
        icon: <Heart className="w-5 h-5" />,
        duration: '3-5 min',
        category: 'Mindfulness',
        action: 'breathing'
      },
      {
        id: 'gentle-journal',
        title: 'Gentle Journaling',
        description: 'Light journaling prompts to help process your feelings',
        icon: <Book className="w-5 h-5" />,
        duration: '5-10 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'support',
        title: 'Talk to Someone',
        description: 'Connect with trusted adults and support services',
        icon: <Phone className="w-5 h-5" />,
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
        icon: <Star className="w-5 h-5" />,
        duration: '10-15 min',
        category: 'Movement'
      },
      {
        id: 'gratitude',
        title: 'Gratitude Practice',
        description: 'Reflect on positive aspects of your day',
        icon: <Heart className="w-5 h-5" />,
        duration: '5-10 min',
        category: 'Reflection',
        action: 'journaling'
      },
      {
        id: 'quick-meditation',
        title: 'Quick Meditation',
        description: 'Short guided breathing meditation',
        icon: <Smile className="w-5 h-5" />,
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
        icon: <Smile className="w-5 h-5" />,
        duration: '5-10 min',
        category: 'Social',
        action: 'mood-sharing'
      },
      {
        id: 'goal-setting',
        title: 'Set a Mini Goal',
        description: 'Channel your positive energy into achieving something today',
        icon: <Star className="w-5 h-5" />,
        duration: '10-15 min',
        category: 'Growth'
      },
      {
        id: 'habit-tracker',
        title: 'Track Your Habits',
        description: 'Update your daily habits and celebrate your progress',
        icon: <Calendar className="w-5 h-5" />,
        duration: '5 min',
        category: 'Growth'
      }
    ],
    'very-happy': [
      {
        id: 'celebration',
        title: 'Celebrate Your Joy',
        description: 'Create something special to remember this wonderful moment',
        icon: <Star className="w-5 h-5" />,
        duration: '10-20 min',
        category: 'Celebration',
        action: 'mood-sharing'
      },
      {
        id: 'daily-challenge',
        title: 'Fun Daily Challenge',
        description: 'Take on an exciting challenge while you\'re feeling great',
        icon: <Smile className="w-5 h-5" />,
        duration: '15-30 min',
        category: 'Growth'
      },
      {
        id: 'music-playlist',
        title: 'Uplifting Playlist',
        description: 'Listen to music that matches your amazing energy',
        icon: <Heart className="w-5 h-5" />,
        duration: '20-30 min',
        category: 'Entertainment'
      }
    ]
  };

  return activities[mood] || [];
};

const getMoodMessage = (mood: MoodType): string => {
  const messages: Record<MoodType, string> = {
    'very-sad': "We understand this is a difficult time. These activities are designed to provide comfort and support.",
    'sad': "It's okay to feel this way. These gentle activities can help you navigate through your emotions.",
    'neutral': "You're in a balanced space. These activities can help you maintain or improve your wellbeing.",
    'happy': "It's wonderful to see you feeling good! Let's build on this positive energy.",
    'very-happy': "Your joy is beautiful! Here are some ways to celebrate and share your happiness."
  };

  return messages[mood] || '';
};

const getMoodEmoji = (mood: MoodType): string => {
  const emojis: Record<MoodType, string> = {
    'very-sad': '😔',
    'sad': '🙁',
    'neutral': '😐',
    'happy': '🙂',
    'very-happy': '😄'
  };

  return emojis[mood] || '😐';
};

const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({
  selectedMood,
  onBackToMoodCheck,
  onActivitySelect
}) => {
  const activities = getActivitiesForMood(selectedMood);
  const moodMessage = getMoodMessage(selectedMood);
  const moodEmoji = getMoodEmoji(selectedMood);

  const handleActivityClick = (activity: Activity) => {
    if (activity.action) {
      onActivitySelect(activity.action);
    } else {
      console.log(`Activity ${activity.id} not implemented yet`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 float">{moodEmoji}</div>
          <h1 className="text-3xl font-bold text-slate-700 mb-4">
            Personalized Activities for You
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {moodMessage}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activities.map((activity) => (
            <Card key={activity.id} className="activity-card group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                      {activity.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-700">
                        {activity.title}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-medium">
                        {activity.category}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 mb-4">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {activity.duration}
                  </span>
                  <Button 
                    onClick={() => handleActivityClick(activity)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Start Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={onBackToMoodCheck}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            Check Your Mood Again
          </Button>
          
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

export default ActivityRecommendations;
