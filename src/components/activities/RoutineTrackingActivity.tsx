
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, X, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoutineItem {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  notes?: string;
  saved?: boolean; // Track if this is saved to database
}

interface RoutineTrackingActivityProps {
  onBack: () => void;
}

const RoutineTrackingActivity: React.FC<RoutineTrackingActivityProps> = ({ onBack }) => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRoutineEntries();
  }, [selectedDate]);

  const loadRoutineEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('routine_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', selectedDate)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading routine entries:', error);
        toast({
          title: "Error",
          description: "Failed to load routine entries.",
          variant: "destructive",
        });
      } else {
        const formattedEntries = data?.map(entry => ({
          id: entry.id,
          text: entry.activity,
          time: '09:00', // Default time since we don't store time in DB
          completed: entry.completed || false,
          notes: entry.notes || '',
          saved: true
        })) || [];
        setRoutineItems(formattedEntries);
      }
    } catch (error) {
      console.error('Error loading routine entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoutineItem = async (item: RoutineItem) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (item.saved) {
        // Update existing item
        const { error } = await supabase
          .from('routine_entries')
          .update({
            activity: item.text,
            completed: item.completed,
            notes: item.notes || ''
          })
          .eq('id', item.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('routine_entries')
          .insert({
            user_id: user.id,
            activity: item.text,
            entry_date: selectedDate,
            completed: item.completed,
            notes: item.notes || ''
          })
          .select()
          .single();

        if (error) throw error;

        // Update the item with the database ID
        setRoutineItems(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, id: data.id, saved: true }
            : prevItem
        ));
      }
    } catch (error) {
      console.error('Error saving routine item:', error);
      toast({
        title: "Error",
        description: "Failed to save routine item.",
        variant: "destructive",
      });
    }
  };

  const addRoutineItem = async () => {
    if (newItemText.trim() && newItemTime) {
      const tempId = Date.now().toString();
      const newItem: RoutineItem = {
        id: tempId,
        text: newItemText.trim(),
        time: newItemTime,
        completed: false,
        saved: false
      };

      setRoutineItems(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
      setNewItemText('');
      setNewItemTime('');

      // Save to database
      await saveRoutineItem(newItem);
    }
  };

  const removeRoutineItem = async (id: string) => {
    const item = routineItems.find(item => item.id === id);
    
    if (item?.saved) {
      try {
        const { error } = await supabase
          .from('routine_entries')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting routine item:', error);
        toast({
          title: "Error",
          description: "Failed to delete routine item.",
          variant: "destructive",
        });
        return;
      }
    }

    setRoutineItems(routineItems.filter(item => item.id !== id));
  };

  const toggleComplete = async (id: string) => {
    const updatedItems = routineItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setRoutineItems(updatedItems);

    // Save to database
    const item = updatedItems.find(item => item.id === id);
    if (item) {
      await saveRoutineItem(item);
    }
  };

  const onDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const draggedItem = routineItems.find(item => item.id === draggedItemId);
    
    if (draggedItem) {
      const newItems = routineItems.filter(item => item.id !== draggedItemId);
      newItems.splice(targetIndex, 0, draggedItem);
      setRoutineItems(newItems);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const completedCount = routineItems.filter(item => item.completed).length;
  const progressPercentage = routineItems.length > 0 ? (completedCount / routineItems.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading your routine...</p>
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
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-purple-600 mr-2" />
              <CardTitle className="text-2xl text-slate-700">Track Your Routine</CardTitle>
            </div>
            <p className="text-slate-600">
              Organize your daily habits and routines to stay on track
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border-purple-200 focus:border-purple-400"
              />
              <p className="text-sm text-slate-600 mt-1">{formatDate(selectedDate)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Routine Item
                </label>
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="e.g., Morning meditation, Study session..."
                  className="bg-white border-purple-200 focus:border-purple-400 placeholder:text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    value={newItemTime}
                    onChange={(e) => setNewItemTime(e.target.value)}
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                  <Button
                    onClick={addRoutineItem}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {routineItems.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-700">Your Daily Routine</h3>
                  <div className="text-sm text-slate-600">
                    {completedCount}/{routineItems.length} completed ({progressPercentage.toFixed(0)}%)
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                <div className="space-y-2">
                  {routineItems.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, index)}
                      className={`p-4 bg-white rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-300 transition-all cursor-move ${
                        item.completed ? 'opacity-60 bg-green-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleComplete(item.id)}
                            className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                          />
                          <div>
                            <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-slate-700'}`}>
                              {item.text}
                            </span>
                            <div className="text-sm text-slate-500">{item.time}</div>
                            {item.saved && (
                              <div className="text-xs text-purple-600">Saved</div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeRoutineItem(item.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-700 mb-2">💡 Routine Tips</h4>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>• Drag and drop items to reorder your routine</li>
                <li>• Start with 3-5 manageable habits</li>
                <li>• Check off completed items to track progress</li>
                <li>• Be consistent but flexible with timing</li>
                <li>• Your entries are automatically saved</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoutineTrackingActivity;
