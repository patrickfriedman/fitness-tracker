import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import BodyMetricsWidget from '@/app/components/body-metrics-widget'
import WaterTracker from '@/app/components/water-tracker'
import MoodTracker from '@/app/components/mood-tracker'
import MotivationalQuote from '@/app/components/motivational-quote'
import WorkoutLogger from '@/app/components/workout-logger'
import NutritionTracker from '@/app/components/nutrition-tracker'
import ActivityHeatmap from '@/app/components/activity-heatmap'
import WeeklySummary from '@/app/components/weekly-summary'
import WorkoutPlanner from '@/app/components/workout-planner'
import BodyMetricsCard from '@/app/components/body-metrics-card' // Assuming this is a more detailed card
import { Home, Dumbbell, Utensils, Scale, Droplet, Smile, CalendarDays, BarChartBig, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth-actions'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={18} minSize={15} maxSize={25}>
            <Sidebar>
              <SidebarHeader>
                <h1 className="text-lg font-semibold">Fitness Tracker</h1>
              </SidebarHeader>
              <SidebarMenu>
                <SidebarMenuLink href="/" active>
                  <Home className="mr-2 h-4 w-4" /> Dashboard
                </SidebarMenuLink>
                <SidebarMenuLink href="/workouts">
                  <Dumbbell className="mr-2 h-4 w-4" /> Workouts
                </SidebarMenuLink>
                <SidebarMenuLink href="/nutrition">
                  <Utensils className="mr-2 h-4 w-4" /> Nutrition
                </SidebarMenuLink>
                <SidebarMenuLink href="/metrics">
                  <Scale className="mr-2 h-4 w-4" /> Metrics
                </SidebarMenuLink>
                <SidebarMenuLink href="/water">
                  <Droplet className="mr-2 h-4 w-4" /> Water
                </SidebarMenuLink>
                <SidebarMenuLink href="/mood">
                  <Smile className="mr-2 h-4 w-4" /> Mood
                </SidebarMenuLink>
                <SidebarMenuLink href="/planner">
                  <CalendarDays className="mr-2 h-4 w-4" /> Planner
                </SidebarMenuLink>
                <SidebarMenuLink href="/summary">
                  <BarChartBig className="mr-2 h-4 w-4" /> Summary
                </SidebarMenuLink>
              </SidebarMenu>
              <SidebarFooter>
                <SidebarMenuLink href="/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </SidebarMenuLink>
                <form action={logout}>
                  <Button type="submit" variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </form>
              </SidebarFooter>
            </Sidebar>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={82}>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BodyMetricsWidget />
                <WaterTracker />
                <MoodTracker />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MotivationalQuote />
                <WorkoutLogger />
                <NutritionTracker />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <ActivityHeatmap />
                <WeeklySummary />
              </div>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <WorkoutPlanner />
                <BodyMetricsCard /> {/* Using the more detailed card here */}
              </div>
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  )
}
