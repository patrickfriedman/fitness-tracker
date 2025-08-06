CREATE TABLE public.planned_workouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT planned_workouts_pkey PRIMARY KEY (id),
  CONSTRAINT planned_workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own planned workouts" ON public.planned_workouts FOR ALL TO authenticated USING ((auth.uid() = user_id));
