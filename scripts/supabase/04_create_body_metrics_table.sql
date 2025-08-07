CREATE TABLE IF NOT EXISTS public.body_metrics (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  weight_kg numeric,
  height_cm numeric,
  body_fat_percent numeric,
  log_date date DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
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
