import React from 'react';
import clsx from 'clsx';

export const WorkModeBadge = ({ mode }) => {
  const normalized = (mode || '').toLowerCase();
  
  if (normalized === 'remote') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Remote
      </span>
    );
  }

  if (normalized === 'hybrid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        Hybrid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Onsite
    </span>
  );
};

export const MatchScoreBadge = ({ score, size = "md" }) => {
  const getColors = () => {
    if (score >= 90) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' };
    if (score >= 80) return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' };
    if (score >= 70) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' };
    return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', glow: '' };
  };

  const c = getColors();

  if (size === "sm") {
    return (
      <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border", c.bg, c.text, c.border)}>
        ⚡ {score}% Match
      </span>
    );
  }

  return (
    <div className={clsx("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-sm shadow-md", c.bg, c.text, c.border, c.glow)}>
      <span className="relative flex h-2 w-2">
        <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", score >= 90 ? "bg-emerald-400" : "bg-cyan-400")}></span>
        <span className={clsx("relative inline-flex rounded-full h-2 w-2", score >= 90 ? "bg-emerald-500" : "bg-cyan-500")}></span>
      </span>
      <span>{score}% Match</span>
    </div>
  );
};
