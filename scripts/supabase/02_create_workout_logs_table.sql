create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  workout_date date not null default current_date,
  type text, -- e.g., 'Strength', 'Cardio', 'HIIT'
  duration_minutes int,
  calories_burned int,
  notes text,
  exercises jsonb, -- Store exercises as JSONB array of objects {name, sets, reps, weight}
  created_at timestamp with time zone default now()
);

alter table workout_logs enable row level security;

create policy "Users can view their own workout logs."
  on workout_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own workout logs."
  on workout_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own workout logs."
  on workout_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own workout logs."
  on workout_logs for delete using (auth.uid() = user_id);
