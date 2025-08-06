CREATE TABLE public.users (
    id uuid NOT NULL,
    name text NULL,
    email text NULL,
    primary_goal text NULL DEFAULT 'general_fitness'::text,
    preferences jsonb NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert their own profile"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to delete their own profile"
ON public.users FOR DELETE
USING (auth.uid() = id);
