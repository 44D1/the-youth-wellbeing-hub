
-- Create a table for user mood check-ins
CREATE TABLE public.mood_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user journal entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user mood sharing posts
CREATE TABLE public.mood_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  background_style VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for user goals
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create a table for routine tracking
CREATE TABLE public.routine_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  activity VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for daily challenge completions
CREATE TABLE public.challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  challenge_type VARCHAR(50) NOT NULL,
  challenge_title VARCHAR(200) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for AI chat conversations
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for mood_checkins
CREATE POLICY "Users can view their own mood checkins" ON public.mood_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood checkins" ON public.mood_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for journal_entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journal entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Create policies for mood_shares
CREATE POLICY "Users can view their own mood shares" ON public.mood_shares FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood shares" ON public.mood_shares FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood shares" ON public.mood_shares FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood shares" ON public.mood_shares FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_goals
CREATE POLICY "Users can view their own goals" ON public.user_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.user_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.user_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.user_goals FOR DELETE USING (auth.uid() = user_id);

-- Create policies for routine_entries
CREATE POLICY "Users can view their own routine entries" ON public.routine_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own routine entries" ON public.routine_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routine entries" ON public.routine_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routine entries" ON public.routine_entries FOR DELETE USING (auth.uid() = user_id);

-- Create policies for challenge_completions
CREATE POLICY "Users can view their own challenge completions" ON public.challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own challenge completions" ON public.challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenge completions" ON public.challenge_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own challenge completions" ON public.challenge_completions FOR DELETE USING (auth.uid() = user_id);

-- Create policies for chat_conversations
CREATE POLICY "Users can view their own chat conversations" ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat conversations" ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
