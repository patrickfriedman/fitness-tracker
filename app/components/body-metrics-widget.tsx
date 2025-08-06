'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Scale, TrendingUp, TrendingDown } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { BodyMetric } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function BodyMetricsWidget() {
  const { user, isDemo } = useAuth()
  const [latestMetric, setLatestMetric] = useState<BodyMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLatestMetric = async () => {
      setLoading(true);
      if (isDemo) {
        // Simulate demo data
        setLatestMetric({
          id: 'demo-metric-1',
          user_id: user.id,
          date: format(new Date(), 'yyyy-MM-dd'),
          weight: 75,
          height: 175,
          body_fat_percentage: 18,
          muscle_mass_percentage: 40,
          waist_circumference: 80,
          notes: 'Demo data for body metrics.',
          created_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching latest body metric:', error.message);
      } else if (data) {
        setLatestMetric(data);
      } else {
        setLatestMetric(null);
      }
      setLoading(false);
    };

    fetchLatestMetric();
  }, [user, isDemo, supabase]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Body Metrics</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Latest Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {latestMetric?.weight ? `${latestMetric.weight} kg` : 'N/A'}
        </div>
        <p className="text-xs text-muted-foreground">
          {latestMetric?.date ? `As of ${format(new Date(latestMetric.date), 'MMM dd, yyyy')}` : 'No data yet'}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Body Fat:</span>
            <span className="font-medium">
              {latestMetric?.body_fat_percentage ? `${latestMetric.body_fat_percentage}%` : 'N/A'}
            </span>
          </div>
          <Progress value={latestMetric?.body_fat_percentage || 0} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <span>Muscle Mass:</span>
            <span className="font-medium">
              {latestMetric?.muscle_mass_percentage ? `${latestMetric.muscle_mass_percentage}%` : 'N/A'}
            </span>
          </div>
          <Progress value={latestMetric?.muscle_mass_percentage || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
