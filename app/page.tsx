import { getBrowserClient } from '@/lib/supabase-browser'
import { redirect } from 'next/navigation'
import OnboardingFlow from './components/onboarding-flow'
import BodyMetricsWidget from './components/body-metrics-widget'
import WaterTracker from './components/water-tracker'
import MoodTracker from './components/mood-tracker'
import MotivationalQuote from './components/motivational-quote'
import WorkoutLogger from './components/workout-logger'
import NutritionTracker from './components/nutrition-tracker'
import ActivityHeatmap from './components/activity-heatmap'
import WeeklySummary from './components/weekly-summary'
import WorkoutPlanner from './components/workout-planner'
import BodyMetricsCard from './components/body-metrics-card'

export default async function Home() {
  const supabase = getBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Placeholder data for demonstration
  const bodyMetrics = {
    weight: 75,
    height: 175,
    bmi: 24.5,
    bodyFat: 18,
    muscleMass: 40,
  }

  const waterLogs = [
    { date: '2023-10-26', amount: 2500 },
    { date: '2023-10-25', amount: 2000 },
  ]

  const moodLogs = [
    { date: '2023-10-26', mood: 'happy', notes: 'Had a great workout!' },
    { date: '2023-10-25', mood: 'neutral', notes: 'Busy day at work.' },
  ]

  const workoutLogs = [
    {
      id: '1',
      type: 'Strength',
      duration: 60,
      calories_burned: 400,
      notes: 'Full body workout',
      exercises: [
        { name: 'Squats', sets: '3', reps: '10', weight: '60kg' },
        { name: 'Bench Press', sets: '3', reps: '8', weight: '50kg' },
      ],
      created_at: '2023-10-26T10:00:00Z',
    },
    {
      id: '2',
      type: 'Cardio',
      duration: 30,
      calories_burned: 300,
      notes: 'Morning run',
      exercises: [],
      created_at: '2023-10-25T07:00:00Z',
    },
  ]

  const nutritionLogs = [
    {
      id: '1',
      meal_type: 'Breakfast',
      calories: 450,
      protein: 30,
      carbs: 50,
      fat: 15,
      notes: 'Oatmeal with berries and protein powder',
      created_at: '2023-10-26T08:00:00Z',
    },
    {
      id: '2',
      meal_type: 'Lunch',
      calories: 600,
      protein: 40,
      carbs: 60,
      fat: 20,
      notes: 'Chicken salad with avocado',
      created_at: '2023-10-26T13:00:00Z',
    },
  ]

  const plannedWorkouts = [
    {
      id: 'pw1',
      date: '2023-10-27',
      name: 'Leg Day',
      exercises: [
        { name: 'Barbell Squats', sets: 4, reps: 8 },
        { name: 'Leg Press', sets: 3, reps: 10 },
      ],
    },
    {
      id: 'pw2',
      date: '2023-10-28',
      name: 'Upper Body',
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8 },
        { name: 'Pull-ups', sets: 3, reps: 10 },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <BodyMetricsWidget metrics={bodyMetrics} />
              <WaterTracker logs={waterLogs} />
              <MoodTracker logs={moodLogs} />
              <MotivationalQuote />
            </div>
            <WorkoutLogger initialWorkoutLogs={workoutLogs} />
            <NutritionTracker initialNutritionLogs={nutritionLogs} />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <ActivityHeatmap />
            <WeeklySummary />
            <WorkoutPlanner initialPlannedWorkouts={plannedWorkouts} />
            <BodyMetricsCard metrics={bodyMetrics} />
          </div>
        </main>
      </div>
      <OnboardingFlow />
    </div>
  )
}
