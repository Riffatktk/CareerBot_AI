import React from 'react';
import { Briefcase, Sparkles, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';

export const JobStatsBar = () => {
  const { jobs } = useJobStore();

  const total = jobs.length;
  const topScore = total > 0 ? Math.max(...jobs.map(j => j.match_score)) : 0;
  const avgScore = total > 0 ? Math.round(jobs.reduce((acc, j) => acc + j.match_score, 0) / total) : 0;
  const remoteCount = jobs.filter(j => (j.work_mode || '').toLowerCase() === 'remote').length;
  const remotePercent = total > 0 ? Math.round((remoteCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="glass-card rounded-xl p-3 border border-slate-800/80 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Feed</div>
          <div className="text-base font-extrabold text-slate-100">{total} Positions</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-3 border border-slate-800/80 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Peak Fit Score</div>
          <div className="text-base font-extrabold text-emerald-400">{topScore}% Match</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-3 border border-slate-800/80 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Remote Ratio</div>
          <div className="text-base font-extrabold text-cyan-300">{remotePercent}% ({remoteCount})</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-3 border border-slate-800/80 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Average Match</div>
          <div className="text-base font-extrabold text-indigo-300">{avgScore}% Alignment</div>
        </div>
      </div>
    </div>
  );
};
