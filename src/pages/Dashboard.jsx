import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, DollarSign, TrendingUp, Target } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import PipelineChart from "../components/dashboard/PipelineChart";
import SourceBreakdown from "../components/dashboard/SourceBreakdown";
import RecentLeads from "../components/dashboard/RecentLeads";

export default function Dashboard() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date"),
  });

  const totalLeads = leads.length;
  const pipelineValue = leads
    .filter((l) => !["won", "lost"].includes(l.stage))
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const wonDeals = leads.filter((l) => l.stage === "won").length;
  const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your lead pipeline at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          trend={12}
          trendUp
        />
        <StatCard
          title="Pipeline Value"
          value={`$${pipelineValue.toLocaleString()}`}
          icon={DollarSign}
          trend={8}
          trendUp
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          trend={3}
          trendUp
        />
        <StatCard
          title="Won Deals"
          value={wonDeals}
          icon={Target}
          subtitle="This period"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineChart leads={leads} />
        </div>
        <SourceBreakdown leads={leads} />
      </div>

      {/* Recent Leads */}
      <RecentLeads leads={leads} />
    </div>
  );
}