CREATE TABLE public.water_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  amount_ml numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, date)
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Water logs are viewable by their owner." ON public.water_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Water logs can be inserted by their owner." ON public.water_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Water logs can be updated by their owner." ON public.water_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Water logs can be deleted by their owner." ON public.water_logs
  FOR DELETE USING (auth.uid() = user_id);
