CREATE TABLE public.body_metrics (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL DEFAULT now(),
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

CREATE POLICY "Allow authenticated users to read their own body metrics"
ON public.body_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own body metrics"
ON public.body_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own body metrics"
ON public.body_metrics FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own body metrics"
ON public.body_metrics FOR DELETE
USING (auth.uid() = user_id);
