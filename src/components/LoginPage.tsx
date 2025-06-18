
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-sm border-white/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center float">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MindfulMe
          </CardTitle>
          <CardDescription className="text-slate-600">
            We're glad you're here. Your wellbeing journey starts today.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
                Email Address
              </label>
              <p className="text-xs text-purple-600 mb-2">
                Enter your email to access your personalized wellbeing dashboard
              </p>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-300 text-purple-900 placeholder:text-purple-400"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
                Password
              </label>
              <p className="text-xs text-purple-600 mb-2">
                Create a secure password to protect your personal information
              </p>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-purple-50 border-purple-200 focus:border-purple-400 focus:ring-purple-300 text-purple-900 placeholder:text-purple-400"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            
            <div>
              <button className="text-sm text-slate-500 hover:text-slate-600 transition-colors">
                Forgot Password?
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
            <p className="text-sm text-center text-slate-600">
              <span className="font-medium text-green-700">Safe Space:</span> Your privacy and wellbeing are our priority
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
