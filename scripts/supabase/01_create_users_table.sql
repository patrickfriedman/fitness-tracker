CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  primary_goal text NULL DEFAULT 'general_fitness'::text,
  preferences jsonb NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." ON public.users
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile." ON public.users
  FOR DELETE TO authenticated USING (auth.uid() = id);
