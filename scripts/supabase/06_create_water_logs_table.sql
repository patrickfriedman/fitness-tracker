CREATE TABLE IF NOT EXISTS public.water_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount_ml integer NOT NULL,
  log_date date DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own water logs." ON public.water_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own water logs." ON public.water_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water logs." ON public.water_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water logs." ON public.water_logs
  FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE water_logs;
