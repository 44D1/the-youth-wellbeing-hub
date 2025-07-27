
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
        icon: <Star className="w-4 h-4" />,
        text: 'Start Journey',
        className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md'
      };
    } else if (streakDays === 1) {
      return {
        icon: <Star className="w-4 h-4" />,
        text: '1 Day',
        className: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
      };
    } else if (streakDays === 2) {
      return {
        icon: <Star className="w-4 h-4 animate-pulse opacity-70" />,
        text: '2 Days',
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
      };
    } else if (streakDays === 3) {
      return {
        icon: <Star className="w-4 h-4 animate-pulse" />,
        text: '3 Days',
        className: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/40 animate-scale-in'
      };
    } else if (streakDays <= 4) {
      return {
        icon: <Award className="w-4 h-4 animate-pulse animate-bounce" />,
        text: `${streakDays} Days`,
        className: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-xl shadow-pink-500/50 animate-scale-in'
      };
    } else if (streakDays <= 6) {
      return {
        icon: <Award className="w-4 h-4 animate-pulse animate-bounce" />,
        text: `${streakDays} Days`,
        className: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-2xl shadow-orange-500/60 animate-scale-in hover:animate-pulse'
      };
    } else {
      return {
        icon: <Trophy className="w-4 h-4 animate-pulse animate-bounce drop-shadow-lg" />,
        text: 'Week Master!',
        className: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-2xl shadow-yellow-500/70 animate-scale-in border-2 border-yellow-300 hover:animate-pulse hover:shadow-yellow-400/80'
      };
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <Badge className={`${badgeContent.className} hover:opacity-90 transition-all duration-300 flex items-center gap-1 ${className}`}>
      {badgeContent.icon}
      {badgeContent.text}
    </Badge>
  );
};

export default DailyBadge;
