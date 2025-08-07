CREATE TABLE IF NOT EXISTS public.planned_workouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  planned_date date NOT NULL,
  workout_name text NOT NULL,
  duration_minutes integer,
  created_at timestamp with time zone DEFAULT NOW()
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
