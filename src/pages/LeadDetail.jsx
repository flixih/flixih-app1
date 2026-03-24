import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Tag,
  Send,
  MessageSquare,
  PhoneCall,
  CalendarDays,
  CheckSquare,
  Loader2,
  Pencil,
} from "lucide-react";
import LeadForm from "../components/leads/LeadForm";

const stageBadge = {
  new: "bg-primary/10 text-primary border-primary/20",
  contacted: "bg-blue-50 text-blue-600 border-blue-200",
  qualified: "bg-teal-50 text-teal-600 border-teal-200",
  proposal: "bg-amber-50 text-amber-600 border-amber-200",
  negotiation: "bg-purple-50 text-purple-600 border-purple-200",
  won: "bg-emerald-50 text-emerald-600 border-emerald-200",
  lost: "bg-red-50 text-red-500 border-red-200",
};

const activityIcons = {
  note: MessageSquare,
  call: PhoneCall,
  email: Mail,
  meeting: CalendarDays,
  task: CheckSquare,
};

export default function LeadDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const leadId = window.location.pathname.split("/leads/")[1];
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showEdit, setShowEdit] = useState(false);
  const [activityType, setActivityType] = useState("note");
  const [activityContent, setActivityContent] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);

  const { data: lead, isLoading: loadingLead } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const leads = await base44.entities.Lead.filter({ id: leadId });
      return leads[0];
    },
    enabled: !!leadId,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities", leadId],
    queryFn: () => base44.entities.Activity.filter({ lead_id: leadId }, "-created_date"),
    enabled: !!leadId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.update(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: (data) => base44.entities.Activity.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities", leadId] }),
  });

  const handleAddActivity = async () => {
    if (!activityContent.trim()) return;
    setAddingActivity(true);
    await addActivityMutation.mutateAsync({
      lead_id: leadId,
      type: activityType,
      content: activityContent,
    });
    setActivityContent("");
    setAddingActivity(false);
  };

  if (loadingLead) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Lead not found</p>
        <Link to="/leads" className="text-primary mt-2 inline-block">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/leads")} className="gap-2 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                  {lead.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{lead.name}</h2>
                  {lead.company && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {lead.company}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
                <Pencil className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 mb-6">
              <Badge variant="outline" className={cn("text-xs", stageBadge[lead.stage])}>
                {lead.stage}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  lead.priority === "high"
                    ? "bg-red-50 text-red-500 border-red-200"
                    : lead.priority === "medium"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                )}
              >
                {lead.priority} priority
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.value && (
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">${lead.value.toLocaleString()}</span>
                </div>
              )}
              {lead.source && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{lead.source.replace(/_/g, " ")}</span>
                </div>
              )}
              {lead.created_date && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Added {format(new Date(lead.created_date), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>

            {lead.notes && (
              <div className="mt-5 pt-5 border-t">
                <p className="text-sm text-muted-foreground">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Quick Stage Update */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="text-sm font-semibold mb-3">Update Stage</h3>
            <Select
              value={lead.stage}
              onValueChange={(v) => updateMutation.mutate({ stage: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Activity */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="text-lg font-semibold mb-4">Add Activity</h3>
            <div className="flex gap-2 mb-3">
              {["note", "call", "email", "meeting", "task"].map((type) => {
                const Icon = activityIcons[type];
                return (
                  <Button
                    key={type}
                    variant={activityType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivityType(type)}
                    className="gap-1.5 capitalize"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {type}
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder={`Write a ${activityType}...`}
                value={activityContent}
                onChange={(e) => setActivityContent(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex justify-end mt-3">
              <Button onClick={handleAddActivity} disabled={addingActivity || !activityContent.trim()} className="gap-2">
                {addingActivity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Add
              </Button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
            <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No activities yet. Add one above!
              </p>
            ) : (
              <div className="space-y-0">
                {activities.map((activity, index) => {
                  const Icon = activityIcons[activity.type] || MessageSquare;
                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-px h-full bg-border min-h-[24px]" />
                        )}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold capitalize">{activity.type}</span>
                          <span className="text-xs text-muted-foreground">
                            {activity.created_date &&
                              format(new Date(activity.created_date), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {activity.content}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          by {activity.created_by}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <LeadForm
          open={showEdit}
          onClose={() => setShowEdit(false)}
          initialData={lead}
          onSubmit={(data) => updateMutation.mutateAsync(data)}
        />
      )}
    </div>
  );
}