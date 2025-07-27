-- Insert profiles for existing users who don't have profiles yet
INSERT INTO public.profiles (user_id, nickname)
SELECT u.id, SPLIT_PART(u.email, '@', 1)
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;