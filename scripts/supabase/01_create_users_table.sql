-- This script is typically handled by Supabase Auth itself.
-- You don't usually create the 'auth.users' table manually.
-- This file serves as a placeholder to acknowledge user management.

-- If you were to extend the public.users table with additional profile info:
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  fitness_goal text,
  activity_level text,
  created_at timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
