
import React, { useState, useEffect, useRef } from 'react';
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
  mood?: string;
}

const MoodSharingActivity: React.FC<MoodSharingActivityProps> = ({ onBack, mood }) => {
  const [message, setMessage] = useState('');
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState(0);
  const [savedMoments, setSavedMoments] = useState<JoyfulMoment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const backgrounds = [
    { class: 'bg-gradient-to-br from-pink-400 to-purple-500', colors: ['#f472b6', '#a855f7'] },
    { class: 'bg-gradient-to-br from-green-400 to-blue-500', colors: ['#4ade80', '#3b82f6'] },
    { class: 'bg-gradient-to-br from-yellow-400 to-orange-500', colors: ['#facc15', '#f97316'] },
    { class: 'bg-gradient-to-br from-blue-400 to-purple-500', colors: ['#60a5fa', '#a855f7'] },
    { class: 'bg-gradient-to-br from-emerald-400 to-cyan-500', colors: ['#34d399', '#06b6d4'] }
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

  const generatePostcardImage = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Canvas context not available');
      return null;
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Create gradient background
    const selectedBg = backgrounds[selectedBackgroundIndex];
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, selectedBg.colors[0]);
    gradient.addColorStop(1, selectedBg.colors[1]);

    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add rounded corners effect using arc instead of roundRect for better compatibility
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    const cornerRadius = 20;
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(canvas.width - cornerRadius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, cornerRadius);
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - cornerRadius, canvas.height);
    ctx.lineTo(cornerRadius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Add emoji
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('😄', canvas.width / 2, 180);

    // Add message text
    const displayMessage = message || "What's making you happy today?";
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Word wrap
    const words = displayMessage.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas.width - 100;

    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    // Draw text lines
    const lineHeight = 40;
    const startY = 280;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
    });

    // Add app branding
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Created with MindfulMe', canvas.width / 2, canvas.height - 30);

    // Convert to blob with better quality
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Generated blob size:', blob.size, 'bytes');
          console.log('Generated blob type:', blob.type);
        } else {
          console.error('Failed to generate blob');
        }
        resolve(blob);
      }, 'image/png', 1.0);
    });
  };

  const handleShare = async () => {
    if (!message.trim()) {
      toast({
        title: "Please add a message",
        description: "Add a message to your postcard before sharing.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting image generation...');
      const imageBlob = await generatePostcardImage();
      if (!imageBlob) {
        throw new Error('Failed to generate postcard image');
      }

      const file = new File([imageBlob], 'joyful-moment.png', { type: 'image/png' });
      console.log('Created file:', file.name, file.size, 'bytes, type:', file.type);

      const shareData = {
        title: 'My Joyful Moment',
        text: message,
        files: [file]
      };

      // For "Happy" and "Very Happy" moods, always download instead of sharing
      if (mood === 'happy' || mood === 'very-happy') {
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'joyful-moment.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Image Downloaded",
          description: "Your postcard has been downloaded!",
          className: "bg-white border-green-200 text-slate-900",
        });
      } else {
        // For other moods, use the original Web Share API with fallback
        console.log('Share data:', shareData);
        console.log('Can share files:', navigator.canShare && navigator.canShare(shareData));

        if (navigator.canShare && navigator.canShare(shareData)) {
          console.log('Using Web Share API...');
          await navigator.share(shareData);
          console.log('Share completed successfully');
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(imageBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'joyful-moment.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "Image Downloaded",
            description: "Your postcard has been downloaded. You can now share it manually!",
            className: "bg-white border-green-200 text-slate-900",
          });
        }
      }
    } catch (error) {
      console.error('Error sharing postcard:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share postcard. Please try again.",
        variant: "destructive",
      });
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
          background_style: backgrounds[selectedBackgroundIndex].class
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
                    onClick={() => setSelectedBackgroundIndex(index)}
                    className={`w-16 h-16 rounded-lg ${bg.class} border-4 transition-all ${
                      selectedBackgroundIndex === index ? 'border-purple-400 scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Preview</h3>
              <div className={`w-80 h-48 mx-auto rounded-lg ${backgrounds[selectedBackgroundIndex].class} flex items-center justify-center p-6 text-white text-center shadow-lg`}>
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
