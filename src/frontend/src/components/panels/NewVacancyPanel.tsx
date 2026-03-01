import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  IndianRupee,
  MapPin,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { JobType, VacancyStatus } from "../../backend.d";
import {
  INDIAN_STATES,
  type JobListing,
  formatSalary,
  timeAgo,
} from "../../data/jobs";

interface VacancyForm {
  jobTitle: string;
  company: string;
  country: string;
  state: string;
  city: string;
  district: string;
  jobType: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  status: string;
}

const INITIAL: VacancyForm = {
  jobTitle: "",
  company: "",
  country: "India",
  state: "",
  city: "",
  district: "",
  jobType: "",
  salaryMin: "",
  salaryMax: "",
  description: "",
  status: "new_",
};

const JOB_TYPES = [
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
  { value: "remote", label: "Remote" },
  { value: "contract", label: "Contract" },
];

const STATUS_OPTIONS = [
  { value: "new_", label: "New", color: "emerald" },
  { value: "old", label: "Old", color: "amber" },
  { value: "draft", label: "Draft", color: "slate" },
];

interface NewVacancyPanelProps {
  onPost?: (job: JobListing) => void;
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
        <Briefcase className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-[200px]">{message}</p>
    </div>
  );
}

export function NewVacancyPanel({
  onPost,
  allVacancies = [],
}: NewVacancyPanelProps) {
  const [form, setForm] = useState<VacancyForm>(INITIAL);
  const [posted, setPosted] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");

  function update(field: keyof VacancyForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const jobTypeMap: Record<string, JobType> = {
    fullTime: JobType.fullTime,
    partTime: JobType.partTime,
    remote: JobType.remote,
    contract: JobType.contract,
  };

  const statusMap: Record<string, VacancyStatus> = {
    new_: VacancyStatus.new_,
    old: VacancyStatus.old,
    draft: VacancyStatus.draft,
  };

  function handlePost(e: React.FormEvent) {
    e.preventDefault();

    const newJob: JobListing = {
      jobId: `user-${Date.now()}`,
      title: form.jobTitle,
      company: form.company,
      country: form.country || "India",
      state: form.state || "",
      city: form.city || "",
      district: form.district || form.city || "",
      status: statusMap[form.status] ?? VacancyStatus.new_,
      jobType: jobTypeMap[form.jobType] ?? JobType.fullTime,
      salaryMin: form.salaryMin ? BigInt(form.salaryMin) : 0n,
      salaryMax: form.salaryMax ? BigInt(form.salaryMax) : 0n,
      salaryCurrency: "INR",
      description: form.description,
      datePosted: BigInt(Date.now()) * 1_000_000n,
    };

    if (onPost) {
      onPost(newJob);
    }

    setPosted(true);
    toast.success("Vacancy posted!", {
      description: `"${form.jobTitle}" is now live and visible to candidates.`,
    });

    setTimeout(() => {
      setForm(INITIAL);
      setPosted(false);
    }, 2000);
  }

  function handleDraft() {
    toast.success("Saved to drafts", {
      description: "You can continue editing this vacancy later.",
    });
  }

  // Filter vacancies
  const newVacancies = allVacancies.filter(
    (j) => j.status === VacancyStatus.new_,
  );
  const stateVacancies = selectedState
    ? allVacancies.filter(
        (j) => j.status === VacancyStatus.new_ && j.state === selectedState,
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h2 className="text-xl font-display font-bold text-foreground">
          New Vacancy
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Post openings and browse active listings
        </p>
      </div>

      <Tabs defaultValue="post" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-6 mt-4 grid grid-cols-3 h-9 w-[calc(100%-3rem)]">
          <TabsTrigger value="post" className="text-xs w-full overflow-hidden">
            Post New
          </TabsTrigger>
          <TabsTrigger value="india" className="text-xs w-full overflow-hidden">
            <span className="truncate">India Vacancies</span>
            {newVacancies.length > 0 && (
              <span className="ml-1 bg-primary/15 text-primary rounded-full px-1 py-0.5 text-[10px] font-semibold flex-shrink-0">
                {newVacancies.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="state" className="text-xs w-full overflow-hidden">
            <span className="truncate">State Vacancies</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Post New ── */}
        <TabsContent value="post" className="flex-1 mt-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              {posted ? (
                <div className="flex flex-col items-center justify-center min-h-[260px] space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-foreground">
                      Vacancy Posted!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your listing is now live on the job board.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePost} className="space-y-4">
                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vac-title">
                      Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="vac-title"
                      placeholder="e.g. Senior Software Engineer"
                      value={form.jobTitle}
                      onChange={(e) => update("jobTitle", e.target.value)}
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vac-company">
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="vac-company"
                      placeholder="e.g. Tata Consultancy Services"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vac-country">
                      <Globe className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                      Country
                    </Label>
                    <Input
                      id="vac-country"
                      placeholder="India"
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                    />
                  </div>

                  {/* State + City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>State</Label>
                      <Select
                        value={form.state}
                        onValueChange={(v) => update("state", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
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
                    <div className="space-y-1.5">
                      <Label htmlFor="vac-city">City</Label>
                      <Input
                        id="vac-city"
                        placeholder="e.g. Bengaluru"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vac-district">District (optional)</Label>
                    <Input
                      id="vac-district"
                      placeholder="e.g. South Bengaluru"
                      value={form.district}
                      onChange={(e) => update("district", e.target.value)}
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-1.5">
                    <Label>Job Type</Label>
                    <Select
                      value={form.jobType}
                      onValueChange={(v) => update("jobType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => update("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range */}
                  <div className="space-y-1.5">
                    <Label>Salary Range (INR / month)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Min e.g. 50000"
                        type="number"
                        value={form.salaryMin}
                        onChange={(e) => update("salaryMin", e.target.value)}
                      />
                      <Input
                        placeholder="Max e.g. 100000"
                        type="number"
                        value={form.salaryMax}
                        onChange={(e) => update("salaryMax", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="vac-desc">
                      Job Description{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="vac-desc"
                      placeholder="Describe the role, responsibilities, requirements, and benefits..."
                      rows={5}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      className="resize-none"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleDraft}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button type="submit" className="flex-1">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Post Vacancy
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Tab: India Vacancies ── */}
        <TabsContent value="india" className="flex-1 mt-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">
                  All New Vacancies — India
                </p>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {newVacancies.length} listing
                  {newVacancies.length !== 1 ? "s" : ""}
                </span>
              </div>
              {newVacancies.length === 0 ? (
                <EmptyState message="No new vacancies yet. Post one using the 'Post New' tab." />
              ) : (
                <div className="space-y-3">
                  {newVacancies.map((job) => (
                    <VacancyCard key={job.jobId} job={job} />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ── Tab: State Vacancies ── */}
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
                <EmptyState message="Select a state above to view its new vacancies." />
              ) : stateVacancies.length === 0 ? (
                <EmptyState
                  message={`No new vacancies found in ${selectedState}.`}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {selectedState}
                    </p>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {stateVacancies.length} listing
                      {stateVacancies.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {stateVacancies.map((job) => (
                      <VacancyCard key={job.jobId} job={job} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
