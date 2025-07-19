-- Update existing accomplishments with proper descriptions
UPDATE public.challenge_completions 
SET challenge_description = 'Write down 5 things you are grateful for today and share one with a friend or family member.'
WHERE challenge_title = 'Gratitude List' AND (challenge_description IS NULL OR challenge_description = '');

UPDATE public.challenge_completions 
SET challenge_description = 'Create something artistic today - draw, write a poem, compose a song, or make a craft. Express yourself creatively for at least 20 minutes.'
WHERE challenge_title = 'Creative Expression' AND (challenge_description IS NULL OR challenge_description = '');