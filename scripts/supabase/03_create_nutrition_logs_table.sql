CREATE TABLE public.nutrition_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    date date NOT NULL DEFAULT now(),
    meal_type text NULL,
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

CREATE POLICY "Allow authenticated users to read their own nutrition logs"
ON public.nutrition_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own nutrition logs"
ON public.nutrition_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own nutrition logs"
ON public.nutrition_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own nutrition logs"
ON public.nutrition_logs FOR DELETE
USING (auth.uid() = user_id);
