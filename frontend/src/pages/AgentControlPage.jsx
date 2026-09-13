import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Clock, Settings, BarChart2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AgentControls } from "@/components/agent/AgentControls";
import { AgentActivityLog } from "@/components/agent/AgentActivityLog";
import { useAgent } from "@/hooks/useAgent";
import { formatCountdown } from "@/utils/formatters";

const HOUR_MARKERS = Array.from({ length: 12 }, (_, i) => i * 2);

const SOURCES = [
  { key: "linkedin", label: "LinkedIn", note: "Primary source — ~6 jobs/scan" },
  { key: "indeed", label: "Indeed", note: "High volume — ~4 jobs/scan" },
  { key: "glassdoor", label: "Glassdoor", note: "With salary data — ~2 jobs/scan" },
];

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-accent" : "bg-surface-2 border border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs shadow-card">
      <p className="font-medium text-text">{label}</p>
      <p className="text-text-2">{payload[0].value} jobs</p>
    </div>
  );
}

export function AgentControlPage() {
  const { agentId, agentStatus, nextRun, totalJobsFound, totalRuns, uptime, avgJobsPerRun, runHistory } =
    useAgent();
  const [sources, setSources] = useState({ linkedin: true, indeed: true, glassdoor: true });
  const [, forceTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const chartData = [...runHistory]
    .sort((a, b) => a.run_number - b.run_number)
    .map((run) => ({ run: `Run ${run.run_number}`, jobs: run.jobs_found }));

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageWrapper title="Agent Control — CareerBot AI">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Agent Control</h1>
          <p className="mt-1 text-text-2">Autonomous Job Scanning Loop</p>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={agentStatus} size="lg" />
            <span className="font-mono text-xs text-text-3">{agentId || "agt_mock_001"}</span>
            <span className="text-xs text-text-3">Since {uptime} days ago</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-btn border border-border bg-surface-2 p-4">
              <p className="text-xs text-text-3">Total Jobs Found</p>
              <p className="mt-1 text-[32px] font-bold leading-none text-accent">{totalJobsFound}</p>
            </div>
            <div className="rounded-btn border border-border bg-surface-2 p-4">
              <p className="text-xs text-text-3">Total Scans Run</p>
              <p className="mt-1 text-[32px] font-bold leading-none text-text">{totalRuns}</p>
            </div>
            <div className="rounded-btn border border-border bg-surface-2 p-4">
              <p className="text-xs text-text-3">Avg Jobs / Scan</p>
              <p className="mt-1 text-[32px] font-bold leading-none text-text">{avgJobsPerRun}</p>
            </div>
            <div className="rounded-btn border border-border bg-surface-2 p-4">
              <p className="text-xs text-text-3">Uptime</p>
              <p className="mt-1 text-[32px] font-bold leading-none text-text">{uptime} days</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-card border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-2 text-accent">
            <Clock size={22} />
            <h3 className="text-base font-semibold text-text">Daily Schedule</h3>
          </div>
          <p className="mt-3 text-xl font-semibold text-text">Every day at 09:00 AM</p>
          <p className="mt-1 font-mono text-sm text-accent">
            Next scan in: {formatCountdown(nextRun)}
          </p>

          <div className="mt-6">
            <div className="relative h-8">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              <div className="relative flex justify-between">
                {HOUR_MARKERS.map((hour) => {
                  const isScan = hour === 8;
                  return (
                    <div key={hour} className="flex flex-col items-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isScan ? "bg-accent" : "bg-border-2"
                        }`}
                      />
                      {isScan && (
                        <span className="mt-1 whitespace-nowrap text-[10px] font-semibold text-accent">
                          Scan
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-text-3">
              <span>12AM</span>
              <span>11PM</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-3">Timezone: Auto-detected (UTC)</p>
        </div>

        <div className="mt-6">
          <AgentControls />
        </div>

        <div className="mt-6 rounded-card border border-border bg-surface p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Settings size={16} className="text-text-2" />
            <h3 className="text-sm font-semibold text-text">Job Sources</h3>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SOURCES.map((source) => (
              <div key={source.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-text">{source.label}</p>
                  <p className="text-xs text-text-3">{source.note}</p>
                </div>
                <Switch
                  checked={sources[source.key]}
                  onChange={() =>
                    setSources((prev) => ({ ...prev, [source.key]: !prev[source.key] }))
                  }
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs italic text-text-3">
            Source configuration will apply on next scan
          </p>
        </div>

        <div className="mt-6 rounded-card border border-border bg-surface p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-text-2" />
            <h3 className="text-sm font-semibold text-text">Jobs Found Per Scan</h3>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20 }}>
                <XAxis
                  dataKey="run"
                  tick={{ fill: "var(--color-text-3)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-surface-2)" }} />
                <Bar dataKey="jobs" fill="var(--color-accent)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-text-3">Average: {avgJobsPerRun} jobs per scan</p>
        </div>

        <div className="mt-6">
          <AgentActivityLog runHistory={runHistory} />
        </div>
      </PageWrapper>
    </div>
  );
}
