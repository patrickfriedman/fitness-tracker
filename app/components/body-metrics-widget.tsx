'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Scale, Ruler, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'

type BodyMetric = Database['public']['Tables']['body_metrics']['Row']

export default function BodyMetricsWidget() {
  const [latestMetrics, setLatestMetrics] = useState<BodyMetric | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchLatestMetrics = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching body metrics:', error)
      } else if (data) {
        setLatestMetrics(data)
      }
    }

    fetchLatestMetrics()
  }, [supabase])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {latestMetrics?.weight_kg ? `${latestMetrics.weight_kg} kg` : 'N/A'}
        </div>
        <p className="text-xs text-muted-foreground">
          {latestMetrics?.height_cm ? `Height: ${latestMetrics.height_cm} cm` : 'Height: N/A'}
        </p>
        <p className="text-xs text-muted-foreground">
          {latestMetrics?.log_date ? `Last updated: ${new Date(latestMetrics.log_date).toLocaleDateString()}` : 'No data yet'}
        </p>
      </CardContent>
    </Card>
  )
}
