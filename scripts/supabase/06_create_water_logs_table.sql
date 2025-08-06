CREATE TABLE public.water_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL DEFAULT now(),
    amount_ml numeric NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT water_logs_pkey PRIMARY KEY (id),
    CONSTRAINT water_logs_user_id_date_key UNIQUE (user_id, date),
    CONSTRAINT water_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own water logs"
ON public.water_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own water logs"
ON public.water_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own water logs"
ON public.water_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own water logs"
ON public.water_logs FOR DELETE
USING (auth.uid() = user_id);
