CREATE TABLE public.planned_workouts (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Planned workouts are viewable by their owner." ON public.planned_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Planned workouts can be created by their owner." ON public.planned_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Planned workouts can be updated by their owner." ON public.planned_workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Planned workouts can be deleted by their owner." ON public.planned_workouts
  FOR DELETE USING (auth.uid() = user_id);
