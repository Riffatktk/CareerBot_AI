import React from "react";
import { AnimatePresence } from "framer-motion";
import { JobCard } from "@/components/jobs/JobCard";
import { JobSkeleton } from "@/components/jobs/JobSkeleton";
import { JobEmptyState } from "@/components/jobs/JobEmptyState";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

export function JobGrid({ jobs, isLoading, isError, error, onViewDetails, onClearFilters }) {
  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load jobs."} />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <JobEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {jobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} onViewDetails={onViewDetails} />
        ))}
      </AnimatePresence>
    </div>
  );
}
