CREATE TABLE public.nutrition_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL,
  food_items jsonb[] NULL DEFAULT '{}'::jsonb[],
  total_calories numeric NULL,
  total_protein numeric NULL,
  total_carbs numeric NULL,
  total_fat numeric NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nutrition_logs_pkey PRIMARY KEY (id),
  CONSTRAINT nutrition_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage their own nutrition logs" ON public.nutrition_logs FOR ALL TO authenticated USING ((auth.uid() = user_id));
