"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXIS, INK, TOOLTIP, seriesColor } from "./theme";

type Props = { data: object[]; labelKey: string; valueKey: string; unit?: string };

/** Horizontal bars for a ranked comparison, value printed at the bar end. */
export function RankBars({ data, labelKey, valueKey, unit = "" }: Props) {
  const withUnit = (v: unknown) => `${v}${unit}`;
  return (
    <ResponsiveContainer width="100%" height={data.length * 34 + 16}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
        barCategoryGap={8}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey={labelKey}
          tick={{ ...AXIS, fill: INK }}
          width={210}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={TOOLTIP} formatter={withUnit} />
        <Bar
          dataKey={valueKey}
          fill={seriesColor(1)}
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
          label={{ position: "right", fontSize: 12, fill: INK, formatter: withUnit }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
