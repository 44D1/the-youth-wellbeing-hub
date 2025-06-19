
-- Enable RLS on mood_checkins table if not already enabled
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mood_checkins table
CREATE POLICY "Users can view their own mood check-ins" 
  ON public.mood_checkins 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood check-ins" 
  ON public.mood_checkins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood check-ins" 
  ON public.mood_checkins 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood check-ins" 
  ON public.mood_checkins 
  FOR DELETE 
  USING (auth.uid() = user_id);
