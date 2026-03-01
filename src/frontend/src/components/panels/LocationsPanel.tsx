import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { SAMPLE_JOBS } from "../../data/jobs";

interface LocationsPanelProps {
  onStateFilter: (state: string) => void;
  activeState?: string;
}

// Build a map of state -> count
const STATE_COUNTS = SAMPLE_JOBS.reduce<Record<string, number>>((acc, job) => {
  acc[job.state] = (acc[job.state] ?? 0) + 1;
  return acc;
}, {});

const SORTED_STATES = Object.entries(STATE_COUNTS).sort((a, b) =>
  a[0].localeCompare(b[0]),
);

// Regional groupings
const REGIONS: Record<string, string[]> = {
  "North India": ["Delhi", "Jammu & Kashmir", "Uttar Pradesh"],
  "West India": ["Gujarat", "Maharashtra"],
  "South India": ["Andhra Pradesh", "Karnataka", "Tamil Nadu", "Telangana"],
  "East India": ["West Bengal"],
};

function getRegion(state: string): string {
  for (const [region, states] of Object.entries(REGIONS)) {
    if (states.includes(state)) return region;
  }
  return "Other";
}

interface GroupedState {
  region: string;
  states: Array<{ name: string; count: number }>;
}

function groupByRegion(): GroupedState[] {
  const grouped: Record<string, Array<{ name: string; count: number }>> = {};

  for (const [name, count] of SORTED_STATES) {
    const region = getRegion(name);
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push({ name, count });
  }

  const regionOrder = [
    "North India",
    "West India",
    "South India",
    "East India",
    "Other",
  ];
  return regionOrder
    .filter((r) => grouped[r])
    .map((r) => ({ region: r, states: grouped[r] }));
}

const GROUPED = groupByRegion();
const TOTAL_JOBS = SAMPLE_JOBS.length;

export function LocationsPanel({
  onStateFilter,
  activeState,
}: LocationsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4 space-y-1">
        <h2 className="text-xl font-display font-bold text-foreground">
          Locations
        </h2>
        <p className="text-sm text-muted-foreground">
          {TOTAL_JOBS} jobs across {SORTED_STATES.length} states in India. Tap a
          state to filter.
        </p>
      </div>

      {/* All jobs option */}
      <div className="px-6 pb-3">
        <button
          type="button"
          onClick={() => onStateFilter("all")}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150",
            !activeState || activeState === "all"
              ? "border-primary bg-primary/8 shadow-sm"
              : "border-border bg-card hover:border-primary/30 hover:bg-secondary/40",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              !activeState || activeState === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <span
            className={cn(
              "flex-1 text-sm font-semibold",
              !activeState || activeState === "all"
                ? "text-primary"
                : "text-foreground",
            )}
          >
            All India
          </span>
          <Badge variant="secondary" className="text-xs">
            {TOTAL_JOBS}
          </Badge>
        </button>
      </div>

      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="space-y-6">
          {GROUPED.map(({ region, states }) => (
            <div key={region}>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {region}
              </h3>
              <div className="space-y-2">
                {states.map(({ name, count }) => {
                  const isActive = activeState === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => onStateFilter(name)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-150",
                        isActive
                          ? "border-primary/60 bg-primary/8"
                          : "border-transparent hover:border-border hover:bg-secondary/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          isActive ? "bg-primary" : "bg-muted-foreground/40",
                        )}
                      />
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          isActive
                            ? "font-semibold text-primary"
                            : "text-foreground",
                        )}
                      >
                        {name}
                      </span>
                      <Badge
                        variant={isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
