import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { STATES } from "../../data/jobs";

interface VacancyForm {
  jobTitle: string;
  company: string;
  state: string;
  district: string;
  jobType: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
}

const INITIAL: VacancyForm = {
  jobTitle: "",
  company: "",
  state: "",
  district: "",
  jobType: "",
  salaryMin: "",
  salaryMax: "",
  description: "",
};

const JOB_TYPES = [
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
  { value: "remote", label: "Remote" },
  { value: "contract", label: "Contract" },
];

export function NewVacancyPanel() {
  const [form, setForm] = useState<VacancyForm>(INITIAL);

  function update(field: keyof VacancyForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Vacancy posted successfully!", {
      description: `"${form.jobTitle}" has been published and is now visible to candidates.`,
    });
    setForm(INITIAL);
  }

  function handleDraft() {
    toast.success("Saved to drafts", {
      description: "You can continue editing this vacancy later.",
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Post a New Vacancy
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in the details to attract the right candidates across India.
        </p>
      </div>

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

        {/* State + District */}
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
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="vac-district">District</Label>
            <Input
              id="vac-district"
              placeholder="e.g. Bengaluru"
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
            />
          </div>
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
            Job Description <span className="text-destructive">*</span>
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
    </div>
  );
}
