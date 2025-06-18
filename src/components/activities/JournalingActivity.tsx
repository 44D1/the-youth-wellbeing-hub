
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Heart, Save } from 'lucide-react';

interface JournalingActivityProps {
  onBack: () => void;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
}

const JournalingActivity: React.FC<JournalingActivityProps> = ({ onBack, mood }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<string[]>([]);

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

  const handleSave = () => {
    if (journalEntry.trim()) {
      setSavedEntries([...savedEntries, journalEntry]);
      setJournalEntry('');
    }
  };

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
                  <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-purple-700 text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="journal" className="block text-lg font-semibold text-slate-700 mb-2">
                Your Thoughts
              </label>
              <Textarea
                id="journal"
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your thoughts here..."
                className="min-h-48 bg-white border-purple-200 focus:border-purple-400 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={!journalEntry.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>

            {savedEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Previous Reflections</h3>
                <div className="space-y-4">
                  {savedEntries.map((entry, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-slate-700 whitespace-pre-wrap">{entry}</p>
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
