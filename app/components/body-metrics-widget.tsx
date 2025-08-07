'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'
import { getLatestBodyMetric } from '@/app/actions/body-metrics-actions'
import { BodyMetric } from '@/types/fitness'

export default function BodyMetricsWidget() {
  const [latestMetrics, setLatestMetrics] = useState<BodyMetric | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      const result = await getLatestBodyMetric()
      if (result.success && result.data) {
        setLatestMetrics(result.data)
      } else {
        setLatestMetrics(null)
      }
      setLoading(false)
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Body Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading latest metrics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestMetrics ? (
          <>
            <div>
              <p className="text-sm font-medium">Weight:</p>
              <p className="text-2xl font-bold">{latestMetrics.weight_kg || 'N/A'} kg</p>
              <Progress value={latestMetrics.weight_kg ? (latestMetrics.weight_kg / 100) * 100 : 0} className="w-full" />
            </div>
            <div>
              <p className="text-sm font-medium">Body Fat:</p>
              <p className="text-2xl font-bold">{latestMetrics.body_fat_percent || 'N/A'} %</p>
              <Progress value={latestMetrics.body_fat_percent || 0} className="w-full" />
            </div>
            <div>
              <p className="text-sm font-medium">Muscle Mass:</p>
              <p className="text-2xl font-bold">{latestMetrics.muscle_mass_kg || 'N/A'} kg</p>
              <Progress value={latestMetrics.muscle_mass_kg ? (latestMetrics.muscle_mass_kg / 100) * 100 : 0} className="w-full" />
            </div>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(latestMetrics.log_date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p>No body metrics recorded yet. Add your first entry!</p>
        )}
      </CardContent>
    </Card>
  )
}
