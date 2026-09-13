import React from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export function JobEmptyState({ onClearFilters }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No jobs found"
      description="Try adjusting your filters or work mode to see more results."
      action={
        <button
          type="button"
          onClick={onClearFilters}
          className="flex h-9 items-center rounded-btn border border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-surface-2"
        >
          Clear filters
        </button>
      }
    />
  );
}
