
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Timer, Bell, Play, Pause, RotateCcw } from 'lucide-react';

interface GoalSettingActivityProps {
  onBack: () => void;
}

const GoalSettingActivity: React.FC<GoalSettingActivityProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'timer' | 'reminder'>('timer');
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [reminderGoal, setReminderGoal] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderEmail, setReminderEmail]= useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      // Timer completed notification
      alert('Great job! Time to take a break and reflect on what you accomplished!');
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(timerMinutes * 60);
  };

  const setTimer = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsTimerActive(false);
  };

  const handleReminderSubmit = () => {
    if (!reminderGoal || !reminderDate || !reminderTime || !reminderEmail) {
      alert('Please fill in all fields for the reminder.');
      return;
    }

    // In a real app, this would send to a backend service
    alert(`Reminder set! You'll receive an email at ${reminderEmail} on ${reminderDate} at ${reminderTime} about: "${reminderGoal}"`);
    
    // Clear form
    setReminderGoal('');
    setReminderDate('');
    setReminderTime('');
    setReminderEmail('');
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
            <CardTitle className="text-2xl text-slate-700">Set a Mini Goal</CardTitle>
            <p className="text-slate-600">
              Channel your positive energy into achieving something today
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={() => setActiveTab('timer')}
                variant={activeTab === 'timer' ? 'default' : 'outline'}
                className={activeTab === 'timer' ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'border-purple-200 text-purple-600'}
              >
                <Timer className="w-4 h-4 mr-2" />
                Timer
              </Button>
              <Button
                onClick={() => setActiveTab('reminder')}
                variant={activeTab === 'reminder' ? 'default' : 'outline'}
                className={activeTab === 'reminder' ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'border-purple-200 text-purple-600'}
              >
                <Bell className="w-4 h-4 mr-2" />
                Reminder
              </Button>
            </div>

            {activeTab === 'timer' && (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-4">Productivity Timer</h3>
                  <p className="text-slate-600 mb-6">
                    Set a timer to focus on a specific task and make your day better!
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  {[15, 25, 45, 60].map((minutes) => (
                    <Button
                      key={minutes}
                      onClick={() => setTimer(minutes)}
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      disabled={isTimerActive}
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>

                <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
                    <div className="text-lg">Focus Time</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={isTimerActive ? pauseTimer : startTimer}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    {isTimerActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isTimerActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-4">Set a Reminder</h3>
                  <p className="text-slate-600 mb-6">
                    Never forget important goals and events with email reminders!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Goal or Event
                  </label>
                  <Textarea
                    value={reminderGoal}
                    onChange={(e) => setReminderGoal(e.target.value)}
                    placeholder="What would you like to be reminded about?"
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="bg-white border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="bg-white border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                </div>

                <Button
                  onClick={handleReminderSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalSettingActivity;
