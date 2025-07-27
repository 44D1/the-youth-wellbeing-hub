
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalingEntry {
  id: string;
  content: string;
  date: string;
  timestamp: number;
  word_count?: number;
}

interface JournalingActivityProps {
  onBack: () => void;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
}

const JournalingActivity: React.FC<JournalingActivityProps> = ({ onBack, mood }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<JournalingEntry[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedEntries();
  }, [mood]); // Re-load when mood changes

  const loadSavedEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('mood', mood)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading journal entries:', error);
        toast({
          title: "Error",
          description: "Failed to load previous entries.",
          variant: "destructive",
        });
      } else {
        const formattedEntries = data?.map(entry => ({
          id: entry.id,
          content: entry.content,
          date: formatDate(new Date(entry.created_at).getTime()),
          timestamp: new Date(entry.created_at).getTime(),
          word_count: entry.word_count || 0
        })) || [];
        setSavedEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrompts = () => {
    const prompts = {
      'very-sad': [
        "What is one small thing that brought you comfort today?",
        "Write about someone who makes you feel safe and supported.",
        "Describe a place where you feel peaceful and calm.",
        "What would you say to a friend feeling the same way?"
      ],
      'sad': [
        "What are three things you're grateful for today?",
        "Write about a happy memory that makes you smile.",
        "What is one thing you're looking forward to?",
        "How did you show kindness to yourself today?"
      ],
      'neutral': [
        "What made today ordinary yet special?",
        "Describe something you learned about yourself recently.",
        "What are you curious about right now?",
        "Write about a goal you'd like to work towards."
      ],
      'happy': [
        "What made you smile today?",
        "Describe the positive energy you're feeling right now.",
        "Who would you like to share your happiness with?",
        "What are you most proud of today?"
      ],
      'very-happy': [
        "Capture this amazing feeling in words!",
        "What led to this wonderful moment?",
        "How can you remember this feeling for tough days?",
        "What would you tell your past self about this moment?"
      ]
    };
    return prompts[mood];
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= 500) {
      setJournalEntry(text);
      setWordCount(words.length);
    }
  };

  const handleSave = async () => {
    if (!journalEntry.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          mood: mood,
          content: journalEntry.trim(),
          word_count: wordCount
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newEntry: JournalingEntry = {
        id: data.id,
        content: data.content,
        date: formatDate(new Date(data.created_at).getTime()),
        timestamp: new Date(data.created_at).getTime(),
        word_count: data.word_count || 0
      };

      setSavedEntries([newEntry, ...savedEntries]);
      setJournalEntry('');
      setWordCount(0);

      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved successfully!",
        className: "bg-white border-green-200 text-slate-900",
      });
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading your journal...</p>
        </div>
      </div>
    );
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
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-slate-700">Express Your Feelings</CardTitle>
            <p className="text-slate-600">
              Writing can help process emotions and provide clarity. Take your time.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Reflection Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {getPrompts().map((prompt, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-slate-700 text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="journal" className="block text-lg font-semibold text-slate-700">
                  Your Thoughts
                </label>
                <span className="text-sm text-slate-500">
                  {wordCount}/500 words
                </span>
              </div>
              <Textarea
                id="journal"
                value={journalEntry}
                onChange={handleTextChange}
                placeholder="Start writing your thoughts here..."
                className="min-h-48 bg-white border-purple-200 focus:border-purple-400 resize-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={!journalEntry.trim() || isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>

            {savedEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Previous Reflections</h3>
                <div className="space-y-4">
                  {savedEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-green-700">{entry.date}</span>
                        {entry.word_count && (
                          <span className="text-xs text-green-600">{entry.word_count} words</span>
                        )}
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalingActivity;
