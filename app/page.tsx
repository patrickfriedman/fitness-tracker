import { getSession } from '@/app/actions/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WorkoutLogger from '@/app/components/workout-logger'
import NutritionTracker from '@/app/components/nutrition-tracker'
import WaterTracker from '@/app/components/water-tracker'
import MoodTracker from '@/app/components/mood-tracker'
import BodyMetricsWidget from '@/app/components/body-metrics-widget'
import WorkoutPlanner from '@/app/components/workout-planner'
import ActivityHeatmap from '@/app/components/activity-heatmap'
import WeeklySummary from '@/app/components/weekly-summary'
import MotivationalQuote from '@/app/components/motivational-quote'
import OnboardingFlow from '@/app/components/onboarding-flow'

export default async function Home() {
  const { data: { session, user }, error } = await getSession()

  if (error || !session) {
    redirect('/login')
  }

  // Placeholder for checking if onboarding is complete
  // In a real app, you'd fetch user metadata from your DB
  const isNewUser = false // Assume user is not new for now

  if (isNewUser) {
    return <OnboardingFlow />
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-950">
      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MotivationalQuote />
        </div>
        <WorkoutLogger />
        <NutritionTracker />
        <WaterTracker />
        <MoodTracker />
        <BodyMetricsWidget />
        <WorkoutPlanner />
        <ActivityHeatmap />
        <WeeklySummary />
      </div>
    </main>
  )
}
