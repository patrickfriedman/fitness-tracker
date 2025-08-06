# Fitness Tracker Application

This is a fitness tracking application built with Next.js, React, and Supabase.

## Features

- User authentication (Sign up, Login, Demo Login)
- Track daily water intake
- Log your mood
- Plan and log workouts with exercises
- Track nutrition with meal details and macros
- Visualize activity with a heatmap
- View weekly summary of workouts and calories
- Monitor body metrics history

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

This project uses Supabase for authentication and database.

#### Create a new Supabase project

Go to [Supabase](https://supabase.com/) and create a new project.

#### Configure Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your Supabase project details:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
\`\`\`

You can find these keys in your Supabase project settings under `API`. The `SUPABASE_SERVICE_ROLE_KEY` is found under `Project Settings > API > Project API keys > service_role (Secret)`.

#### Run SQL Migration Scripts

The database schema is defined in the `scripts/supabase/` folder. You can run these scripts in your Supabase SQL Editor to set up your tables:

1.  **01_create_users_table.sql**: Creates a `users` table to store additional user profile information.
2.  **02_create_workout_logs_table.sql**: Creates a `workout_logs` table to store workout details.
3.  **03_create_nutrition_logs_table.sql**: Creates a `nutrition_logs` table for meal tracking.
4.  **04_create_body_metrics_table.sql**: Creates a `body_metrics` table for physical measurements.
5.  **05_create_mood_logs_table.sql**: Creates a `mood_logs` table for daily mood tracking.
6.  **06_create_water_logs_table.sql**: Creates a `water_logs` table for water intake.
7.  **07_create_planned_workouts_table.sql**: Creates a `planned_workouts` table for future workout plans.

**Important:** Ensure Row Level Security (RLS) is enabled for your tables in Supabase, and create appropriate policies to control data access.

#### Generate Supabase Types

To ensure type safety with your Supabase database, generate types using the Supabase CLI:

\`\`\`bash
npx supabase gen types typescript --project-id "YOUR_SUPABASE_PROJECT_REF" --schema public > types/supabase.ts
\`\`\`

Replace `"YOUR_SUPABASE_PROJECT_REF"` with your actual Supabase project reference (found in your project URL or settings).

### 4. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and components.
-   `components/`: Reusable UI components (shadcn/ui).
-   `contexts/`: React Contexts for global state (e.g., AuthContext).
-   `lib/`: Utility functions and Supabase client setup.
-   `scripts/supabase/`: SQL schema migration scripts for Supabase.
-   `types/`: TypeScript type definitions.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
