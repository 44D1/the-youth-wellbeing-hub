
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DailyBadgeProps {
  className?: string;
}

const DailyBadge: React.FC<DailyBadgeProps> = ({ className }) => {
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    calculateStreak();
  }, []);

  const calculateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get mood check-ins from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('mood_checkins')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mood check-ins:', error);
        return;
      }

      // Calculate consecutive days
      const today = new Date();
      let streak = 0;
      const checkinDates = new Set();

      // Group check-ins by date
      data?.forEach(entry => {
        const date = new Date(entry.created_at).toDateString();
        checkinDates.add(date);
      });

      // Count consecutive days from today backwards
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        if (checkinDates.has(checkDate.toDateString())) {
          streak++;
        } else {
          break;
        }
      }

      setStreakDays(Math.min(streak, 7));
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const getBadgeContent = () => {
    if (streakDays === 0) {
      return {
        icon: <Star className="w-3 h-3" />,
        text: 'Start Journey',
        color: 'bg-gray-500'
      };
    } else if (streakDays <= 3) {
      return {
        icon: <Star className="w-3 h-3" />,
        text: `${streakDays} Day${streakDays > 1 ? 's' : ''}`,
        color: 'bg-blue-500'
      };
    } else if (streakDays <= 6) {
      return {
        icon: <Award className="w-3 h-3" />,
        text: `${streakDays} Days`,
        color: 'bg-purple-500'
      };
    } else {
      return {
        icon: <Trophy className="w-3 h-3" />,
        text: 'Week Master!',
        color: 'bg-yellow-500'
      };
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <Badge className={`${badgeContent.color} text-white hover:opacity-90 transition-opacity flex items-center gap-1 ${className}`}>
      {badgeContent.icon}
      {badgeContent.text}
    </Badge>
  );
};

export default DailyBadge;
