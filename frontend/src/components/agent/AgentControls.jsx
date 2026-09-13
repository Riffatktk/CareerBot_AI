import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, CheckCircle2, RotateCcw } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { runAgentNow, stopAgent, startAgent } from "@/api/client";
import { useAgentStore } from "@/store/agentStore";
import { QUERY_KEYS } from "@/utils/constants";

export function AgentControls() {
  const queryClient = useQueryClient();
  const status = useAgentStore((s) => s.status);
  const resume = useAgentStore((s) => s.resume);
  const isRunningNow = useAgentStore((s) => s.isRunningNow);
  const isStopping = useAgentStore((s) => s.isStopping);
  const isStarting = useAgentStore((s) => s.isStarting);
  const setIsRunningNow = useAgentStore((s) => s.setIsRunningNow);
  const setIsStopping = useAgentStore((s) => s.setIsStopping);
  const setIsStarting = useAgentStore((s) => s.setIsStarting);
  const setStatus = useAgentStore((s) => s.setStatus);
  const setAgentData = useAgentStore((s) => s.setAgentData);
  const incrementTotalJobsFound = useAgentStore((s) => s.incrementTotalJobsFound);

  const [successMessage, setSuccessMessage] = useState(null);
  const [runError, setRunError] = useState(null);
  const [stopError, setStopError] = useState(null);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  async function handleRunNow() {
    setRunError(null);
    setSuccessMessage(null);
    setIsRunningNow(true);
    try {
      const data = await runAgentNow();
      setStatus(data.status);
      incrementTotalJobsFound(data.jobs_found_this_run || 0);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOBS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_STATUS] });
      setSuccessMessage(`Scan complete — ${data.jobs_found_this_run} new jobs found`);
    } catch (err) {
      setRunError(err.message);
    } finally {
      setIsRunningNow(false);
    }
  }

  async function handleStop() {
    setStopError(null);
    setIsStopping(true);
    try {
      const data = await stopAgent();
      setStatus(data.status);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_STATUS] });
    } catch (err) {
      setStopError(err.message);
    } finally {
      setIsStopping(false);
    }
  }

  async function handleRestart() {
    setStopError(null);
    setIsStarting(true);
    try {
      const data = await startAgent({
        resumeId: resume?.resume_id ?? null,
        prompt: "",
      });
      setAgentData(data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AGENT_STATUS] });
    } catch (err) {
      setStopError(err.message);
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div className="rounded-card border border-border bg-surface p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-accent-light text-accent">
          <Play size={22} />
        </span>
        <h3 className="mt-4 text-base font-semibold text-text">Trigger Immediate Scan</h3>
        <p className="mt-1 text-sm text-text-2">
          Bypass the schedule and run a job scan right now.
        </p>

        <button
          type="button"
          onClick={handleRunNow}
          disabled={isRunningNow}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-btn bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunningNow ? (
            <>
              <LoadingSpinner size={16} color="#ffffff" />
              Scanning... this may take up to 60 seconds
            </>
          ) : (
            "Run Now"
          )}
        </button>

        <AnimatePresence>
          {successMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 flex items-center gap-1.5 rounded-btn bg-accent-light px-3 py-2 text-xs font-medium text-accent-text"
            >
              <CheckCircle2 size={14} />
              {successMessage}
            </motion.p>
          )}
          {runError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-xs font-medium text-red"
            >
              {runError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-red-light text-red">
          <Square size={20} />
        </span>
        <h3 className="mt-4 text-base font-semibold text-text">Stop Autonomous Loop</h3>
        <p className="mt-1 text-sm text-text-2">
          The agent will stop running daily scans. You can restart it at any time.
        </p>

        {status === "STOPPED" ? (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-red">Agent is stopped</p>
            <button
              type="button"
              onClick={handleRestart}
              disabled={isStarting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-btn bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStarting ? (
                <LoadingSpinner size={16} color="#ffffff" />
              ) : (
                <RotateCcw size={16} />
              )}
              Restart Agent
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            disabled={isStopping}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-btn bg-red text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isStopping ? <LoadingSpinner size={16} color="#ffffff" /> : <Square size={16} />}
            Stop Agent
          </button>
        )}

        {stopError && <p className="mt-3 text-xs font-medium text-red">{stopError}</p>}
      </div>
    </div>
  );
}
