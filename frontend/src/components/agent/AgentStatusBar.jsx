import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, isTomorrow, isToday } from "date-fns";
import { Clock } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAgentStore } from "@/store/agentStore";
import { runAgentNow } from "@/api/client";
import { QUERY_KEYS } from "@/utils/constants";

function formatNextScan(isoString) {
  if (!isoString) return "Not scheduled";
  const date = new Date(isoString);
  const time = format(date, "hh:mm a");
  if (isToday(date)) return `Today ${time}`;
  if (isTomorrow(date)) return `Tomorrow ${time}`;
  return `${format(date, "MMM d")} ${time}`;
}

export function AgentStatusBar() {
  const queryClient = useQueryClient();
  const status = useAgentStore((s) => s.status);
  const nextRun = useAgentStore((s) => s.nextRun);
  const isRunningNow = useAgentStore((s) => s.isRunningNow);
  const setIsRunningNow = useAgentStore((s) => s.setIsRunningNow);
  const setStatus = useAgentStore((s) => s.setStatus);
  const incrementTotalJobsFound = useAgentStore((s) => s.incrementTotalJobsFound);
  const [error, setError] = useState(null);

  async function handleRunNow() {
    setError(null);
    setIsRunningNow(true);
    try {
      const data = await runAgentNow();
      setStatus(data.status);
      incrementTotalJobsFound(data.jobs_found_this_run || 0);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOBS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_STATUS] });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunningNow(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-btn bg-surface-2 px-4 py-2.5 text-sm">
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <span className="text-text-2">
          {status === "ACTIVE" ? "Agent is active" : status === "STOPPED" ? "Agent is stopped" : "Agent is idle"}
        </span>
      </div>

      <span className="text-border-2">|</span>

      <span className="flex items-center gap-1.5 text-text-2">
        <Clock size={14} className="text-text-3" />
        Next scan: {formatNextScan(nextRun)}
      </span>

      <span className="text-border-2">|</span>

      <button
        type="button"
        onClick={handleRunNow}
        disabled={isRunningNow || status === "STOPPED"}
        className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-accent px-3 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunningNow && <LoadingSpinner size={12} color="#ffffff" />}
        Run Now
      </button>

      {error && <p className="w-full text-xs text-red">{error}</p>}
    </div>
  );
}
