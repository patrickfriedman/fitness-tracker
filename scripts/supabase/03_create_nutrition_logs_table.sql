-- Create nutrition_logs table
create table nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  meal_type text not null, -- e.g., 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  food_items text not null, -- description of food eaten
  calories int not null,
  protein int, -- in grams
  carbs int, -- in grams
  fat int -- in grams
);

-- Set up Row Level Security (RLS)
alter table nutrition_logs enable row level security;

create policy "Users can view their own nutrition logs."
  on nutrition_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own nutrition logs."
  on nutrition_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own nutrition logs."
  on nutrition_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own nutrition logs."
  on nutrition_logs for delete using (auth.uid() = user_id);
