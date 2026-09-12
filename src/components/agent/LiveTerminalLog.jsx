import React, { useRef, useEffect } from 'react';
import { Terminal, Sparkles, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';
import { useAgentStore } from '../../store/useAgentStore';

export const LiveTerminalLog = () => {
  const { terminalLogs, agentStatus } = useAgentStore();
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const getLogIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'success':
        return 'text-emerald-300';
      case 'ai':
        return 'text-cyan-300';
      case 'warning':
        return 'text-amber-300';
      case 'error':
        return 'text-rose-400';
      case 'idle':
        return 'text-slate-400';
      default:
        return 'text-slate-200';
    }
  };

  return (
    <div className="rounded-2xl border dark:border-slate-800 border-slate-700 shadow-xl overflow-hidden font-mono text-xs bg-[#090D16]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-300 text-[11px] font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            careerbot-agent-loop.log — Real-time Activity Trace
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">FastAPI & APScheduler Stream</span>
          <span className={`w-2 h-2 rounded-full ${agentStatus === 'ACTIVE' ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={logContainerRef}
        className="p-4 bg-[#090D16] max-h-72 min-h-[220px] overflow-y-auto space-y-2 select-text text-slate-200"
      >
        <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800/80 flex items-center justify-between">
          <span>// System: CareerBot Autonomous Loop Agent v1.0.0</span>
          <span>Target: Gemini 1.5 Flash + JobSpy</span>
        </div>

        {terminalLogs.map((log, index) => (
          <div key={index} className="flex items-start gap-2.5 py-0.5 leading-relaxed">
            <span className="text-slate-500 select-none text-[10px] font-mono shrink-0">
              [{log.timestamp}]
            </span>
            {getLogIcon(log.level)}
            <span className={getLogColor(log.level)}>
              {log.text}
            </span>
          </div>
        ))}

        {agentStatus === 'RUNNING' && (
          <div className="flex items-center gap-2 text-cyan-400 animate-pulse pt-2">
            <Zap className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>Agent loop currently processing... Scraping and scoring batch listings.</span>
          </div>
        )}
      </div>
    </div>
  );
};
