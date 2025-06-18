
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from '@/data/activityData';

interface ActivityCardProps {
  activity: Activity;
  onActivityClick: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onActivityClick }) => {
  return (
    <Card className="activity-card group">
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
            onClick={() => onActivityClick(activity)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            Start Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
