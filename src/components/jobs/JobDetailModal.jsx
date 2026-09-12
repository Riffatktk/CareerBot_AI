import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';
import { WorkModeBadge, MatchScoreBadge } from '../common/Badge';

export const JobDetailModal = () => {
  const { 
    selectedJob, 
    isDetailModalOpen, 
    closeDetailModal, 
    savedJobIds, 
    toggleSaveJob, 
    appliedJobIds, 
    markAsApplied 
  } = useJobStore();

  if (!isDetailModalOpen || !selectedJob) return null;

  const isSaved = savedJobIds.includes(selectedJob.id);
  const isApplied = appliedJobIds.includes(selectedJob.id);

  const handleApply = () => {
    markAsApplied(selectedJob.id, selectedJob.title);
    window.open(selectedJob.apply_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {selectedJob.company_logo ? (
                <img src={selectedJob.company_logo} alt={selectedJob.company} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100">
                {selectedJob.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="text-slate-200 font-semibold">{selectedJob.company}</span>
                <span>•</span>
                <span className="font-mono text-indigo-400">via {selectedJob.source || 'Scraper'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDetailModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key metadata banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <WorkModeBadge mode={selectedJob.work_mode} />
              {selectedJob.location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedJob.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {selectedJob.salary_range || 'Not disclosed'}
              </span>
            </div>

            <MatchScoreBadge score={selectedJob.match_score} />
          </div>

          {/* Gemini AI Match Justification */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-slate-900/90 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Google Gemini 1.5 Flash Match Analysis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedJob.match_reason}
            </p>
          </div>

          {/* AI 3-Line Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              AI Job Description Summary
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {selectedJob.description_summary}
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Matched Skills ({selectedJob.skills_matched?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills_matched?.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing or Growth Skills */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Growth / Bonus Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills_missing && selectedJob.skills_missing.length > 0 ? (
                  selectedJob.skills_missing.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No critical skill gaps identified</span>
                )}
              </div>
            </div>
          </div>

          {/* Freshness & Scraping Provenance */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-indigo-400" />
              Posted: {selectedJob.date_posted} (Past 24h)
            </span>
            <span>Origin: {selectedJob.source || 'Scraper Aggregator'}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleSaveJob(selectedJob.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              isSaved
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
            {isSaved ? 'Saved to Bookmarks' : 'Bookmark Job'}
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition transform hover:-translate-y-0.5"
          >
            {isApplied ? 'Re-open Application Page' : 'Direct Apply on Job Portal'}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
