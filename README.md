# Fitness Tracker App

This is a fitness tracking application built with Next.js, React, and Supabase.

## Features

- User authentication (Sign up, Login, Demo Login)
- Dashboard with various fitness widgets
- Workout logging
- Nutrition tracking
- Body metrics recording
- Mood tracking
- Water intake logging
- Workout planning
- Activity heatmap
- Weekly summary

## Setup

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd fitness-tracker
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    pnpm install
    \`\`\`

3.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   Go to "SQL Editor" and run the SQL scripts provided in the `supabase/schemas` folder in the order `01` to `07`.
    *   Go to "Project Settings" -> "API" and copy your `Project URL` and `anon public` key.
    *   Go to "Project Settings" -> "API" -> "Service Role" and copy your `service_role` key.

4.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following:
    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    \`\`\`

5.  **Generate Supabase Types (Recommended):**
    After running the SQL scripts, generate TypeScript types for your Supabase database:
    \`\`\`bash
    npx supabase gen types typescript --project-id "YOUR_SUPABASE_PROJECT_REF" --schema public > types/supabase.ts
    \`\`\`
    Replace `"YOUR_SUPABASE_PROJECT_REF"` with your actual Supabase project ID (found in Project Settings -> General -> Project ID).

6.  **Run the development server:**
    \`\`\`bash
    pnpm dev
    \`\`\`

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `app/actions/`: Server Actions for authentication and data manipulation.
-   `app/components/`: Custom React components used across the application.
-   `components/ui/`: Shadcn/ui components.
-   `contexts/`: React Contexts for global state management (e.g., AuthContext).
-   `hooks/`: Custom React hooks.
-   `lib/`: Utility functions and Supabase client setup.
-   `public/`: Static assets.
-   `scripts/supabase/schemas/`: SQL schema files for Supabase database setup.
-   `types/`: TypeScript type definitions.

## Technologies Used

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Supabase
-   Lucide React Icons
