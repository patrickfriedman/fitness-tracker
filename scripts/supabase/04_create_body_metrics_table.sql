CREATE TABLE IF NOT EXISTS public.body_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric,
  height_cm numeric,
  body_fat_percent numeric,
  muscle_mass_kg numeric,
  created_at timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own body metrics." ON public.body_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body metrics." ON public.body_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics." ON public.body_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics." ON public.body_metrics
  FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE body_metrics;
