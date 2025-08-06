CREATE TABLE public.workout_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL DEFAULT now(),
    name text NULL,
    duration_minutes numeric NULL,
    exercises jsonb[] NULL DEFAULT '{}'::jsonb[],
    notes text NULL,
    calories_burned numeric NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT workout_logs_pkey PRIMARY KEY (id),
    CONSTRAINT workout_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own workout logs"
ON public.workout_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own workout logs"
ON public.workout_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own workout logs"
ON public.workout_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own workout logs"
ON public.workout_logs FOR DELETE
USING (auth.uid() = user_id);
