'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Scale, Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { BodyMetric } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function BodyMetricsCard() {
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

      if (error && error.code !== 'PGRST116') {
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

  const handleLogMetrics = () => {
    // Placeholder for opening a body metrics logging form/modal
    alert('Logging new body metrics! (Feature coming soon)');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items
