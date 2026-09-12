import React from 'react';
import { AgentControlPanel } from '../components/agent/AgentControlPanel';
import { AgentStatusCard } from '../components/agent/AgentStatusCard';
import { LiveTerminalLog } from '../components/agent/LiveTerminalLog';
import { Cpu, Layers, Sparkles, Clock, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export const AgentPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Agent Control Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Autonomous Loop v1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time state monitoring and APScheduler lifecycle management.
          </p>
        </div>
      </div>

      {/* Status Metric Cards */}
      <AgentStatusCard />

      {/* Control Buttons Panel */}
      <AgentControlPanel />

      {/* Real-time Streaming Terminal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Live Execution Stream & Trace
          </h3>
          <span className="text-xs text-slate-400">
            Polling <code className="text-indigo-300 font-mono">/api/agent/status</code>
          </span>
        </div>
        <LiveTerminalLog />
      </div>

      {/* Loop Engineering Technical Reference */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Loop Engineering Specifications (Architecture Reference)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              1. 09:00 AM Cron Trigger
            </div>
            <p>
              APScheduler registers an asynchronous cron job executing at 9:00 AM UTC every morning.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              2. Multi-Source Scraping
            </div>
            <p>
              JobSpy scrapes LinkedIn, Indeed, and Glassdoor simultaneously for listings posted within the last 24 hours.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              3. Batch Gemini 1.5 Flash Scoring
            </div>
            <p>
              Job descriptions are batched into structured JSON prompts for Gemini 1.5 Flash to evaluate match percentages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
