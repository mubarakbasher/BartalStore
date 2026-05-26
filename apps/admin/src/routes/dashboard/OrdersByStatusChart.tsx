import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardOrdersByStatus } from '@/lib/api/types';

interface OrdersByStatusChartProps {
  data: DashboardOrdersByStatus[];
}

export default function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  const series = useMemo(
    () =>
      data.map((d) => ({
        status: d.status.replace('_', ' ').toLowerCase(),
        count: d.count,
      })),
    [data],
  );
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D5" vertical={false} />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 10 }}
          stroke="#6B6356"
          interval={0}
          angle={-15}
          textAnchor="end"
          height={56}
        />
        <YAxis tick={{ fontSize: 11 }} stroke="#6B6356" width={36} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D5',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill="#1B3A6B" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
