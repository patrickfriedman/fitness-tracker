import { getSession } from '@/app/actions/auth-actions'
import { redirect } from 'next/navigation'
import { getPlannedWorkouts } from '@/app/actions/workout-actions'
import WorkoutPlanner from '@/app/components/workout-planner'
import WorkoutLogger from '@/app/components/workout-logger'
import NutritionTracker from '@/app/components/nutrition-tracker'
import WaterTracker from '@/app/components/water-tracker'
import MoodTracker from '@/app/components/mood-tracker'
import BodyMetricsWidget from '@/app/components/body-metrics-widget'
import MotivationalQuote from '@/app/components/motivational-quote'
import ActivityHeatmap from '@/app/components/activity-heatmap'
import WeeklySummary from '@/app/components/weekly-summary'
import { getNutritionLogs } from '@/app/actions/nutrition-actions'
import { getWaterLogs } from '@/app/actions/water-actions'
import { getMoodLogs } from '@/app/actions/mood-actions'
import { getBodyMetrics } from '@/app/actions/body-metrics-actions'
import { getWorkoutLogs } from '@/app/actions/workout-actions'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const userId = session.user.id

  // Fetch data for all components
  const plannedWorkouts = await getPlannedWorkouts(userId)
  const nutritionLogs = await getNutritionLogs(userId)
  const waterLogs = await getWaterLogs(userId)
  const moodLogs = await getMoodLogs(userId)
  const bodyMetrics = await getBodyMetrics(userId)
  const workoutLogs = await getWorkoutLogs(userId)

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MotivationalQuote />
          <BodyMetricsWidget initialMetrics={bodyMetrics} />
          <WaterTracker initialWaterLogs={waterLogs} />
          <MoodTracker initialMoodLogs={moodLogs} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <WorkoutPlanner initialWorkouts={plannedWorkouts} />
          <WorkoutLogger initialWorkoutLogs={workoutLogs} />
          <NutritionTracker initialNutritionLogs={nutritionLogs} />
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <ActivityHeatmap initialWorkoutLogs={workoutLogs} />
          <WeeklySummary initialWorkoutLogs={workoutLogs} initialNutritionLogs={nutritionLogs} />
        </div>
      </main>
    </div>
  )
}
