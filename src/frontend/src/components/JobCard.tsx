import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, DollarSign, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { JobType } from "../backend.d";
import {
  type JobListing,
  formatSalary,
  jobTypeLabel,
  timeAgo,
} from "../data/jobs";

interface JobCardProps {
  job: JobListing;
  onApply: (job: JobListing) => void;
  index: number;
}

function jobTypeBadgeClass(type: JobType): string {
  switch (type) {
    case JobType.fullTime:
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case JobType.partTime:
      return "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-100";
    case JobType.contract:
      return "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100";
    case JobType.remote:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
  }
}

export function JobCard({ job, onApply, index }: JobCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      className="group relative bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-accent/80 to-primary/30" />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base text-foreground leading-snug group-hover:text-primary transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 truncate font-medium">
              {job.company}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 ${jobTypeBadgeClass(job.jobType)}`}
          >
            {jobTypeLabel(job.jobType)}
          </Badge>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
            <span className="truncate">
              {job.district}, {job.state}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
            <span>
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
            <span>{timeAgo(job.datePosted)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {job.description}
        </p>

        {/* Footer */}
        <div className="pt-1 border-t border-border/60">
          <Button
            onClick={() => onApply(job)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold group/btn"
            size="sm"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
