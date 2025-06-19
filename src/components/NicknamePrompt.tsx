
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface NicknamePromptProps {
  onNicknameSet: (nickname: string) => void;
  currentName: string;
}

const NicknamePrompt: React.FC<NicknamePromptProps> = ({ onNicknameSet, currentName }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNickname = nickname.trim() || currentName;
    onNicknameSet(finalNickname);
  };

  const handleSkip = () => {
    onNicknameSet(currentName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-white/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-slate-700">
            What should we call you?
          </CardTitle>
          <p className="text-slate-700">
            Choose a nickname to personalize your experience
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={`Enter your nickname (or we'll use "${currentName}")`}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-center text-lg text-slate-700"
                maxLength={20}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                Skip
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NicknamePrompt;
