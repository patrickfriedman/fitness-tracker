import { redirect } from 'next/navigation'
import { getSession } from '@/app/actions/auth-actions'
import OnboardingFlow from '@/app/components/onboarding-flow'
import BodyMetricsWidget from '@/app/components/body-metrics-widget'
import WaterTracker from '@/app/components/water-tracker'
import MoodTracker from '@/app/components/mood-tracker'
import MotivationalQuote from '@/app/components/motivational-quote'
import WorkoutLogger from '@/app/components/workout-logger'
import NutritionTracker from '@/app/components/nutrition-tracker'
import ActivityHeatmap from '@/app/components/activity-heatmap'
import WeeklySummary from '@/app/components/weekly-summary'
import WorkoutPlanner from '@/app/components/workout-planner'
import BodyMetricsCard from '@/app/components/body-metrics-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <OnboardingFlow />

          {/* Daily Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WaterTracker />
              <MoodTracker />
            </CardContent>
          </Card>

          {/* Workout Logger */}
          <WorkoutLogger />

          {/* Nutrition Tracker */}
          <NutritionTracker />

          {/* Workout Planner */}
          <WorkoutPlanner />
        </div>

        {/* Sidebar / Widgets Area */}
        <div className="lg:col-span-1 space-y-6">
          {/* Motivational Quote */}
          <MotivationalQuote />

          {/* Body Metrics */}
          <BodyMetricsWidget />
          <BodyMetricsCard /> {/* Assuming this is a detailed view or another metric card */}

          {/* Activity Heatmap */}
          <ActivityHeatmap />

          {/* Weekly Summary */}
          <WeeklySummary />
        </div>
      </div>
    </div>
  )
}
