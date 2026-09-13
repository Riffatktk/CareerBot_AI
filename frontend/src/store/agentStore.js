import { create } from "zustand";

const initialState = {
  agentId: null,
  status: "IDLE",
  lastRun: null,
  nextRun: null,
  totalJobsFound: 0,
  totalRuns: 0,
  uptime: 0,
  avgJobsPerRun: 0,
  runHistory: [],
  isStarting: false,
  isStopping: false,
  isRunningNow: false,
  resume: null,
};

export const useAgentStore = create((set) => ({
  ...initialState,

  setAgentData: (data) =>
    set({
      agentId: data.agent_id ?? data.agentId ?? null,
      status: data.status ?? "IDLE",
      lastRun: data.last_run ?? data.lastRun ?? null,
      nextRun: data.next_run ?? data.nextRun ?? null,
      totalJobsFound: data.total_jobs_found ?? data.totalJobsFound ?? 0,
      totalRuns: data.total_runs ?? data.totalRuns ?? 0,
      uptime: data.uptime_days ?? data.uptime ?? 0,
      avgJobsPerRun: data.avg_jobs_per_run ?? data.avgJobsPerRun ?? 0,
      runHistory: data.run_history ?? data.runHistory ?? [],
    }),

  setStatus: (status) => set({ status }),
  incrementTotalJobsFound: (amount) =>
    set((state) => ({ totalJobsFound: state.totalJobsFound + amount })),
  setIsStarting: (isStarting) => set({ isStarting }),
  setIsStopping: (isStopping) => set({ isStopping }),
  setIsRunningNow: (isRunningNow) => set({ isRunningNow }),
  setResume: (resume) => set({ resume }),

  reset: () => set({ ...initialState }),
}));
