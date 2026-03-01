import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { INDIAN_STATES, type JobListing } from "../data/jobs";
import { JobCard } from "./JobCard";

interface VacancyPanelProps {
  title: string;
  jobs: JobListing[];
  onApply: (job: JobListing) => void;
  showStateSelector?: boolean;
  selectedState?: string;
  onStateChange?: (state: string) => void;
  emptyMessage?: string;
  accentVariant: "new" | "old";
}

export function VacancyPanel({
  title,
  jobs,
  onApply,
  showStateSelector = false,
  selectedState,
  onStateChange,
  emptyMessage = "No vacancies found.",
  accentVariant,
}: VacancyPanelProps) {
  const isNew = accentVariant === "new";

  const headerGradient = isNew
    ? "from-emerald-600/10 via-emerald-500/5 to-transparent"
    : "from-amber-600/10 via-amber-500/5 to-transparent";

  const accentBorder = isNew ? "border-emerald-500/30" : "border-amber-500/30";
  const accentBar = isNew
    ? "from-emerald-500 via-emerald-400 to-emerald-600/30"
    : "from-amber-500 via-amber-400 to-amber-600/30";
  const badgeBg = isNew
    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20";
  const iconColor = isNew ? "text-emerald-500" : "text-amber-500";
  const dotColor = isNew ? "bg-emerald-500" : "bg-amber-500";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`rounded-2xl border ${accentBorder} bg-card shadow-sm overflow-hidden`}
    >
      {/* Accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${accentBar}`} />

      {/* Panel Header */}
      <div
        className={`bg-gradient-to-r ${headerGradient} px-5 py-4 border-b border-border/60`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isNew ? "bg-emerald-500/15" : "bg-amber-500/15"
              }`}
            >
              <Briefcase className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground leading-tight flex items-center gap-2">
                {title}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${dotColor} inline-block`}
                />
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isNew ? "Active listings" : "Closed / expired listings"}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-xs font-semibold px-2.5 py-0.5 ${badgeBg}`}
          >
            {jobs.length} {jobs.length === 1 ? "vacancy" : "vacancies"}
          </Badge>
        </div>

        {/* State Selector */}
        {showStateSelector && onStateChange && (
          <div className="mt-3 flex items-center gap-2">
            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} />
            <Select
              value={selectedState ?? INDIAN_STATES[0]}
              onValueChange={onStateChange}
            >
              <SelectTrigger className="h-8 text-xs bg-background/60 border-border/80 hover:bg-background focus:ring-1 flex-1 max-w-[280px]">
                <SelectValue placeholder="Select state" />
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </SelectTrigger>
              <SelectContent className="max-h-[260px]">
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="p-5">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                isNew ? "bg-emerald-500/10" : "bg-amber-500/10"
              }`}
            >
              <Briefcase className={`w-6 h-6 ${iconColor} opacity-60`} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {emptyMessage}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {showStateSelector
                ? "Try selecting a different state."
                : "Check back later for new openings."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
              <JobCard key={job.jobId} job={job} onApply={onApply} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
