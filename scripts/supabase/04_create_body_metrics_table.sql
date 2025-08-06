CREATE TABLE public.body_metrics (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  weight numeric,
  height numeric,
  body_fat_percentage numeric,
  muscle_mass_percentage numeric,
  waist_circumference numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, date) -- Ensure only one entry per user per day
);

ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Body metrics are viewable by their owner." ON public.body_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Body metrics can be created by their owner." ON public.body_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Body metrics can be updated by their owner." ON public.body_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Body metrics can be deleted by their owner." ON public.body_metrics
  FOR DELETE USING (auth.uid() = user_id);
