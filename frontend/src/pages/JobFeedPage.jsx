import React, { useState } from "react";
import { RotateCw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { AgentStatusBar } from "@/components/agent/AgentStatusBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobGrid } from "@/components/jobs/JobGrid";
import { JobDrawer } from "@/components/jobs/JobDrawer";
import { useAgent } from "@/hooks/useAgent";
import { useJobs } from "@/hooks/useJobs";
import { formatRelativeTime } from "@/utils/formatters";

export function JobFeedPage() {
  const { totalJobsFound, totalRuns, lastRun } = useAgent();
  const {
    jobs,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    filteredJobs,
    search,
    setSearch,
    workMode,
    setWorkMode,
    sort,
    setSort,
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState(null);

  function handleClearFilters() {
    setSearch("");
    setWorkMode("all");
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageWrapper title="Job Feed — CareerBot AI">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text">Job Feed</h1>
            <p className="mt-1 text-sm text-text-3">
              {totalJobsFound} jobs found across {totalRuns} scans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-3">
              Last updated {formatRelativeTime(lastRun)}
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              aria-label="Refresh jobs"
              title="Refresh jobs"
              disabled={isFetching}
              className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-border bg-surface text-text-2 transition-colors hover:bg-surface-2 disabled:opacity-50"
            >
              <RotateCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <AgentStatusBar />
        </div>

        <JobFilters
          search={search}
          onSearchChange={setSearch}
          workMode={workMode}
          onWorkModeChange={setWorkMode}
          sort={sort}
          onSortChange={setSort}
          resultsCount={filteredJobs.length}
          totalCount={jobs.length}
        />

        <div className="mt-6">
          <JobGrid
            jobs={filteredJobs}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onViewDetails={setSelectedJob}
            onClearFilters={handleClearFilters}
          />
        </div>
      </PageWrapper>

      <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
