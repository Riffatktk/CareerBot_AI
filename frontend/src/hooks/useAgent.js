import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgentStatus } from "@/api/client";
import { useAgentStore } from "@/store/agentStore";
import { QUERY_KEYS, POLL_INTERVAL_MS } from "@/utils/constants";

export function useAgent() {
  const setAgentData = useAgentStore((s) => s.setAgentData);
  const agentId = useAgentStore((s) => s.agentId);
  const status = useAgentStore((s) => s.status);
  const lastRun = useAgentStore((s) => s.lastRun);
  const nextRun = useAgentStore((s) => s.nextRun);
  const totalJobsFound = useAgentStore((s) => s.totalJobsFound);
  const totalRuns = useAgentStore((s) => s.totalRuns);
  const uptime = useAgentStore((s) => s.uptime);
  const avgJobsPerRun = useAgentStore((s) => s.avgJobsPerRun);
  const runHistory = useAgentStore((s) => s.runHistory);

  const query = useQuery({
    queryKey: [QUERY_KEYS.AGENT_STATUS],
    queryFn: getAgentStatus,
    refetchInterval: POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (query.data) {
      setAgentData(query.data);
    }
  }, [query.data, setAgentData]);

  return {
    agentId,
    agentStatus: status,
    lastRun,
    nextRun,
    totalJobsFound,
    totalRuns,
    uptime,
    avgJobsPerRun,
    runHistory,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
