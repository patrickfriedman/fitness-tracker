CREATE TABLE public.nutrition_logs (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL,
  food_items jsonb[],
  total_calories numeric,
  total_protein numeric,
  total_carbs numeric,
  total_fat numeric,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nutrition logs are viewable by their owner." ON public.nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Nutrition logs can be inserted by their owner." ON public.nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Nutrition logs can be updated by their owner." ON public.nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Nutrition logs can be deleted by their owner." ON public.nutrition_logs
  FOR DELETE USING (auth.uid() = user_id);
