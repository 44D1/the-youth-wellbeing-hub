
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Star, CheckCircle, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface DailyChallengeActivityProps {
  onBack: () => void;
}

const DailyChallengeActivity: React.FC<DailyChallengeActivityProps> = ({ onBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Gratitude List',
      description: 'Write down 5 things you are grateful for today and share one with a friend or family member.',
      category: 'Mindfulness',
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Random Act of Kindness',
      description: 'Do something nice for someone without expecting anything in return. It could be as simple as holding a door or giving a compliment.',
      category: 'Social',
      difficulty: 'Easy'
    },
    {
      id: '3',
      title: 'Learn Something New',
      description: 'Spend 30 minutes learning about a topic that interests you. Watch a TED talk, read an article, or try a new skill.',
      category: 'Growth',
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'Digital Detox Hour',
      description: 'Spend one hour completely disconnected from all digital devices. Use this time for reading, walking, or meditation.',
      category: 'Wellness',
      difficulty: 'Medium'
    },
    {
      id: '5',
      title: 'Creative Expression',
      description: 'Create something artistic today - draw, write a poem, compose a song, or make a craft. Express yourself creatively for at least 20 minutes.',
      category: 'Creativity',
      difficulty: 'Medium'
    },
    {
      id: '6',
      title: 'Organize Your Space',
      description: 'Declutter and organize one area of your living space. A clean environment can boost your mood and productivity.',
      category: 'Productivity',
      difficulty: 'Easy'
    },
    {
      id: '7',
      title: 'Connect with Nature',
      description: 'Spend at least 45 minutes outdoors. Go for a walk, sit in a park, or tend to plants. Notice the natural world around you.',
      category: 'Wellness',
      difficulty: 'Easy'
    },
    {
      id: '8',
      title: 'Skill Building Challenge',
      description: 'Practice a skill you want to improve for 1 hour. This could be a musical instrument, a language, coding, or any hobby.',
      category: 'Growth',
      difficulty: 'Hard'
    },
    {
      id: '9',
      title: 'Memory Lane',
      description: 'Look through old photos or videos and share a favorite memory with someone close to you. Reflect on positive experiences.',
      category: 'Reflection',
      difficulty: 'Easy'
    },
    {
      id: '10',
      title: 'Fitness Challenge',
      description: 'Do a 30-minute workout or physical activity. This could be dancing, yoga, walking, or any exercise you enjoy.',
      category: 'Health',
      difficulty: 'Medium'
    },
    {
      id: '11',
      title: 'Goal Planning Session',
      description: 'Spend 45 minutes planning and writing down your goals for the next month. Break them into actionable steps.',
      category: 'Productivity',
      difficulty: 'Hard'
    },
    {
      id: '12',
      title: 'Cook Something New',
      description: 'Try cooking a new recipe or dish you have never made before. Enjoy the process and share it with others.',
      category: 'Life Skills',
      difficulty: 'Medium'
    }
  ];

  const getDailyChallenge = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('dailyChallengeDate');
    const savedChallenge = localStorage.getItem('dailyChallenge');
    
    if (savedDate === today && savedChallenge) {
      return JSON.parse(savedChallenge);
    } else {
      // Generate new challenge for today
      const randomIndex = Math.floor(Math.random() * challenges.length);
      const newChallenge = challenges[randomIndex];
      
      localStorage.setItem('dailyChallengeDate', today);
      localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
      
      return newChallenge;
    }
  };

  const generateNewChallenge = () => {
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const newChallenge = challenges[randomIndex];
    setCurrentChallenge(newChallenge);
    setIsCompleted(false);
    
    // Update localStorage
    const today = new Date().toDateString();
    localStorage.setItem('dailyChallengeDate', today);
    localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
  };

  const loadCompletedChallenges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('challenge_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completion_date', { ascending: false });

      if (error) {
        console.error('Error loading completed challenges:', error);
      } else {
        setCompletedChallenges(data || []);
      }
    } catch (error) {
      console.error('Error loading completed challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const challenge = getDailyChallenge();
    setCurrentChallenge(challenge);
    
    // Check if challenge was completed today
    const completedDate = localStorage.getItem('challengeCompletedDate');
    const today = new Date().toDateString();
    setIsCompleted(completedDate === today);
    
    loadCompletedChallenges();
  }, []);

  const markAsCompleted = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save your progress.",
          variant: "destructive",
        });
        return;
      }

      // Save to database
      const { data, error } = await supabase
        .from('challenge_completions')
        .insert({
          user_id: user.id,
          challenge_type: currentChallenge?.category || 'General',
          challenge_title: currentChallenge?.title || 'Daily Challenge',
          challenge_description: currentChallenge?.description || '',
          completed: true,
          completion_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving challenge completion:', error);
        toast({
          title: "Error",
          description: "Failed to save your progress.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setIsCompleted(true);
      const today = new Date().toDateString();
      localStorage.setItem('challengeCompletedDate', today);
      
      // Add to completed challenges list
      setCompletedChallenges([data, ...completedChallenges]);
      
      toast({
        title: "Challenge Completed!",
        description: "Great job! Your accomplishment has been saved.",
      });
    } catch (error) {
      console.error('Error marking challenge as completed:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Mindfulness': 'bg-purple-100 text-purple-700',
      'Social': 'bg-blue-100 text-blue-700',
      'Growth': 'bg-green-100 text-green-700',
      'Wellness': 'bg-teal-100 text-teal-700',
      'Creativity': 'bg-pink-100 text-pink-700',
      'Productivity': 'bg-orange-100 text-orange-700',
      'Reflection': 'bg-indigo-100 text-indigo-700',
      'Health': 'bg-red-100 text-red-700',
      'Life Skills': 'bg-amber-100 text-amber-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!currentChallenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-yellow-500 mr-2" />
              <CardTitle className="text-2xl text-slate-700">Fun Daily Challenge</CardTitle>
            </div>
            <p className="text-slate-600">
              Take on an exciting challenge to feel a greater sense of accomplishment!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentChallenge.category)}`}>
                  {currentChallenge.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentChallenge.difficulty)}`}>
                  {currentChallenge.difficulty}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {currentChallenge.title}
              </h2>
              
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 mb-6">
                <p className="text-slate-700 text-lg leading-relaxed">
                  {currentChallenge.description}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {!isCompleted ? (
                  <Button
                    onClick={markAsCompleted}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Challenge Completed! Great job! 🎉
                  </div>
                )}
                
                <Button
                  onClick={generateNewChallenge}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Challenge
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-700 mb-2">🌟 Challenge Tips</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Take your time - there's no rush to complete the challenge</li>
                <li>• Make it your own - adapt the challenge to fit your situation</li>
                <li>• Share your experience with friends or family</li>
                <li>• Every small step counts towards personal growth</li>
              </ul>
            </div>

            {/* Completed Challenges List */}
            {completedChallenges.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-semibold text-slate-700">Your Accomplishments</h3>
                </div>
                <p className="text-slate-600 text-center mb-4">
                  Look at all the amazing things you've accomplished! 🎉
                </p>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {completedChallenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className="bg-white/70 p-4 rounded-lg border border-green-100 hover:bg-white/90 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-700 mb-1">{challenge.challenge_title}</h4>
                            {challenge.challenge_description && (
                              <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                                {challenge.challenge_description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.challenge_type)}`}>
                                {challenge.challenge_type}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(challenge.completion_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl ml-3">🏆</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-green-600">{completedChallenges.length}</span> challenges completed!
                    Keep up the amazing work! ✨
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallengeActivity;
