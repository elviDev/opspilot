"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Point = { time: string; responseTime: number };

export default function UptimeChart({ data }: { data: Point[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-medium text-white mb-4">Response time trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#22262b" />
          <XAxis dataKey="time" stroke="#8b949e" fontSize={12} />
          <YAxis stroke="#8b949e" fontSize={12} unit="ms" />
          <Tooltip
            contentStyle={{ background: "#14171b", border: "1px solid #22262b", borderRadius: 8 }}
            labelStyle={{ color: "#8b949e" }}
          />
          <Line type="monotone" dataKey="responseTime" stroke="#22c55e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
