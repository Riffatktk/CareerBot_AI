import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  UploadCloud, 
  LayoutDashboard, 
  Cpu, 
  History, 
  Settings, 
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';
import { useResumeStore } from '../../store/useResumeStore';
import { useJobStore } from '../../store/useJobStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { ApiSettingsModal } from './ApiSettingsModal';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { agentStatus, nextRunTime, triggerRunNow, isLoadingAction } = useAgentStore();
  const { resumeData, userPrompt } = useResumeStore();
  const { addNewScrapedJob } = useJobStore();

  const handleQuickRunNow = async () => {
    navigate('/dashboard');
    await triggerRunNow(resumeData?.resume_id, userPrompt, () => {
      addNewScrapedJob(resumeData?.job_titles?.[0] ? `Senior ${resumeData.job_titles[0]}` : null);
    });
  };

  const navLinks = [
    { to: '/', label: 'Resume Profile', icon: UploadCloud },
    { to: '/dashboard', label: 'Job Feed', icon: LayoutDashboard },
    { to: '/agent', label: 'Agent Control', icon: Cpu },
    { to: '/history', label: 'Run History', icon: History },
  ];

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'RUNNING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PAUSED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 dark:bg-[#0B0F19]/80 bg-white/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition transform">
                <Bot className="w-6 h-6 text-white animate-pulse-slow" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight dark:text-slate-100 text-slate-900">
                    CareerBot<span className="text-cyan-500">.AI</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    24h Autopilot
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Autonomous Job Finding Loop
                </span>
              </div>
            </NavLink>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 dark:bg-slate-900/60 bg-slate-100 p-1 rounded-xl border dark:border-slate-800 border-slate-200">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 hover:bg-slate-200/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Status Pill & Actions */}
            <div className="flex items-center gap-2">
              {/* Status Pill */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusColor()}`}>
                <span className="relative flex h-2 w-2">
                  {agentStatus === 'ACTIVE' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    agentStatus === 'ACTIVE' ? 'bg-emerald-500' :
                    agentStatus === 'RUNNING' ? 'bg-cyan-500 animate-spin' :
                    agentStatus === 'PAUSED' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></span>
                </span>
                <span className="tracking-wide">{agentStatus}</span>
                <span className="text-slate-500 dark:text-slate-600">|</span>
                <span className="flex items-center gap-1 text-[11px] dark:text-slate-300 text-slate-600 font-mono">
                  <Clock className="w-3 h-3 text-indigo-400" />
                  {nextRunTime.split(' ')[0]}
                </span>
              </div>

              {/* Instant "Run Now" Button */}
              <button
                onClick={handleQuickRunNow}
                disabled={isLoadingAction}
                title="Trigger agent scraping and AI scoring immediately"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoadingAction ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                )}
                <span className="hidden sm:inline">Run Now</span>
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Settings / Backend modal trigger */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl dark:text-slate-400 text-slate-600 dark:hover:text-slate-200 hover:text-slate-900 dark:hover:bg-slate-800/80 hover:bg-slate-100 border dark:border-slate-800 border-slate-200 transition"
                title="API & Backend connection settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t dark:border-slate-800/60 border-slate-200 dark:bg-slate-950/80 bg-white/90 px-2 py-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[10px] font-medium transition ${
                    isActive ? 'text-indigo-500 font-bold' : 'dark:text-slate-400 text-slate-500'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </header>

      <ApiSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
