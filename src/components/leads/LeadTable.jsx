import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

const stageBadge = {
  new: "bg-primary/10 text-primary border-primary/20",
  contacted: "bg-blue-50 text-blue-600 border-blue-200",
  qualified: "bg-teal-50 text-teal-600 border-teal-200",
  proposal: "bg-amber-50 text-amber-600 border-amber-200",
  negotiation: "bg-purple-50 text-purple-600 border-purple-200",
  won: "bg-emerald-50 text-emerald-600 border-emerald-200",
  lost: "bg-red-50 text-red-500 border-red-200",
};

const priorityDot = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

export default function LeadTable({ leads }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold">Value</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                No leads found
              </TableCell>
            </TableRow>
          )}
          {leads.map((lead) => (
            <TableRow key={lead.id} className="group cursor-pointer hover:bg-muted/20">
              <TableCell>
                <Link to={`/leads/${lead.id}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                    {lead.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors text-sm">
                      {lead.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {lead.company || "—"}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("text-xs", stageBadge[lead.stage])}>
                  {lead.stage}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-sm">
                {lead.value ? `$${lead.value.toLocaleString()}` : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", priorityDot[lead.priority])} />
                  <span className="text-sm capitalize">{lead.priority}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground capitalize">
                {lead.source?.replace(/_/g, " ") || "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {lead.created_date ? format(new Date(lead.created_date), "MMM d") : "—"}
              </TableCell>
              <TableCell>
                <Link to={`/leads/${lead.id}`}>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}