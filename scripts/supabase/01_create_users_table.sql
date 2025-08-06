CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  email text UNIQUE NOT NULL,
  primary_goal text DEFAULT 'general_fitness'::text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile." ON public.users
  FOR DELETE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can create a profile." ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
