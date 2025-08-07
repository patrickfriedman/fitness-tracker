CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  mood_level TEXT NOT NULL, -- e.g., 'happy', 'neutral', 'sad'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, log_date) -- Ensure only one entry per user per day
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs." ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood logs." ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood logs." ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs." ON mood_logs
  FOR DELETE USING (auth.uid() = user_id);
