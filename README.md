# Fitness Tracker

This is a fitness tracking application built with Next.js, React, and Supabase.

## Features

- User authentication (Login, Register, Demo Login)
- Onboarding flow for new users to set up their profile
- Track body metrics (weight, height, body fat, muscle mass)
- Log daily water intake
- Track daily mood
- Log workouts with details (type, duration, calories, exercises)
- Log nutrition with macro details (calories, protein, carbs, fat)
- Plan upcoming workouts with exercises
- Visualize activity with a heatmap
- View weekly summary of workouts and calories

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
pnpm install
# or
yarn install
\`\`\`

### 3. Set up Supabase

1.  **Create a new Supabase project:** Go to [Supabase Dashboard](https://app.supabase.com/) and create a new project.
2.  **Get your API keys:** Navigate to `Project Settings` > `API` to find your `Project URL` and `anon public` key.
3.  **Set up environment variables:** Create a `.env.local` file in the root of your project and add the following:

    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # Found under Project Settings -> API Keys -> service_role key
    \`\`\`
    **Note:** `NEXT_PUBLIC_` variables are accessible on the client-side. `SUPABASE_SERVICE_ROLE_KEY` should only be used on the server-side (e.g., in Server Actions or API Routes) for privileged operations.

4.  **Run SQL scripts:** Use the Supabase SQL Editor in your dashboard to run the SQL scripts located in the `scripts/supabase/` directory. Run them in order:
    *   `01_create_users_table.sql`
    *   `02_create_workout_logs_table.sql`
    *   `03_create_nutrition_logs_table.sql`
    *   `04_create_body_metrics_table.sql`
    *   `05_create_mood_logs_table.sql`
    *   `06_create_water_logs_table.sql`
    *   `07_create_planned_workouts_table.sql`

    These scripts will create the necessary tables and set up Row Level Security (RLS).

5.  **Generate Supabase types (optional but recommended):**
    If you have the Supabase CLI installed, you can generate TypeScript types for your database schema:
    \`\`\`bash
    npx supabase gen types typescript --project-id "YOUR_SUPABASE_PROJECT_ID" --schema public > types/supabase.ts
    \`\`\`
    Replace `YOUR_SUPABASE_PROJECT_ID` with your actual project ID (found in your Supabase project URL).

### 4. Run the development server

\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and components.
-   `app/actions/`: Server Actions for authentication.
-   `app/components/`: Main application components (e.g., `WorkoutLogger`, `NutritionTracker`).
-   `components/ui/`: Shadcn/ui components.
-   `contexts/`: React Contexts (e.g., `AuthContext`).
-   `hooks/`: Custom React hooks (e.g., `useToast`).
-   `lib/`: Utility functions and Supabase client setup.
-   `public/`: Static assets.
-   `scripts/supabase/`: SQL scripts for database setup.
-   `types/`: TypeScript type definitions, including `supabase.ts` for database types.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
\`\`\`
