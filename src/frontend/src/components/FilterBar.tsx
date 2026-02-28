import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { JobType } from "../backend.d";
import { STATES, getDistrictsForState } from "../data/jobs";

export interface Filters {
  search: string;
  state: string;
  district: string;
  jobType: string;
}

interface FilterBarProps {
  filters: Filters;
  totalCount: number;
  filteredCount: number;
  onChange: (filters: Filters) => void;
}

const JOB_TYPES = [
  { value: "all", label: "All Types" },
  { value: JobType.fullTime, label: "Full-time" },
  { value: JobType.partTime, label: "Part-time" },
  { value: JobType.contract, label: "Contract" },
  { value: JobType.remote, label: "Remote" },
];

export function FilterBar({
  filters,
  totalCount,
  filteredCount,
  onChange,
}: FilterBarProps) {
  const districts =
    filters.state !== "all" ? getDistrictsForState(filters.state) : [];

  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  function handleStateChange(state: string) {
    update({ state, district: "all" });
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.state !== "all" ||
    filters.district !== "all" ||
    filters.jobType !== "all";

  function clearAll() {
    onChange({ search: "", state: "all", district: "all", jobType: "all" });
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search job title or company..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="pl-9 pr-4 bg-secondary/50 border-border focus:bg-card"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => update({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdowns row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* State */}
        <Select value={filters.state} onValueChange={handleStateChange}>
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District */}
        <Select
          value={filters.district}
          onValueChange={(v) => update({ district: v })}
          disabled={filters.state === "all"}
        >
          <SelectTrigger className="bg-secondary/50 border-border disabled:opacity-50">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Type */}
        <Select
          value={filters.jobType}
          onValueChange={(v) => update({ jobType: v })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="All Types" />
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

      {/* Results count + clear */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
          of <span className="font-semibold text-foreground">{totalCount}</span>{" "}
          job{totalCount !== 1 ? "s" : ""}
        </p>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
