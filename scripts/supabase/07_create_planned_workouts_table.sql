CREATE TABLE public.planned_workouts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL,
    name text NULL,
    notes text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT planned_workouts_pkey PRIMARY KEY (id),
    CONSTRAINT planned_workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own planned workouts"
ON public.planned_workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own planned workouts"
ON public.planned_workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own planned workouts"
ON public.planned_workouts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own planned workouts"
ON public.planned_workouts FOR DELETE
USING (auth.uid() = user_id);
