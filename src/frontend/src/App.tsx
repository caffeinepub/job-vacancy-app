import { Toaster } from "@/components/ui/sonner";
import {
  Briefcase,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Send,
  TrendingUp,
  Twitter,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { JobType } from "./backend.d";
import { VacancyStatus } from "./backend.d";
import { ApplyModal } from "./components/ApplyModal";
import { FilterBar, type Filters } from "./components/FilterBar";
import { HomeGrid } from "./components/HomeGrid";
import { PanelSheet } from "./components/PanelSheet";
import { type PanelId, SideMenu } from "./components/SideMenu";
import { applyStoredTheme } from "./components/panels/ThemesPanel";
import { type JobListing, SAMPLE_JOBS } from "./data/jobs";

// Apply stored theme on first render
applyStoredTheme();

const INITIAL_FILTERS: Filters = {
  search: "",
  jobType: "all",
};

const STATS = [
  { icon: Briefcase, label: "Active Jobs", value: "20+" },
  { icon: MapPin, label: "States Covered", value: "10" },
  { icon: Users, label: "Companies Hiring", value: "18+" },
  { icon: TrendingUp, label: "Industries", value: "7" },
];

export default function App() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [postedJobs, setPostedJobs] = useState<JobListing[]>([]);

  // Side menu state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId>(null);

  // ESC key to close drawer
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activePanel !== null) {
          setActivePanel(null);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, activePanel]);

  function handleMenuItemSelect(panel: PanelId) {
    setActivePanel(panel);
  }

  const allJobs = useMemo(() => [...postedJobs, ...SAMPLE_JOBS], [postedJobs]);

  // Base filtered jobs applying global search + jobType filter
  const baseFilteredJobs = useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    return allJobs.filter((job) => {
      if (
        query &&
        !job.title.toLowerCase().includes(query) &&
        !job.company.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (
        filters.jobType !== "all" &&
        job.jobType !== (filters.jobType as JobType)
      )
        return false;
      return true;
    });
  }, [filters, allJobs]);

  // Panel 1: Indian New Vacancies — all new, sorted by datePosted desc
  const newIndiaJobs = useMemo(
    () =>
      baseFilteredJobs
        .filter((j) => j.status === VacancyStatus.new_)
        .sort((a, b) => (a.datePosted > b.datePosted ? -1 : 1)),
    [baseFilteredJobs],
  );

  // Panel 3: Indian Old Vacancies — all old, sorted by datePosted desc
  const oldIndiaJobs = useMemo(
    () =>
      baseFilteredJobs
        .filter((j) => j.status === VacancyStatus.old)
        .sort((a, b) => (a.datePosted > b.datePosted ? -1 : 1)),
    [baseFilteredJobs],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Side Drawer */}
      <SideMenu
        isOpen={isDrawerOpen}
        activePanel={activePanel}
        onClose={() => setIsDrawerOpen(false)}
        onSelectPanel={handleMenuItemSelect}
      />

      {/* Panel Sheet (right side) */}
      <PanelSheet
        activePanel={activePanel}
        onClose={() => setActivePanel(null)}
        onStateFilter={() => {}}
        activeState="all"
        onNewJob={(job) => setPostedJobs((prev) => [job, ...prev])}
        allVacancies={allJobs}
      />

      {/* ──────────────── Header / Nav ──────────────── */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors -ml-1"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              aria-controls="side-menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
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
                  India's Job Board
                </span>
              </div>
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
              {allJobs.length} open positions
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
              {allJobs.length} opportunities available now
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
              Discover top opportunities across India — from Jammu &amp; Kashmir
              to Kanyakumari. Your ideal role is waiting.
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
            totalCount={allJobs.length}
            filteredCount={newIndiaJobs.length + oldIndiaJobs.length}
            onChange={setFilters}
          />
        </motion.div>

        {/* 2x2 Home Grid — Quick Vacancy Overview */}
        <HomeGrid
          newIndiaJobs={newIndiaJobs}
          oldIndiaJobs={oldIndiaJobs}
          newStateJobs={newIndiaJobs}
          oldStateJobs={oldIndiaJobs}
        />
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
                India.
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
                <li>Delhi</li>
                <li>Mumbai</li>
                <li>Bengaluru</li>
                <li>Hyderabad</li>
                <li>Chennai, Kolkata & More</li>
              </ul>
            </div>
          </div>
          {/* Follow Us Section */}
          <div className="border-t border-border mt-8 pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">
              Follow Us
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                style={{ backgroundColor: "#1877F2" }}
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              {/* Twitter / X */}
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                style={{ backgroundColor: "#000000" }}
                aria-label="Follow us on Twitter / X"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              {/* Telegram */}
              <a
                href="https://telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                style={{ backgroundColor: "#2AABEE" }}
                aria-label="Follow us on Telegram"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                style={{ backgroundColor: "#0A66C2" }}
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="border-t border-border mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2026 JobFinder India. All rights reserved.</p>
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

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
