import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { WorkModeBadge, MatchScoreBadge } from '../common/Badge';
import { useJobStore } from '../../store/useJobStore';

export const JobCard = ({ job }) => {
  const { setSelectedJob, toggleSaveJob, savedJobIds, appliedJobIds, markAsApplied } = useJobStore();

  const isSaved = savedJobIds.includes(job.id);
  const isApplied = appliedJobIds.includes(job.id);

  const handleApplyClick = (e) => {
    e.stopPropagation();
    markAsApplied(job.id, job.title);
    window.open(job.apply_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => setSelectedJob(job)}
      className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800/80 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
    >
      {/* Top ambient accent highlight for top match */}
      {job.match_score >= 90 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />
      )}

      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Company Avatar */}
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
              {job.company_logo ? (
                <img 
                  src={job.company_logo} 
                  alt={job.company} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Building2 className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition line-clamp-1">
                {job.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-medium text-slate-300">{job.company}</span>
                <span>•</span>
                <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  via {job.source || 'Scraper'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Match Score Radial Pill */}
          <div className="shrink-0">
            <MatchScoreBadge score={job.match_score} />
          </div>
        </div>

        {/* Badges Bar: Work Mode, Location, Salary, Freshness */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Work Mode Badge */}
          <WorkModeBadge mode={job.work_mode} />

          {/* Location (Shown for Onsite/Hybrid or when relevant) */}
          {job.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[150px]">{job.location}</span>
            </span>
          )}

          {/* Salary Range */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${
            job.salary_range && job.salary_range !== 'Not disclosed'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}>
            <DollarSign className="w-3 h-3 text-emerald-400" />
            {job.salary_range || 'Not disclosed'}
          </span>

          {/* Date Posted (Past 24h Indicator) */}
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 ml-auto font-mono">
            <Clock className="w-3 h-3 text-indigo-400" />
            {job.date_posted}
          </span>
        </div>

        {/* AI-Generated 3-Line Summary */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 relative">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Gemini AI 3-Line Summary
          </div>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {job.description_summary}
          </p>
        </div>

        {/* Skills Matched Chips */}
        {job.skills_matched && job.skills_matched.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Matched:</span>
            {job.skills_matched.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80"
              >
                {skill}
              </span>
            ))}
            {job.skills_matched.length > 4 && (
              <span className="text-[10px] text-indigo-400 font-mono">
                +{job.skills_matched.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.id);
            }}
            className={`p-2 rounded-lg border transition ${
              isSaved
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
          </button>

          {/* Quick View Details Button */}
          <button
            type="button"
            onClick={() => setSelectedJob(job)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Why Match?
          </button>
        </div>

        {/* Direct Apply Button */}
        <button
          type="button"
          onClick={handleApplyClick}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
            isApplied
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Applied
            </>
          ) : (
            <>
              Apply Now
              <ExternalLink className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
