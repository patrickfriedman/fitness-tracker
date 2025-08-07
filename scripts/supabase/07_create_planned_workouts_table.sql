CREATE TABLE IF NOT EXISTS public.planned_workouts (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  workout_name text NOT NULL,
  workout_date date NOT NULL,
  exercises jsonb, -- Stores an array of exercise objects
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own planned workouts." ON public.planned_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planned workouts." ON public.planned_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned workouts." ON public.planned_workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned workouts." ON public.planned_workouts
  FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE planned_workouts;
