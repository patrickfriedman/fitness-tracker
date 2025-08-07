import { getSession } from '@/app/actions/auth-actions'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={100}>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <BodyMetricsWidget />
                  <WaterTracker />
                  <MoodTracker />
                  <MotivationalQuote />
                </div>
                <Card className="xl:col-span-2">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                      <CardTitle>Workout Log</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <WorkoutLogger />
                  </CardContent>
                </Card>
                <Card className="xl:col-span-2">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                      <CardTitle>Nutrition Tracker</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <NutritionTracker />
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 md:gap-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Activity Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityHeatmap />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Weekly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklySummary />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Workout Planner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WorkoutPlanner />
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
