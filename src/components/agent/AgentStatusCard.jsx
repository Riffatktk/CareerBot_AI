import React, { useState, useEffect } from 'react';
import { Activity, Clock, Briefcase, Sparkles, Cpu } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';

export const AgentStatusCard = () => {
  const { agentStatus, lastRunTime, totalJobsFound } = useAgentStore();

  const [countdown, setCountdown] = useState('09h : 48m : 12s');

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(9, 0, 0, 0);
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = target - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdown(`${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Agent State */}
      <div className="glass-card rounded-2xl p-4 dark:border-slate-800 border-slate-200 relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Agent State</span>
          <div className="p-2 rounded-xl dark:bg-indigo-500/10 bg-indigo-50 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {agentStatus === 'ACTIVE' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              agentStatus === 'ACTIVE' ? 'bg-emerald-500' :
              agentStatus === 'RUNNING' ? 'bg-cyan-500' :
              agentStatus === 'PAUSED' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </span>
          <span className="text-xl font-extrabold dark:text-slate-100 text-slate-900 tracking-tight">
            {agentStatus}
          </span>
        </div>
        <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
          {agentStatus === 'ACTIVE' ? 'Autonomous loop active & listening' : 'Agent scheduler currently paused'}
        </p>
      </div>

      {/* Card 2: Next Scheduled 9:00 AM Run */}
      <div className="glass-card rounded-2xl p-4 dark:border-slate-800 border-slate-200 relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Next Cron (09:00 AM)</span>
          <div className="p-2 rounded-xl dark:bg-cyan-500/10 bg-cyan-50 text-cyan-600 dark:text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-lg font-mono font-bold dark:text-cyan-300 text-cyan-700">
          {agentStatus === 'ACTIVE' ? countdown : 'Paused (Idle)'}
        </div>
        <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
          {agentStatus === 'ACTIVE' ? 'Daily 24h fresh scraper wake-up' : 'Scheduler will not wake until started'}
        </p>
      </div>

      {/* Card 3: Total Jobs Discovered */}
      <div className="glass-card rounded-2xl p-4 dark:border-slate-800 border-slate-200 relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Jobs Discovered</span>
          <div className="p-2 rounded-xl dark:bg-emerald-500/10 bg-emerald-50 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-xl font-extrabold dark:text-slate-100 text-slate-900">
          {totalJobsFound} <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Past 24h</span>
        </div>
        <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
          Scraped from LinkedIn, Indeed, & Glassdoor
        </p>
      </div>

      {/* Card 4: Last Run & Model */}
      <div className="glass-card rounded-2xl p-4 dark:border-slate-800 border-slate-200 relative overflow-hidden transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">Last Run & AI</span>
          <div className="p-2 rounded-xl dark:bg-indigo-500/10 bg-indigo-50 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 text-sm font-bold dark:text-slate-200 text-slate-800">
          {lastRunTime ? lastRunTime.split(' ')[0] : 'Today'} <span className="dark:text-slate-400 text-slate-500 font-mono text-xs font-normal">{lastRunTime ? lastRunTime.split(' ')[1] : '09:00:00'}</span>
        </div>
        <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Gemini 1.5 Flash (Batch Scored)</span>
        </p>
      </div>
    </div>
  );
};
