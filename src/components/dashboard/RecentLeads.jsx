import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

const stageBadge = {
  new: "bg-primary/10 text-primary border-primary/20",
  contacted: "bg-blue-50 text-blue-600 border-blue-200",
  qualified: "bg-teal-50 text-teal-600 border-teal-200",
  proposal: "bg-amber-50 text-amber-600 border-amber-200",
  negotiation: "bg-purple-50 text-purple-600 border-purple-200",
  won: "bg-emerald-50 text-emerald-600 border-emerald-200",
  lost: "bg-red-50 text-red-500 border-red-200",
};

export default function RecentLeads({ leads }) {
  const recent = [...leads]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold">Recent Leads</h3>
        <Link
          to="/leads"
          className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="space-y-3">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No leads yet</p>
        )}
        {recent.map((lead) => (
          <Link
            key={lead.id}
            to={`/leads/${lead.id}`}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {lead.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {lead.name}
                </p>
                <p className="text-xs text-muted-foreground">{lead.company || lead.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lead.value && (
                <span className="text-sm font-semibold">
                  ${lead.value.toLocaleString()}
                </span>
              )}
              <Badge variant="outline" className={stageBadge[lead.stage] || ""}>
                {lead.stage}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}