import React from 'react';
import { Play, Pause, Square, Zap, Sparkles, Clock } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useResumeStore } from '../../store/useResumeStore';
import { useJobStore } from '../../store/useJobStore';

export const AgentControlPanel = () => {
  const { 
    agentStatus, 
    startAgent, 
    stopAgent, 
    pauseAgent, 
    triggerRunNow, 
    isLoadingAction 
  } = useAgentStore();
  
  const { resumeData, userPrompt } = useResumeStore();
  const { addNewScrapedJob } = useJobStore();

  const handleStart = () => {
    startAgent(resumeData?.resume_id, userPrompt);
  };

  const handleRunNow = async () => {
    await triggerRunNow(resumeData?.resume_id, userPrompt, () => {
      addNewScrapedJob(resumeData?.job_titles?.[0] ? `Senior ${resumeData.job_titles[0]}` : null);
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 dark:border-slate-800 border-slate-200 space-y-5 shadow-xl relative overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div>
          <h3 className="font-bold text-base dark:text-slate-100 text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            Agent Control Panel
          </h3>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
            Manage autonomous daily scheduler and trigger manual test loops
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs dark:text-slate-400 text-slate-600 font-medium">Current Loop State:</span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
            agentStatus === 'ACTIVE' ? 'bg-emerald-500/15 dark:text-emerald-400 text-emerald-700 border-emerald-500/30' :
            agentStatus === 'RUNNING' ? 'bg-cyan-500/15 dark:text-cyan-400 text-cyan-700 border-cyan-500/30' :
            agentStatus === 'PAUSED' ? 'bg-amber-500/15 dark:text-amber-400 text-amber-700 border-amber-500/30' :
            'bg-rose-500/15 dark:text-rose-400 text-rose-700 border-rose-500/30'
          }`}>
            {agentStatus}
          </span>
        </div>
      </div>

      {/* Button Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Start Agent Button */}
        <button
          type="button"
          onClick={handleStart}
          disabled={isLoadingAction || agentStatus === 'ACTIVE'}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:pointer-events-none transition transform hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 fill-white" />
          Start Agent (09:00 AM)
        </button>

        {/* Pause Agent Button */}
        <button
          type="button"
          onClick={pauseAgent}
          disabled={isLoadingAction || agentStatus !== 'ACTIVE'}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 disabled:opacity-40 disabled:pointer-events-none transition transform hover:-translate-y-0.5"
        >
          <Pause className="w-4 h-4" />
          Pause Agent
        </button>

        {/* Stop Agent Button */}
        <button
          type="button"
          onClick={stopAgent}
          disabled={isLoadingAction || agentStatus === 'STOPPED'}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 disabled:opacity-40 disabled:pointer-events-none transition transform hover:-translate-y-0.5"
        >
          <Square className="w-4 h-4 fill-white" />
          Stop Agent
        </button>

        {/* Special "Run Now" Testing Button */}
        <button
          type="button"
          onClick={handleRunNow}
          disabled={isLoadingAction}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isLoadingAction ? (
            <Sparkles className="w-4 h-4 animate-spin text-yellow-300" />
          ) : (
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
          )}
          <span>Run Now (Test Loop)</span>
        </button>
      </div>

      <div className="dark:bg-slate-900/60 bg-slate-50 rounded-xl p-3.5 border dark:border-slate-800/80 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 flex items-start gap-2">
        <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold dark:text-slate-200 text-slate-800">Autonomous Cron Rule:</span> When ACTIVE, APScheduler triggers every morning at <span className="dark:text-cyan-300 text-cyan-700 font-mono font-semibold">09:00 AM UTC</span>. Use <span className="text-amber-600 dark:text-yellow-300 font-semibold">"Run Now"</span> to test the live scraping + Gemini scoring loop immediately.
        </div>
      </div>
    </div>
  );
};
