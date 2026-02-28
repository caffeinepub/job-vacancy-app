import { Briefcase, MapPin, TrendingUp, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { JobType } from "./backend.d";
import { ApplyModal } from "./components/ApplyModal";
import { FilterBar, type Filters } from "./components/FilterBar";
import { JobCard } from "./components/JobCard";
import { type JobListing, SAMPLE_JOBS } from "./data/jobs";

const INITIAL_FILTERS: Filters = {
  search: "",
  state: "all",
  district: "all",
  jobType: "all",
};

const STATS = [
  { icon: Briefcase, label: "Active Jobs", value: "20+" },
  { icon: MapPin, label: "States Covered", value: "9" },
  { icon: Users, label: "Companies Hiring", value: "18+" },
  { icon: TrendingUp, label: "Industries", value: "7" },
];

export default function App() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const filteredJobs = useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    return SAMPLE_JOBS.filter((job) => {
      if (
        query &&
        !job.title.toLowerCase().includes(query) &&
        !job.company.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (filters.state !== "all" && job.state !== filters.state) return false;
      if (filters.district !== "all" && job.district !== filters.district)
        return false;
      if (
        filters.jobType !== "all" &&
        job.jobType !== (filters.jobType as JobType)
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ──────────────── Header / Nav ──────────────── */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase
                className="w-4.5 h-4.5 text-primary-foreground"
                style={{ width: "1.1rem", height: "1.1rem" }}
              />
            </div>
            <div className="leading-none">
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                JobFinder
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground -mt-0.5">
                Malaysia's Job Board
              </span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6">
            <a
              href="#jobs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Browse Jobs
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {SAMPLE_JOBS.length} open positions
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* ──────────────── Hero ──────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.25 0.08 258) 0%, oklch(0.32 0.1 255) 50%, oklch(0.2 0.06 270) 100%)",
        }}
      >
        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.8 0.05 240 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.05 240 / 0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow accents */}
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {SAMPLE_JOBS.length} opportunities available now
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-tight">
              Find Your Next{" "}
              <span
                className="relative inline-block"
                style={{ color: "oklch(0.82 0.18 220)" }}
              >
                Career
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6 Q50 1 100 5 Q150 9 200 4"
                    stroke="oklch(0.72 0.2 220)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Step
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover top opportunities across Malaysia — from Kuala Lumpur to
              Sabah. Your ideal role is waiting.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/8 border border-white/12 backdrop-blur-sm"
              >
                <stat.icon className="w-5 h-5 text-white/60 mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/55 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── Main Content ──────────────── */}
      <main
        id="jobs"
        className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10"
      >
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <FilterBar
            filters={filters}
            totalCount={SAMPLE_JOBS.length}
            filteredCount={filteredJobs.length}
            onChange={setFilters}
          />
        </motion.div>

        {/* Job Grid */}
        <div className="mt-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  No jobs found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Try adjusting your filters or search terms to discover more
                  opportunities.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredJobs.map((job, i) => (
                  <JobCard
                    key={job.jobId}
                    job={job}
                    onApply={setSelectedJob}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ──────────────── Footer ──────────────── */}
      <footer id="about" className="border-t border-border bg-card mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-foreground">
                  JobFinder
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connecting talented professionals with leading employers across
                Malaysia.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Industries
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Technology & Engineering</li>
                <li>Healthcare & Medical</li>
                <li>Finance & Accounting</li>
                <li>Education & Training</li>
                <li>Marketing & Creative</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Locations
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Kuala Lumpur</li>
                <li>Selangor</li>
                <li>Penang</li>
                <li>Johor</li>
                <li>Sabah, Sarawak & More</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} JobFinder Malaysia. All rights
              reserved.
            </p>
            <p>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Apply Modal */}
      <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
