
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

interface MoodSharingActivityProps {
  onBack: () => void;
}

const MoodSharingActivity: React.FC<MoodSharingActivityProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('bg-gradient-to-br from-pink-400 to-purple-500');

  const backgrounds = [
    'bg-gradient-to-br from-pink-400 to-purple-500',
    'bg-gradient-to-br from-green-400 to-blue-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-blue-400 to-purple-500',
    'bg-gradient-to-br from-emerald-400 to-cyan-500'
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Mood Today',
        text: message || 'Feeling great today! 😄',
      });
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
            <CardTitle className="text-2xl text-slate-700">Share Your Joy</CardTitle>
            <p className="text-slate-600">
              Create a beautiful digital postcard to celebrate your positive mood
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-lg font-semibold text-slate-700 mb-2">
                Your Message
              </label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's making you happy today?"
                className="bg-white border-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-2">
                Choose Background
              </label>
              <div className="grid grid-cols-5 gap-4">
                {backgrounds.map((bg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedBackground(bg)}
                    className={`w-16 h-16 rounded-lg ${bg} border-4 transition-all ${
                      selectedBackground === bg ? 'border-purple-400 scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Preview</h3>
              <div className={`w-80 h-48 mx-auto rounded-lg ${selectedBackground} flex items-center justify-center p-6 text-white text-center shadow-lg`}>
                <div>
                  <div className="text-4xl mb-4">😄</div>
                  <p className="text-lg font-medium">
                    {message || "What's making you happy today?"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodSharingActivity;
