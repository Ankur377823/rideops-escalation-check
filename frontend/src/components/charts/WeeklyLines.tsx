"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS, GRID, INK, TOOLTIP, seriesColor } from "./theme";

export type Series = { key: string; name: string; color: 1 | 2; dashed?: boolean };

type Props = { data: object[]; xKey: string; series: Series[]; height?: number; unit?: string };

/** Weekly line chart. One y-axis only; every series shares the same unit. */
export function WeeklyLines({ data, xKey, series, height = 240, unit = "" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={AXIS}
          tickLine={false}
          axisLine={{ stroke: GRID }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} unit={unit} />
        <Tooltip
          contentStyle={TOOLTIP}
          labelFormatter={(v) => `Week ending ${v}`}
          formatter={(v) => `${v}${unit}`}
        />
        {series.length > 1 && (
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: INK }} />
        )}
        {series.map((s) => (
          <Line
            key={s.key}
            type="linear"
            dataKey={s.key}
            name={s.name}
            stroke={seriesColor(s.color)}
            strokeWidth={2}
            strokeDasharray={s.dashed ? "5 4" : undefined}
            dot={false}
            activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
