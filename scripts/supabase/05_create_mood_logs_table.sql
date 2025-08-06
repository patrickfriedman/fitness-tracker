CREATE TABLE public.mood_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  mood_score integer NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, date) -- Ensure only one entry per user per day
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mood logs are viewable by their owner." ON public.mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Mood logs can be created by their owner." ON public.mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mood logs can be updated by their owner." ON public.mood_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mood logs can be deleted by their owner." ON public.mood_logs
  FOR DELETE USING (auth.uid() = user_id);
