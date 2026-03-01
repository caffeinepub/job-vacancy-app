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

export interface Filters {
  search: string;
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
  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  const hasActiveFilters = filters.search !== "" || filters.jobType !== "all";

  function clearAll() {
    onChange({ search: "", jobType: "all" });
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
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

        {/* Job Type */}
        <Select
          value={filters.jobType}
          onValueChange={(v) => update({ jobType: v })}
        >
          <SelectTrigger className="bg-secondary/50 border-border sm:w-44">
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
      <div className="flex items-center justify-between pt-0.5">
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
