import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Calendar, 
  Briefcase, 
  Zap, 
  Terminal,
  Activity
} from 'lucide-react';
import { MatchScoreBadge } from '../components/common/Badge';

export const HistoryPage = () => {
  const { runHistory, agentStatus } = useAgentStore();
  const [selectedLog, setSelectedLog] = useState(runHistory[0] || null);

  const totalRuns = runHistory.length;
  const totalScraped = runHistory.reduce((acc, log) => acc + (log.jobs_scraped || 0), 0);
  const avgTopScore = totalRuns > 0 
    ? Math.round(runHistory.reduce((acc, log) => acc + (log.top_score || 0), 0) / totalRuns) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Agent History & Run Audit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {totalRuns} Executions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Historical audit logs of all automated 9:00 AM cron cycles and manual test triggers.
          </p>
        </div>
      </div>

      {/* Aggregate History Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider">
            <span>Total Agent Runs</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{totalRuns} Executed</div>
          <p className="text-[11px] text-slate-400">Autonomous 9 AM crons & test runs</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider">
            <span>Aggregated 24h Jobs</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">{totalScraped} Scraped & Scored</div>
          <p className="text-[11px] text-slate-400">From LinkedIn, Indeed, Glassdoor</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider">
            <span>Average Peak Match</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{avgTopScore}% Top Score</div>
          <p className="text-[11px] text-slate-400">Evaluated by Gemini 1.5 Flash</p>
        </div>
      </div>

      {/* Run Logs Table & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Logs List */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Automated Run Log
            </h3>
            <span className="text-xs text-slate-500">Sorted by newest</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {runHistory.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-4 transition cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${
                        log.run_type === 'SCHEDULED_CRON'
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {log.run_type === 'SCHEDULED_CRON' ? '9:00 AM Cron' : 'Run Now Test'}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {log.details}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">{log.top_score}% Match</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.duration}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Log Inspector */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Run Inspection Details
            </h4>
            {selectedLog && (
              <span className="text-[10px] font-mono text-indigo-400">{selectedLog.id}</span>
            )}
          </div>

          {selectedLog ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Timestamp</span>
                <div className="text-slate-200 font-mono">{selectedLog.timestamp}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Trigger Type</span>
                <div className="text-slate-200 font-medium">
                  {selectedLog.run_type === 'SCHEDULED_CRON' ? 'Autonomous 09:00 AM Daily Scheduler' : 'Manual Run Now Override'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Scraped & Scored</div>
                  <div className="text-sm font-bold text-slate-200">{selectedLog.jobs_scraped} Jobs</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Execution Time</div>
                  <div className="text-sm font-bold text-slate-200">{selectedLog.duration}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Execution Summary</span>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed text-xs">
                  {selectedLog.details}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Status 200 OK — Scraped jobs stored in SQLite database.</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Select a log entry from the list to inspect details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
