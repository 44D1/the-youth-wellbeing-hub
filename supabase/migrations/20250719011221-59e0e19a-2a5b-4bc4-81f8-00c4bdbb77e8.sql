-- Add description column to challenge_completions table
ALTER TABLE public.challenge_completions 
ADD COLUMN challenge_description TEXT;