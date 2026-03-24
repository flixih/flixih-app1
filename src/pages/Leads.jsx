import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LeadTable from "../components/leads/LeadTable";
import LeadFilters from "../components/leads/LeadFilters";
import LeadForm from "../components/leads/LeadForm";

export default function Leads() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    stage: "all",
    priority: "all",
    source: "all",
  });

  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const searchMatch =
        !filters.search ||
        lead.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(filters.search.toLowerCase());
      const stageMatch = filters.stage === "all" || lead.stage === filters.stage;
      const priorityMatch = filters.priority === "all" || lead.priority === filters.priority;
      const sourceMatch = filters.source === "all" || lead.source === filters.source;
      return searchMatch && stageMatch && priorityMatch && sourceMatch;
    });
  }, [leads, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            {leads.length} total leads · {filtered.length} shown
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      </div>

      <LeadFilters filters={filters} onChange={setFilters} />
      <LeadTable leads={filtered} />

      <LeadForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => createMutation.mutateAsync(data)}
      />
    </div>
  );
}