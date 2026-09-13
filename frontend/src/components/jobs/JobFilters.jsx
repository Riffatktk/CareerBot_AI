import React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { WORK_MODES, SORT_OPTIONS } from "@/utils/constants";

export function JobFilters({
  search,
  onSearchChange,
  workMode,
  onWorkModeChange,
  sort,
  onSortChange,
  resultsCount,
  totalCount,
}) {
  const hasActiveFilters = search.trim() !== "" || workMode !== "all";

  function handleClearAll() {
    onSearchChange("");
    onWorkModeChange("all");
  }

  return (
    <div className="sticky top-14 z-40 -mx-4 border-b border-border bg-surface px-4 py-3 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-[280px]">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or company"
            className="w-full rounded-btn border border-border bg-surface-2 py-2 pl-9 pr-8 text-sm text-text placeholder:text-text-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-border bg-surface-2 p-1">
            {WORK_MODES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onWorkModeChange(opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  workMode === opt.value
                    ? "bg-accent text-white"
                    : "text-text-2 hover:text-text"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative inline-flex">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort jobs"
              className="appearance-none rounded-btn border border-border bg-surface-2 py-2 pl-3 pr-8 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-3"
            />
          </div>

          <span className="text-sm text-text-3 lg:hidden">
            {resultsCount} of {totalCount} jobs
          </span>
        </div>

        <span className="hidden text-sm text-text-3 lg:inline">
          {resultsCount} of {totalCount} jobs
        </span>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {search.trim() !== "" && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-2 transition-colors hover:bg-surface"
            >
              &ldquo;{search}&rdquo;
              <X size={12} />
            </button>
          )}
          {workMode !== "all" && (
            <button
              type="button"
              onClick={() => onWorkModeChange("all")}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-2 transition-colors hover:bg-surface"
            >
              {workMode}
              <X size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-accent hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
