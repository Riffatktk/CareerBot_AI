import React from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, RefreshCw, Zap } from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';

export const JobFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    workModeFilter,
    setWorkModeFilter,
    minMatchScore,
    setMinMatchScore,
    sortBy,
    setSortBy,
    autoPollEnabled,
    setAutoPoll,
    fetchJobs,
    isLoading
  } = useJobStore();

  const workModes = [
    { id: 'all', label: 'All Modes' },
    { id: 'remote', label: 'Remote' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'onsite', label: 'Onsite' },
  ];

  const scoreOptions = [
    { val: 0, label: 'All Scores' },
    { val: 80, label: '80%+ Match' },
    { val: 85, label: '85%+ Match' },
    { val: 90, label: '90%+ Top Match' },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, skill (e.g. Python, FastAPI, React)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* Action buttons & live sync */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            type="button"
            onClick={() => fetchJobs(true)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
            title="Refresh job listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Auto-poll switch */}
          <button
            type="button"
            onClick={() => setAutoPoll(!autoPollEnabled)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              autoPollEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Auto-fetch newly scraped jobs from agent"
          >
            <span className={`w-2 h-2 rounded-full ${autoPollEnabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>Live Polling</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        {/* Work Mode Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {workModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setWorkModeFilter(mode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                workModeFilter === mode.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Score & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Match Score Threshold */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Fit:</span>
            <select
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {scoreOptions.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="match_score">AI Match Score (High to Low)</option>
              <option value="date_posted">Newest 24h Postings</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
