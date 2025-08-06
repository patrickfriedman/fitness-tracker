'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import { BodyMetric } from '@/types/fitness'

export default function BodyMetricsCard() {
  const [metricsHistory, setMetricsHistory] = useState<BodyMetric[]>([
    { id: '1', date: new Date('2023-01-01'), weight: 70, bodyFat: 15, muscleMass: 30 },
    { id: '2', date: new Date('2023-02-01'), weight: 69, bodyFat: 14.8, muscleMass: 30.2 },
    { id: '3', date: new Date('2023-03-01'), weight: 68.5, bodyFat: 14.5, muscleMass: 30.5 },
    { id: '4', date: new Date('2023-04-01'), weight: 68, bodyFat: 14.2, muscleMass: 30.8 },
  ])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Body Metrics History</CardTitle>
      </CardHeader>
      <CardContent>
        {metricsHistory.length === 0 ? (
          <p className="text-muted-foreground">No historical data available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Body Fat (%)</TableHead>
                <TableHead>Muscle Mass (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metricsHistory.map((metric) => (
                <TableRow key={metric.id}>
                  <TableCell>{metric.date.toLocaleDateString()}</TableCell>
                  <TableCell>{metric.weight}</TableCell>
                  <TableCell>{metric.bodyFat}</TableCell>
                  <TableCell>{metric.muscleMass}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
