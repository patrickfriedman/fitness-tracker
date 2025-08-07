# Fitness Tracker

This is a fitness tracker application built with Next.js and Supabase.

## Features

- User authentication (Sign up, Sign in, Sign out)
- Track daily water intake
- Log mood
- Record body metrics (weight, height, body fat, muscle mass)
- Plan and log workouts
- Track nutrition (calories, macros)
- Activity heatmap and weekly summary

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd fitness-tracker
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Set up Supabase

1. Create a new project on [Supabase](https://supabase.com/).
2. Go to "Settings" -> "API" to find your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Go to "Project Settings" -> "API Keys" to find your `SUPABASE_SERVICE_ROLE_KEY`.
4. Create a `.env.local` file in the root of your project and add the following:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Or your deployment URL
\`\`\`

### 4. Run Supabase Migrations (Optional, but recommended for schema setup)

You can use the SQL scripts in the `scripts/supabase` directory to set up your database schema.
You can run these manually in your Supabase SQL Editor or use a tool like `supabase-cli`.

### 5. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and components.
- `components/`: Reusable UI components (shadcn/ui).
- `contexts/`: React Contexts for global state (e.g., AuthContext, ThemeContext).
- `hooks/`: Custom React hooks.
- `lib/`: Utility functions and Supabase client setup.
- `public/`: Static assets.
- `scripts/`: SQL scripts for database setup.
- `types/`: TypeScript type definitions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
