-- Create a table for public profiles
create table users (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  email text unique,
  created_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;

create policy "Public profiles are viewable by everyone."
  on users for select using (true);

create policy "Users can insert their own profile."
  on users for insert with check (auth.uid() = id);

create policy "Users can update their own profile."
  on users for update using (auth.uid() = id);
