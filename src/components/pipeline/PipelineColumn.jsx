import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2, DollarSign } from "lucide-react";

const stageStyles = {
  new: { dot: "bg-primary", bg: "bg-primary/5" },
  contacted: { dot: "bg-blue-500", bg: "bg-blue-50" },
  qualified: { dot: "bg-teal-500", bg: "bg-teal-50" },
  proposal: { dot: "bg-amber-500", bg: "bg-amber-50" },
  negotiation: { dot: "bg-purple-500", bg: "bg-purple-50" },
  won: { dot: "bg-emerald-500", bg: "bg-emerald-50" },
  lost: { dot: "bg-red-500", bg: "bg-red-50" },
};

export default function PipelineColumn({ stage, label, leads }) {
  const style = stageStyles[stage] || stageStyles.new;
  const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className={cn("rounded-t-xl px-4 py-3 border border-border/50", style.bg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full", style.dot)} />
            <span className="text-sm font-semibold capitalize">{label}</span>
          </div>
          <Badge variant="secondary" className="text-xs font-semibold">
            {leads.length}
          </Badge>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            ${totalValue.toLocaleString()} total
          </p>
        )}
      </div>

      {/* Cards */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-2 space-y-2 rounded-b-xl border border-t-0 border-border/50 bg-card/50 min-h-[200px] transition-colors",
              snapshot.isDraggingOver && "bg-primary/5"
            )}
          >
            {leads.map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(provided, snapshot) => (
                  <Link
                    to={`/leads/${lead.id}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "block bg-card p-3.5 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200",
                      snapshot.isDragging && "shadow-lg ring-2 ring-primary/20 rotate-1"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold leading-tight">{lead.name}</p>
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        lead.priority === "high" ? "bg-red-400" : lead.priority === "medium" ? "bg-amber-400" : "bg-emerald-400"
                      )} />
                    </div>
                    {lead.company && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lead.company}</span>
                      </div>
                    )}
                    {lead.value > 0 && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold">{lead.value.toLocaleString()}</span>
                      </div>
                    )}
                  </Link>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}