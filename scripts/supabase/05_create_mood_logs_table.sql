CREATE TABLE public.mood_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  mood_score integer NOT NULL,
  notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT mood_logs_pkey PRIMARY KEY (id),
  CONSTRAINT mood_logs_user_id_date_key UNIQUE (user_id, date),
  CONSTRAINT mood_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own mood logs" ON public.mood_logs FOR ALL TO authenticated USING ((auth.uid() = user_id));
