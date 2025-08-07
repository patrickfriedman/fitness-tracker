-- Create planned_workouts table
create table planned_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  title text not null,
  description text,
  exercises jsonb -- Store array of exercise objects: [{name: 'Push-ups', sets: '3', reps: '10', weight: 'bodyweight'}]
);

-- Set up Row Level Security (RLS)
alter table planned_workouts enable row level security;

create policy "Users can view their own planned workouts."
  on planned_workouts for select using (auth.uid() = user_id);

create policy "Users can insert their own planned workouts."
  on planned_workouts for insert with check (auth.uid() = user_id);

create policy "Users can update their own planned workouts."
  on planned_workouts for update using (auth.uid() = user_id);

create policy "Users can delete their own planned workouts."
  on planned_workouts for delete using (auth.uid() = user_id);
