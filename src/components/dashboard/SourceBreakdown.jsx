import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const SOURCE_LABELS = {
  website: "Website",
  referral: "Referral",
  social_media: "Social Media",
  cold_call: "Cold Call",
  email_campaign: "Email Campaign",
  event: "Event",
  other: "Other",
};

const COLORS = [
  "hsl(239, 84%, 67%)",
  "hsl(160, 60%, 45%)",
  "hsl(36, 96%, 55%)",
  "hsl(280, 65%, 60%)",
  "hsl(340, 75%, 55%)",
  "hsl(210, 70%, 55%)",
  "hsl(225, 10%, 65%)",
];

export default function SourceBreakdown({ leads }) {
  const data = Object.entries(SOURCE_LABELS)
    .map(([key, label]) => ({
      name: label,
      value: leads.filter((l) => l.source === key).length,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
        <h3 className="text-lg font-semibold mb-6">Lead Sources</h3>
        <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
          No data yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
      <h3 className="text-lg font-semibold mb-6">Lead Sources</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(225, 15%, 90%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2.5">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}