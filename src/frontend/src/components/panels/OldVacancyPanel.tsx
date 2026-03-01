import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Archive,
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { VacancyStatus } from "../../backend.d";
import {
  INDIAN_STATES,
  type JobListing,
  formatSalary,
  timeAgo,
} from "../../data/jobs";

interface OldVacancyPanelProps {
  allVacancies?: JobListing[];
}

function StatusBadge({ status }: { status: VacancyStatus }) {
  if (status === VacancyStatus.new_) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 text-[10px] h-5">
        New
      </Badge>
    );
  }
  if (status === VacancyStatus.old) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 text-[10px] h-5">
        Old
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 text-[10px] h-5">
      Draft
    </Badge>
  );
}

function VacancyCard({ job }: { job: JobListing }) {
  return (
    <Card className="shadow-xs border-border hover:shadow-sm transition-shadow">
      <CardContent className="p-4 space-y-2.5">
        {/* Title + Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-snug truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
        {/* Location + Date */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {job.city || job.district}, {job.state}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {timeAgo(job.datePosted)}
          </span>
        </div>
        {/* Salary pill */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <IndianRupee className="w-3 h-3 flex-shrink-0" />
          <span>
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
        <Archive className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-[200px]">{message}</p>
    </div>
  );
}

export function OldVacancyPanel({ allVacancies = [] }: OldVacancyPanelProps) {
  const [selectedState, setSelectedState] = useState<string>("");

  const oldVacancies = allVacancies.filter(
    (j) => j.status === VacancyStatus.old,
  );
  const stateOldVacancies = selectedState
    ? allVacancies.filter(
        (j) => j.status === VacancyStatus.old && j.state === selectedState,
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-xl font-display font-bold text-foreground">
          Old Vacancy
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Closed and archived job listings across India
        </p>
      </div>

      <Tabs defaultValue="india" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-6 mt-4 grid grid-cols-2 h-9 w-[calc(100%-3rem)]">
          <TabsTrigger value="india" className="text-xs w-full overflow-hidden">
            <span className="truncate">India Old Vacancies</span>
            {oldVacancies.length > 0 && (
              <span className="ml-1 bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-full px-1 py-0.5 text-[10px] font-semibold flex-shrink-0">
                {oldVacancies.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="state" className="text-xs w-full overflow-hidden">
            <span className="truncate">State Old Vacancies</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: India Old Vacancies ── */}
        <TabsContent value="india" className="flex-1 mt-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">
                  All Old Vacancies — India
                </p>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {oldVacancies.length} listing
                  {oldVacancies.length !== 1 ? "s" : ""}
                </span>
              </div>
              {oldVacancies.length === 0 ? (
                <EmptyState message="No old vacancies found. Listings marked as 'Old' will appear here." />
              ) : (
                <div className="space-y-3">
                  {oldVacancies.map((job) => (
                    <VacancyCard key={job.jobId} job={job} />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Tab: State Old Vacancies ── */}
        <TabsContent value="state" className="flex-1 mt-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Select State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a state to filter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!selectedState ? (
                <EmptyState message="Select a state above to view its old vacancies." />
              ) : stateOldVacancies.length === 0 ? (
                <EmptyState
                  message={`No old vacancies found in ${selectedState}.`}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {selectedState}
                    </p>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {stateOldVacancies.length} listing
                      {stateOldVacancies.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stateOldVacancies.map((job) => (
                      <VacancyCard key={job.jobId} job={job} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Summary bar */}
      {oldVacancies.length > 0 && (
        <div className="px-6 py-3 border-t border-border bg-secondary/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="w-3.5 h-3.5" />
            <span>
              {oldVacancies.length} archived listing
              {oldVacancies.length !== 1 ? "s" : ""} across{" "}
              {[...new Set(oldVacancies.map((j) => j.state))].length} state
              {[...new Set(oldVacancies.map((j) => j.state))].length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
