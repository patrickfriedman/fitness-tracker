CREATE TABLE public.body_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  weight numeric NULL,
  height numeric NULL,
  body_fat_percentage numeric NULL,
  muscle_mass_percentage numeric NULL,
  waist_circumference numeric NULL,
  notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT body_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT body_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own body metrics" ON public.body_metrics FOR ALL TO authenticated USING ((auth.uid() = user_id));
