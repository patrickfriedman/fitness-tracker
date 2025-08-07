CREATE TABLE body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  weight_kg NUMERIC,
  height_cm NUMERIC,
  body_fat_percent NUMERIC,
  muscle_mass_percent NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, log_date) -- Ensure only one entry per user per day
);

ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own body metrics." ON body_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own body metrics." ON body_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own body metrics." ON body_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own body metrics." ON body_metrics
  FOR DELETE USING (auth.uid() = user_id);
