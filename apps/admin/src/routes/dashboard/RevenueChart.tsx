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
import type { DashboardDailyRevenue } from '@/lib/api/types';

interface RevenueChartProps {
  data: DashboardDailyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const series = useMemo(
    () =>
      [...data].sort((a, b) => a.date.localeCompare(b.date)).map((d) => ({
        date: d.date.slice(5),
        revenue: Number(d.revenue),
      })),
    [data],
  );
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="adm-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4860B" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#D4860B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#6B6356" />
        <YAxis tick={{ fontSize: 11 }} stroke="#6B6356" width={48} />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D5',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#D4860B"
          strokeWidth={2}
          fill="url(#adm-rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
