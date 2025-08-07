-- Create mood_logs table
create table mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  mood text not null, -- e.g., 'happy', 'neutral', 'sad', 'stressed', 'energetic', 'tired'
  notes text
);

-- Set up Row Level Security (RLS)
alter table mood_logs enable row level security;

create policy "Users can view their own mood logs."
  on mood_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own mood logs."
  on mood_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own mood logs."
  on mood_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own mood logs."
  on mood_logs for delete using (auth.uid() = user_id);
