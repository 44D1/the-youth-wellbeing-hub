
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getMoodEmoji, getMoodMessage } from '@/utils/moodUtils';

interface MoodEntry {
  id: string;
  mood: string;
  created_at: string;
}

interface MoodHistoryPageProps {
  onBack: () => void;
}

const MoodHistoryPage: React.FC<MoodHistoryPageProps> = ({ onBack }) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('mood_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) {
        throw error;
      }

      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error fetching mood history:', error);
      toast({
        title: "Error",
        description: "Failed to load mood history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very-sad': return 'from-blue-400 to-blue-500';
      case 'sad': return 'from-blue-300 to-blue-400';
      case 'neutral': return 'from-gray-300 to-gray-400';
      case 'happy': return 'from-green-300 to-green-400';
      case 'very-happy': return 'from-green-400 to-green-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-slate-700 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              Mood History Log
            </h1>
            <p className="text-slate-600">Track your emotional journey over time</p>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-5 h-5" />
              Your Recent Mood Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading your mood history...</p>
              </div>
            ) : moodHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No mood check-ins yet. Start your journey today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {moodHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {getMoodEmoji(entry.mood as any)}
                      </div>
                      <div>
                        <Badge className={`bg-gradient-to-r ${getMoodColor(entry.mood)} text-white`}>
                          {entry.mood.replace('-', ' ')}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-1">
                          {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodHistoryPage;
