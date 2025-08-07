-- Create body_metrics table
create table body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  weight decimal(5,2) not null, -- in kg
  body_fat decimal(4,2), -- percentage
  muscle_mass decimal(4,2) -- percentage
  -- Add other metrics like BMI, measurements if needed
);

-- Set up Row Level Security (RLS)
alter table body_metrics enable row level security;

create policy "Users can view their own body metrics."
  on body_metrics for select using (auth.uid() = user_id);

create policy "Users can insert their own body metrics."
  on body_metrics for insert with check (auth.uid() = user_id);

create policy "Users can update their own body metrics."
  on body_metrics for update using (auth.uid() = user_id);

create policy "Users can delete their own body metrics."
  on body_metrics for delete using (auth.uid() = user_id);
