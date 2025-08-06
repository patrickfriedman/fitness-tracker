'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge, Ruler, Scale, Weight } from 'lucide-react'
import { BodyMetrics } from '@/types/fitness'

interface BodyMetricsWidgetProps {
  metrics: BodyMetrics
}

export default function BodyMetricsWidget({ metrics }: BodyMetricsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Gauge className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Scale className="h-5 w-5" />
          {metrics.weight} kg
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ruler className="h-4 w-4" />
          Height: {metrics.height} cm
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Weight className="h-4 w-4" />
          BMI: {metrics.bmi}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gauge className="h-4 w-4" />
          Body Fat: {metrics.bodyFat}%
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Weight className="h-4 w-4" />
          Muscle Mass: {metrics.muscleMass}%
        </div>
      </CardContent>
    </Card>
  )
}
