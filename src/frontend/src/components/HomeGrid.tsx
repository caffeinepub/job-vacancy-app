import { motion } from "motion/react";
import type { JobListing } from "../data/jobs";

interface HomeGridProps {
  newIndiaJobs: JobListing[];
  oldIndiaJobs: JobListing[];
  newStateJobs: JobListing[];
  oldStateJobs: JobListing[];
}

interface CardConfig {
  title: string;
  headerColor: string;
  dotColor: string;
  jobs: JobListing[];
}

interface VacancyCardProps extends CardConfig {
  index: number;
}

function VacancyCard({
  title,
  headerColor,
  dotColor,
  jobs,
  index,
}: VacancyCardProps) {
  const displayJobs = jobs.slice(0, 6);
  const isEmpty = displayJobs.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      className="flex flex-col rounded border border-gray-300 bg-white shadow-sm overflow-hidden"
    >
      {/* Colored header strip */}
      <div
        className="py-2 px-3 flex items-center justify-between gap-2"
        style={{ backgroundColor: headerColor }}
      >
        <h3 className="font-bold text-white text-[13px] leading-tight tracking-wide uppercase">
          {title}
        </h3>
        <span className="bg-white/20 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
          {jobs.length} {jobs.length === 1 ? "post" : "posts"}
        </span>
      </div>

      {/* Card body — job list */}
      <div className="flex-1 px-3 py-2">
        {isEmpty ? (
          <p className="text-[13px] text-gray-400 py-3 text-center italic">
            No listings available
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {displayJobs.map((job) => (
              <li key={job.jobId} className="flex items-center gap-2 py-1.5">
                {/* Colored bullet dot */}
                <span
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-px"
                  style={{ backgroundColor: dotColor }}
                  aria-hidden="true"
                />
                <a
                  href="#jobs"
                  className="text-[13px] leading-snug line-clamp-1 hover:underline"
                  style={{ color: "#1a0dab" }}
                  title={job.title}
                >
                  {job.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View More button */}
      <button
        type="button"
        className="w-full text-center text-xs font-bold text-white py-1.5 px-3 transition-opacity hover:opacity-90 active:opacity-80 mt-auto"
        style={{ backgroundColor: headerColor }}
        aria-label={`View all ${title} listings`}
      >
        View More »
      </button>
    </motion.div>
  );
}

const CARD_CONFIGS = (
  newIndiaJobs: JobListing[],
  oldIndiaJobs: JobListing[],
  newStateJobs: JobListing[],
  oldStateJobs: JobListing[],
): CardConfig[] => [
  {
    title: "Indian New Vacancy",
    headerColor: "#8b0000",
    dotColor: "#8b0000",
    jobs: newIndiaJobs,
  },
  {
    title: "Indian Old Vacancy",
    headerColor: "#00008B",
    dotColor: "#00008B",
    jobs: oldIndiaJobs,
  },
  {
    title: "State New Vacancy",
    headerColor: "#006400",
    dotColor: "#006400",
    jobs: newStateJobs,
  },
  {
    title: "State Old Vacancy",
    headerColor: "#e07b00",
    dotColor: "#e07b00",
    jobs: oldStateJobs,
  },
];

export function HomeGrid({
  newIndiaJobs,
  oldIndiaJobs,
  newStateJobs,
  oldStateJobs,
}: HomeGridProps) {
  const cards = CARD_CONFIGS(
    newIndiaJobs,
    oldIndiaJobs,
    newStateJobs,
    oldStateJobs,
  );

  return (
    <section aria-label="Vacancy Overview" className="mt-5">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap px-2">
          Latest Vacancies
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <VacancyCard key={card.title} {...card} index={i} />
        ))}
      </div>
    </section>
  );
}
