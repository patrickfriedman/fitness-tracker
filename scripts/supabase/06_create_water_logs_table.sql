-- Create water_logs table
create table water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  amount int not null -- in ml
);

-- Set up Row Level Security (RLS)
alter table water_logs enable row level security;

create policy "Users can view their own water logs."
  on water_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own water logs."
  on water_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own water logs."
  on water_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own water logs."
  on water_logs for delete using (auth.uid() = user_id);
