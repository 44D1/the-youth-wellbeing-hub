
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingActivityProps {
  onBack: () => void;
}

const BreathingActivity: React.FC<BreathingActivityProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            setPhase((currentPhase) => {
              if (currentPhase === 'inhale') return 'hold';
              if (currentPhase === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-green-400 to-green-500';
      case 'hold': return 'from-yellow-400 to-yellow-500';
      case 'exhale': return 'from-blue-400 to-blue-500';
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
            <CardTitle className="text-2xl text-slate-700">Guided Breathing Exercise</CardTitle>
            <p className="text-slate-600">
              Follow the breathing pattern: 4 seconds in, 4 seconds hold, 4 seconds out
            </p>
          </CardHeader>

          <CardContent className="text-center space-y-8">
            <div className="relative">
              <div className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <div className="text-white text-center">
                  <div className="text-6xl font-bold mb-2">{countdown}</div>
                  <div className="text-lg">{getPhaseText()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleBreathing}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  onClick={resetBreathing}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Breathing Exercise Videos</h3>
                <p className="text-slate-600 mb-4">Watch these guided breathing exercises for additional support:</p>
                <div className="space-y-2">
                  <a 
                    href="https://www.youtube.com/watch?v=ZhJyFpKTrCw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-white rounded border border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-slate-700">🎥 4-7-8 Breathing Technique for Anxiety Relief</span>
                  </a>
                  <a 
                    href="https://www.youtube.com/watch?v=YRPh_GaiL8s" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 bg-white rounded border border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-slate-700">🎥 5-Minute Guided Breathing for Calm</span>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathingActivity;
