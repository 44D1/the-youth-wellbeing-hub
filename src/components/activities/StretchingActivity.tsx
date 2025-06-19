
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';

interface StretchingActivityProps {
  onBack: () => void;
}

const StretchingActivity: React.FC<StretchingActivityProps> = ({ onBack }) => {
  const [showVideo, setShowVideo] = useState(false);

  const youtubeLinks = [
    {
      title: "10-Minute Morning Stretching Routine",
      url: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
      description: "Gentle stretches to start your day"
    },
    {
      title: "Desk Stretches for Students",
      url: "https://www.youtube.com/watch?v=RqcOCBb4arc",
      description: "Perfect for study breaks"
    },
    {
      title: "Relaxing Evening Stretches",
      url: "https://www.youtube.com/watch?v=02AOkIfWT-I",
      description: "Wind down with gentle movements"
    }
  ];

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
            <CardTitle className="text-2xl text-slate-700">Light Stretching</CardTitle>
            <p className="text-slate-600">
              Gentle movements to energize your body and mind
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setShowVideo(!showVideo)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mb-4"
              >
                <Play className="w-4 h-4 mr-2" />
                {showVideo ? 'Hide' : 'Show'} Built-in Video
              </Button>
              
              {showVideo && (
                <div className="bg-gray-100 rounded-lg p-8 mb-6">
                  <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-12 text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-white" />
                    <h3 className="text-xl font-semibold mb-2 text-white">5-Minute Stretching Routine</h3>
                    <p className="mb-4 text-white">Follow along with gentle stretches</p>
                    <div className="bg-white/20 rounded p-4 text-left text-sm">
                      <p className="font-semibold mb-2 text-white">Instructions:</p>
                      <ul className="space-y-1 text-white">
                        <li>• Neck rolls (30 seconds each direction)</li>
                        <li>• Shoulder shrugs (1 minute)</li>
                        <li>• Arm circles (30 seconds each direction)</li>
                        <li>• Gentle spinal twists (1 minute each side)</li>
                        <li>• Deep breathing with arm raises (1 minute)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">YouTube Stretching Videos</h3>
              <p className="text-slate-600 mb-4">Follow along with these guided stretching routines:</p>
              <div className="space-y-3">
                {youtubeLinks.map((video, index) => (
                  <a
                    key={index}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-700 group-hover:text-green-700">
                          {video.title}
                        </h4>
                        <p className="text-sm text-slate-600">{video.description}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-green-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">💡 Stretching Tips</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Hold each stretch for 15-30 seconds</li>
                <li>• Breathe deeply and don't force any movements</li>
                <li>• Stop if you feel any pain</li>
                <li>• Stay hydrated before and after stretching</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StretchingActivity;
