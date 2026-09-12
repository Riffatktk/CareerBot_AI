import React from 'react';
import { Bot, Sparkles, Database, Layers, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0B0F19]/90 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">CareerBot AI</span>
            <span className="text-slate-500">— Autonomous 24h Job Finding Assistant</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Google Gemini 1.5 Flash
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              FastAPI + APScheduler (09:00 AM Cron)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              JobSpy (LinkedIn / Indeed)
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Hackathon 2026 Edition • Production Ready SPA
          </div>
        </div>
      </div>
    </footer>
  );
};
