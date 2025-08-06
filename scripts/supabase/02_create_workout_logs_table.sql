CREATE TABLE public.workout_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  duration_minutes numeric NULL,
  exercises jsonb[] NULL DEFAULT '{}'::jsonb[],
  notes text NULL,
  calories_burned numeric NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own workout logs" ON public.workout_logs FOR ALL TO authenticated USING ((auth.uid() = user_id));
