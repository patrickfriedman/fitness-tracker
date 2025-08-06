CREATE TABLE public.water_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  amount_ml numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT water_logs_pkey PRIMARY KEY (id),
  CONSTRAINT water_logs_user_id_date_key UNIQUE (user_id, date),
  CONSTRAINT water_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own water logs" ON public.water_logs FOR ALL TO authenticated USING ((auth.uid() = user_id));
