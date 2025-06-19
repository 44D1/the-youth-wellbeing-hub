
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoodType } from './MoodCheckIn';
import { getActivitiesForMood, Activity } from '@/data/activityData';
import { getMoodMessage, getMoodEmoji } from '@/utils/moodUtils';
import ActivityCard from './ActivityCard';

interface ActivityRecommendationsProps {
  selectedMood: MoodType;
  onBackToMoodCheck: () => void;
  onActivitySelect: (activityType: string) => void;
}

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
            <ActivityCard
              key={activity.id}
              activity={activity}
              onActivityClick={handleActivityClick}
            />
          ))}
        </div>

        <div className="text-center">
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
