import React, { useEffect } from 'react';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { JobStatsBar } from '../components/jobs/JobStatsBar';
import { useJobStore } from '../store/useJobStore';
import { useAgentStore } from '../store/useAgentStore';
import { useResumeStore } from '../store/useResumeStore';
import { 
  Sparkles, 
  Briefcase, 
  Zap, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { 
    jobs, 
    isLoading, 
    fetchJobs, 
    autoPollEnabled, 
    totalCount,
    searchQuery,
    workModeFilter,
    minMatchScore
  } = useJobStore();

  const { agentStatus, lastRunTime, triggerRunNow, isLoadingAction } = useAgentStore();
  const { resumeData, userPrompt } = useResumeStore();

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-polling interval
  useEffect(() => {
    if (!autoPollEnabled) return;

    const interval = setInterval(() => {
      fetchJobs(false);
    }, 20000); // 20s poll

    return () => clearInterval(interval);
  }, [autoPollEnabled]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Curated Job Feed
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Past 24h Listings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated Gemini relevance scoring against your active resume profile.
          </p>
        </div>

        {/* Quick Agent Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400">Agent Loop Status:</div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
              <span className={`w-2 h-2 rounded-full ${agentStatus === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              {agentStatus} (09:00 AM Cron)
            </div>
          </div>

          <button
            type="button"
            onClick={() => triggerRunNow(resumeData?.resume_id, userPrompt)}
            disabled={isLoadingAction}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoadingAction ? (
              <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
            ) : (
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            )}
            Run Now
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <JobStatsBar />

      {/* Search & Multi-Facet Filters */}
      <JobFilters />

      {/* Job Cards Grid / Feed */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Fetching latest matched positions...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No jobs match your current filters</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, lowering the minimum match score, or click "Run Now" to trigger a fresh scrape.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchJobs(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            Reset Filters & Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Detail Modal Drawer */}
      <JobDetailModal />
    </div>
  );
};
