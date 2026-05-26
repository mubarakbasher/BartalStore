import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SalesAnalyticsResponse } from '@/lib/api/types';

interface AnalyticsSalesChartProps {
  data: SalesAnalyticsResponse;
}

const ZONE_COLORS: Record<string, string> = {
  ZONE_A: '#D4860B',
  ZONE_B: '#5B7A99',
  ZONE_C: '#7BA05B',
  ZONE_D: '#B05C5C',
};

export default function AnalyticsSalesChart({ data }: AnalyticsSalesChartProps) {
  const series = useMemo(() => {
    if (data.breakdown === 'zone') {
      const byDate = new Map<string, Record<string, number>>();
      for (const row of data.days) {
        const d = row.date.slice(5);
        const zone = (row as { zone?: string }).zone ?? 'ZONE_A';
        if (!byDate.has(d)) byDate.set(d, { date: d } as unknown as Record<string, number>);
        byDate.get(d)![zone] = (byDate.get(d)![zone] ?? 0) + row.revenue;
      }
      return Array.from(byDate.values()).sort((a, b) =>
        String(a.date).localeCompare(String(b.date)),
      ) as unknown as Array<Record<string, number | string>>;
    }
    return [...data.days]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ date: d.date.slice(5), revenue: d.revenue }));
  }, [data]);

  const zones =
    data.breakdown === 'zone' ? Array.from(new Set(data.days.map((r) => (r as { zone?: string }).zone ?? 'ZONE_A'))) : [];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <defs>
          {data.breakdown === 'zone' ? (
            zones.map((z) => (
              <linearGradient key={z} id={`adm-an-${z}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ZONE_COLORS[z] ?? '#888'} stopOpacity={0.4} />
                <stop offset="100%" stopColor={ZONE_COLORS[z] ?? '#888'} stopOpacity={0} />
              </linearGradient>
            ))
          ) : (
            <linearGradient id="adm-an-rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4860B" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#D4860B" stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6B6356" />
        <YAxis tick={{ fontSize: 11 }} stroke="#6B6356" width={56} />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D5',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        {data.breakdown === 'zone' ? (
          zones.map((z) => (
            <Area
              key={z}
              type="monotone"
              dataKey={z}
              stackId="1"
              stroke={ZONE_COLORS[z] ?? '#888'}
              strokeWidth={1.5}
              fill={`url(#adm-an-${z})`}
            />
          ))
        ) : (
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#D4860B"
            strokeWidth={2}
            fill="url(#adm-an-rev)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
