
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JoyfulMoment {
  id: string;
  message: string;
  background: string;
  date: string;
  timestamp: number;
}

interface MoodSharingActivityProps {
  onBack: () => void;
}

const MoodSharingActivity: React.FC<MoodSharingActivityProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('bg-gradient-to-br from-pink-400 to-purple-500');
  const [savedMoments, setSavedMoments] = useState<JoyfulMoment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const backgrounds = [
    'bg-gradient-to-br from-pink-400 to-purple-500',
    'bg-gradient-to-br from-green-400 to-blue-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-blue-400 to-purple-500',
    'bg-gradient-to-br from-emerald-400 to-cyan-500'
  ];

  useEffect(() => {
    loadSavedMoments();
  }, []);

  const loadSavedMoments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('mood_shares')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading mood shares:', error);
        toast({
          title: "Error",
          description: "Failed to load previous moments.",
          variant: "destructive",
        });
      } else {
        const formattedMoments = data?.map(entry => ({
          id: entry.id,
          message: entry.message,
          background: entry.background_style,
          date: formatDate(new Date(entry.created_at).getTime()),
          timestamp: new Date(entry.created_at).getTime()
        })) || [];
        setSavedMoments(formattedMoments);
      }
    } catch (error) {
      console.error('Error loading mood shares:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleShare = () => {
    const shareText = message || "Feeling great today! 😄";
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Mood Today',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const platforms = [
        { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
        { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
        { name: 'Discord', url: `https://discord.com/channels/@me` },
        { name: 'Instagram', url: 'https://www.instagram.com/' },
        { name: 'Snapchat', url: 'https://www.snapchat.com/' }
      ];
      
      // Create a simple modal with sharing options
      const shareModal = document.createElement('div');
      shareModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      shareModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
          <h3 class="text-lg font-semibold mb-4">Share on:</h3>
          <div class="space-y-2">
            ${platforms.map(platform => 
              `<a href="${platform.url}" target="_blank" class="block p-2 border rounded hover:bg-gray-50 text-center">${platform.name}</a>`
            ).join('')}
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 w-full p-2 bg-gray-200 rounded">Cancel</button>
        </div>
      `;
      document.body.appendChild(shareModal);
    }
  };

  const handleSave = async () => {
    if (!message.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('mood_shares')
        .insert({
          user_id: user.id,
          message: message.trim(),
          background_style: selectedBackground
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newMoment: JoyfulMoment = {
        id: data.id,
        message: data.message,
        background: data.background_style,
        date: formatDate(new Date(data.created_at).getTime()),
        timestamp: new Date(data.created_at).getTime()
      };

      setSavedMoments([newMoment, ...savedMoments]);
      setMessage('');

      toast({
        title: "Moment Saved",
        description: "Your joyful moment has been saved successfully!",
        className: "bg-white border-green-200 text-slate-900",
      });
    } catch (error) {
      console.error('Error saving mood share:', error);
      toast({
        title: "Error",
        description: "Failed to save your moment. Please try again.",
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
          <p className="text-purple-600">Loading your moments...</p>
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
                className="bg-white border-purple-200 focus:border-purple-400 text-black placeholder:text-gray-500"
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
                onClick={handleSave}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                disabled={!message.trim() || isSaving}
              >
                <Download className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>

            {savedMoments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Previous Joyful Moments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedMoments.map((moment) => (
                    <div key={moment.id} className="bg-white rounded-lg p-4 shadow-sm border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-purple-700">{moment.date}</span>
                      </div>
                      <div className={`w-full h-32 rounded-lg ${moment.background} flex items-center justify-center p-4 text-white text-center`}>
                        <div>
                          <div className="text-2xl mb-2">😄</div>
                          <p className="text-sm font-medium">{moment.message}</p>
                        </div>
                      </div>
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

export default MoodSharingActivity;
