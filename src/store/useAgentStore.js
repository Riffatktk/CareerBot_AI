import { create } from 'zustand';
import { agentApi } from '../api/agentApi';
import { INITIAL_RUN_LOGS } from '../mock/mockData';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export const useAgentStore = create((set, get) => ({
  agentId: 'agent-loop-2026',
  agentStatus: 'ACTIVE', // 'ACTIVE' | 'STOPPED' | 'PAUSED' | 'RUNNING'
  lastRunTime: '2026-09-12 09:00:00',
  nextRunTime: '09:00 AM Daily',
  totalJobsFound: 8,
  averageMatchScore: 91,
  isLoadingAction: false,
  runHistory: INITIAL_RUN_LOGS,
  terminalLogs: [
    { timestamp: '09:00:00', text: 'Autonomous scheduler initialized (Cron: 09:00 daily).', level: 'info' },
    { timestamp: '09:00:01', text: 'Executing daily search for past 24-hour job listings...', level: 'info' },
    { timestamp: '09:00:02', text: 'LinkedIn & Indeed scrapers returned 28 fresh candidate listings.', level: 'success' },
    { timestamp: '09:00:03', text: 'Sending batched descriptions to Google Gemini 1.5 Flash API...', level: 'ai' },
    { timestamp: '09:00:04', text: 'Gemini evaluated match scores against extracted resume skills.', level: 'ai' },
    { timestamp: '09:00:05', text: 'Filtered 8 top matches (score >= 85%). Stored to SQLite database.', level: 'success' },
    { timestamp: '09:00:06', text: 'Agent loop sleeping until next 09:00 AM cycle.', level: 'idle' }
  ],

  addTerminalLog: (text, level = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    set((state) => ({
      terminalLogs: [...state.terminalLogs.slice(-40), { timestamp: timeStr, text, level }]
    }));
  },

  startAgent: async (resumeId, userPrompt) => {
    set({ isLoadingAction: true });
    get().addTerminalLog(`Starting agent for Resume: ${resumeId || 'default'}...`, 'info');
    try {
      const res = await agentApi.startAgent({ resume_id: resumeId, user_prompt: userPrompt });
      set({
        agentStatus: 'ACTIVE',
        agentId: res.agent_id || get().agentId,
        isLoadingAction: false
      });
      get().addTerminalLog('Agent state set to ACTIVE. Daily 9:00 AM cron scheduled.', 'success');
      toast.success('CareerBot AI agent started successfully!');
    } catch (err) {
      set({ isLoadingAction: false });
      toast.error('Failed to start agent.');
      get().addTerminalLog('Error starting agent: ' + err.message, 'error');
    }
  },

  stopAgent: async () => {
    set({ isLoadingAction: true });
    get().addTerminalLog('Sending STOP signal to agent scheduler...', 'warning');
    try {
      await agentApi.stopAgent({ agent_id: get().agentId });
      set({
        agentStatus: 'STOPPED',
        isLoadingAction: false
      });
      get().addTerminalLog('Agent STOPPED. Scheduled jobs cancelled.', 'warning');
      toast('Agent stopped. Autonomous loop paused.', { icon: '🛑' });
    } catch (err) {
      set({ isLoadingAction: false });
      toast.error('Failed to stop agent.');
    }
  },

  pauseAgent: async () => {
    set({ isLoadingAction: true });
    try {
      await agentApi.pauseAgent({ agent_id: get().agentId });
      set({
        agentStatus: 'PAUSED',
        isLoadingAction: false
      });
      get().addTerminalLog('Agent PAUSED temporarily.', 'warning');
      toast('Agent execution paused.', { icon: '⏸️' });
    } catch (err) {
      set({ isLoadingAction: false });
      toast.error('Failed to pause agent.');
    }
  },

  triggerRunNow: async (resumeId, userPrompt, onJobFoundCallback) => {
    if (get().agentStatus === 'RUNNING') return;

    set({ agentStatus: 'RUNNING', isLoadingAction: true });
    toast.loading('Running instant agent loop (Scraping + Gemini AI scoring)...', { id: 'run-now' });
    
    get().addTerminalLog('>>> [MANUAL TRIGGER] "Run Now" action activated by user.', 'info');

    // Simulate progressive step-by-step agent execution
    setTimeout(() => {
      get().addTerminalLog('Querying JobSpy scrapers (LinkedIn, Indeed, Glassdoor) for jobs posted in last 24h...', 'info');
    }, 400);

    setTimeout(() => {
      get().addTerminalLog('Aggregated 24 new raw listings. Parsing structured JD attributes...', 'info');
    }, 1100);

    setTimeout(() => {
      get().addTerminalLog('Invoking Google Gemini 1.5 Flash (Free Tier) with structured JSON evaluation prompt...', 'ai');
    }, 1700);

    try {
      const result = await agentApi.triggerRunNow({ resume_id: resumeId, user_prompt: userPrompt });
      
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

      const newLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        type: "SUCCESS",
        run_type: "MANUAL_RUN_NOW",
        jobs_scraped: 24,
        jobs_scored: 24,
        top_score: result.top_match_score || 96,
        duration: result.duration || "2.8s",
        details: result.message || "Manual Run Now executed. Discovered fresh 24h listings scored with Gemini AI."
      };

      set((state) => ({
        agentStatus: 'ACTIVE',
        isLoadingAction: false,
        lastRunTime: timeStr,
        totalJobsFound: state.totalJobsFound + 2,
        runHistory: [newLogEntry, ...state.runHistory],
      }));

      get().addTerminalLog(`Agent run completed in ${result.duration || '2.8s'}. Top match score: ${result.top_match_score || 96}%.`, 'success');
      toast.success('Agent run completed! Fresh jobs curated & ready.', { id: 'run-now' });

      // Trigger celebratory confetti for high match job found
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore if not supported
      }

      if (onJobFoundCallback) {
        onJobFoundCallback();
      }
    } catch (err) {
      set({ agentStatus: 'ACTIVE', isLoadingAction: false });
      toast.error('Agent run failed: ' + err.message, { id: 'run-now' });
      get().addTerminalLog('Agent run encountered an error: ' + err.message, 'error');
    }
  },

  fetchStatus: async () => {
    try {
      const statusData = await agentApi.getStatus();
      set({
        agentStatus: statusData.status || get().agentStatus,
        lastRunTime: statusData.last_run || get().lastRunTime,
        nextRunTime: statusData.next_run || get().nextRunTime,
        totalJobsFound: statusData.total_jobs_found || get().totalJobsFound,
      });
    } catch (e) {
      // Keep state if offline
    }
  }
}));
