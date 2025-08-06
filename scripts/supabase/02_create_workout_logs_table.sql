CREATE TABLE public.workout_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  duration_minutes numeric,
  exercises jsonb[] DEFAULT '{}'::jsonb[],
  notes text,
  calories_burned numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workout logs are viewable by their owner." ON public.workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Workout logs can be created by their owner." ON public.workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Workout logs can be updated by their owner." ON public.workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Workout logs can be deleted by their owner." ON public.workout_logs
  FOR DELETE USING (auth.uid() = user_id);
