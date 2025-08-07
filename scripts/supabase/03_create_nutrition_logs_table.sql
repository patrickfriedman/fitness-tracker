CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  calories INT NOT NULL,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own nutrition logs." ON nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition logs." ON nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition logs." ON nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition logs." ON nutrition_logs
  FOR DELETE USING (auth.uid() = user_id);
