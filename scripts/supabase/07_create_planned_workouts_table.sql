CREATE TABLE planned_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  exercises JSONB, -- Store array of exercise objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own planned workouts." ON planned_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planned workouts." ON planned_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned workouts." ON planned_workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned workouts." ON planned_workouts
  FOR DELETE USING (auth.uid() = user_id);
