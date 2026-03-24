"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartPoint } from "@/types";

type Props = {
  data: ChartPoint[];
};

export function ConsumptionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="energiaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1f8f69" stopOpacity={0.52} />
            <stop offset="95%" stopColor="#1f8f69" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 60, 50, 0.12)" />
        <XAxis dataKey="label" tick={{ fill: "#678078", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#678078", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(20, 60, 50, 0.08)",
            background: "rgba(255,255,255,0.96)"
          }}
        />
        <Area type="monotone" dataKey="consumption" stroke="#1a7d5c" strokeWidth={3} fill="url(#energiaGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
