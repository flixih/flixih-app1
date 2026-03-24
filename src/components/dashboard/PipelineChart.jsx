import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STAGE_LABELS = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const STAGE_COLORS = [
  "hsl(239, 84%, 67%)",
  "hsl(210, 70%, 55%)",
  "hsl(180, 60%, 45%)",
  "hsl(36, 96%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(145, 65%, 42%)",
  "hsl(0, 60%, 55%)",
];

export default function PipelineChart({ leads }) {
  const data = Object.entries(STAGE_LABELS).map(([key, label]) => ({
    name: label,
    count: leads.filter((l) => l.stage === key).length,
    value: leads.filter((l) => l.stage === key).reduce((sum, l) => sum + (l.value || 0), 0),
  }));

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
      <h3 className="text-lg font-semibold mb-6">Pipeline Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 90%)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "hsl(225, 10%, 50%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(225, 10%, 50%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid hsl(225, 15%, 90%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value, name) => [value, name === "count" ? "Leads" : "Value"]}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={STAGE_COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}