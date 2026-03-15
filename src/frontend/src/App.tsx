import { Toaster } from "@/components/ui/sonner";
import {
  Briefcase,
  Download,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Menu,
  Send,
  TrendingUp,
  Twitter,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { JobType } from "./backend.d";
import { VacancyStatus } from "./backend.d";
import { ApplyModal } from "./components/ApplyModal";
import { FilterBar, type Filters } from "./components/FilterBar";
import { HomeGrid } from "./components/HomeGrid";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { PanelSheet } from "./components/PanelSheet";
import { type PanelId, SideMenu } from "./components/SideMenu";
import type { AuthUser } from "./components/panels/AuthPanel";
import {
  applyStoredFont,
  applyStoredTheme,
} from "./components/panels/ThemesPanel";
import { type JobListing, SAMPLE_JOBS } from "./data/jobs";

// Apply stored theme and font on first render
applyStoredTheme();
applyStoredFont();

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

// Extend Window to include BeforeInstallPromptEvent and our early capture
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __pwaInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

export default function App() {
  // ── Onboarding state (must be before any early return) ──
  const [onboardingDone, setOnboardingDone] = useState<boolean>(
    () => localStorage.getItem("jf_onboarding_done") === "true",
  );

  // ── Auth state ──
  const [user, setUser] = useState<AuthUser | null>(() => {
    const name = localStorage.getItem("jf_user_name");
    const email = localStorage.getItem("jf_user_email") || "";
    const phone = localStorage.getItem("jf_user_phone") || "";
    const userId = localStorage.getItem("jf_user_id") || `jf-${Date.now()}`;
    const authMethod =
      (localStorage.getItem("jf_user_auth_method") as "email" | "phone") ||
      "email";
    const createdAt =
      Number(localStorage.getItem("jf_user_created_at")) || Date.now();
    if (!name) return null;
    if (!email && !phone) return null;
    return { name, email, phone, userId, authMethod, createdAt };
  });

  function handleLogin(u: AuthUser) {
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("jf_user_name");
    localStorage.removeItem("jf_user_email");
    localStorage.removeItem("jf_user_phone");
    localStorage.removeItem("jf_user_id");
    localStorage.removeItem("jf_user_auth_method");
    localStorage.removeItem("jf_user_created_at");
    localStorage.removeItem("jf_user_location");
    localStorage.removeItem("jf_user_job_title");
    setUser(null);
    setIsDrawerOpen(false);
    setActivePanel(null);
  }

  // ── App state ──
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [postedJobs, setPostedJobs] = useState<JobListing[]>([]);

  // Side menu state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId>(null);

  // ── PWA install prompt ──
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Always clear the dismissed flag so every fresh deploy shows the prompt again
    localStorage.removeItem("jf_pwa_dismissed");

    // CRITICAL: Check if Chrome fired beforeinstallprompt before React mounted.
    // index.html captures it early in window.__pwaInstallPrompt.
    if (window.__pwaInstallPrompt) {
      deferredPromptRef.current = window.__pwaInstallPrompt;
      setShowInstallBanner(true);
      return;
    }

    // If not captured yet, listen for both the original event and the custom
    // re-dispatch from index.html's early listener.
    function onPromptAvailable() {
      if (window.__pwaInstallPrompt && !deferredPromptRef.current) {
        deferredPromptRef.current = window.__pwaInstallPrompt;
        setShowInstallBanner(true);
      }
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = e as BeforeInstallPromptEvent;
      setShowInstallBanner(true);
    }

    window.addEventListener("jf-pwa-ready", onPromptAvailable);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("jf-pwa-ready", onPromptAvailable);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function handleInstallClick() {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
      window.__pwaInstallPrompt = null;
    }
    deferredPromptRef.current = null;
  }

  function handleDismissBanner() {
    setShowInstallBanner(false);
    localStorage.setItem("jf_pwa_dismissed", "true");
  }

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

  const allJobs = useMemo(() => [...postedJobs, ...SAMPLE_JOBS], [postedJobs]);

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

  const newIndiaJobs = useMemo(
    () =>
      baseFilteredJobs
        .filter((j) => j.status === VacancyStatus.new_)
        .sort((a, b) => (a.datePosted > b.datePosted ? -1 : 1)),
    [baseFilteredJobs],
  );

  const oldIndiaJobs = useMemo(
    () =>
      baseFilteredJobs
        .filter((j) => j.status === VacancyStatus.old)
        .sort((a, b) => (a.datePosted > b.datePosted ? -1 : 1)),
    [baseFilteredJobs],
  );

  function handleOnboardingComplete(language: string) {
    localStorage.setItem("jf_language", language);
    localStorage.setItem("jf_onboarding_done", "true");
    setOnboardingDone(true);
  }

  function handleMenuItemSelect(panel: PanelId) {
    setActivePanel(panel);
  }

  if (!onboardingDone) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Side Drawer */}
      <SideMenu
        isOpen={isDrawerOpen}
        activePanel={activePanel}
        onClose={() => setIsDrawerOpen(false)}
        onSelectPanel={handleMenuItemSelect}
        onLogout={handleLogout}
        user={user}
      />

      {/* Panel Sheet (right side) */}
      <PanelSheet
        activePanel={activePanel}
        onClose={() => setActivePanel(null)}
        onStateFilter={() => {}}
        activeState="all"
        onNewJob={(job) => setPostedJobs((prev) => [job, ...prev])}
        allVacancies={allJobs}
        user={user}
        onLogin={handleLogin}
        onOpenAuth={() => setActivePanel("auth")}
        onLogout={handleLogout}
        onNavigate={(panel) => setActivePanel(panel)}
      />

      {/* ──────────────── PWA Install Banner ──────────────── */}
      {showInstallBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 shadow-lg"
          style={{ background: "#1e3a8a" }}
          data-ocid="pwa.install_banner"
        >
          <img
            src="/assets/generated/app-icon-jobfinder.dim_512x512.png"
            alt="JobFinder icon"
            className="w-10 h-10 rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight">
              Install JobFinder
            </p>
            <p className="text-blue-200 text-xs leading-tight">
              Add to home screen for quick access
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-900 text-xs font-bold flex-shrink-0 active:scale-95 transition-transform"
            data-ocid="pwa.install_button"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            type="button"
            onClick={handleDismissBanner}
            className="w-7 h-7 flex items-center justify-center rounded-full text-blue-200 hover:text-white flex-shrink-0"
            aria-label="Dismiss install prompt"
            data-ocid="pwa.dismiss_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ──────────────── Header / Nav ──────────────── */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors -ml-1"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              aria-controls="side-menu"
              data-ocid="header.menu_button"
            >
              <Menu className="w-5 h-5" />
            </button>

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
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.8 0.05 240 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.05 240 / 0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
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
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: "#1877F2" }}
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: "#000000" }}
                aria-label="Follow us on Twitter / X"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://telegram.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: "#2AABEE" }}
                aria-label="Follow us on Telegram"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: "#0A66C2" }}
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="border-t border-border mt-6 pt-5 flex flex-col items-center text-center">
            <p className="text-xs font-normal text-muted-foreground">
              © 2026 JobFinder India. All rights reserved.
            </p>
            <p className="text-xs font-normal text-muted-foreground mt-1">
              Developed by Saurabh_Anshul_
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
