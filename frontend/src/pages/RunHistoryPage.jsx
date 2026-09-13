import React from "react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Calendar,
  Briefcase,
  CheckCircle,
  Timer,
  TrendingUp,
  History as HistoryIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAgent } from "@/hooks/useAgent";
import { formatDateTime, formatDuration } from "@/utils/formatters";

const SOURCE_COLORS = {
  LinkedIn: "var(--color-accent)",
  Indeed: "var(--color-amber)",
  Glassdoor: "var(--color-violet)",
};

const SOURCE_TEXT_CLASS = {
  LinkedIn: "text-accent",
  Indeed: "text-amber",
  Glassdoor: "text-violet",
};

const SCORE_BUCKETS = [
  { bucket: "90–100%", count: 3 },
  { bucket: "80–89%", count: 5 },
  { bucket: "70–79%", count: 2 },
  { bucket: "60–69%", count: 2 },
];

function LineTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs shadow-card">
      <p className="font-medium text-text">{label}</p>
      <p className="text-text-2">{payload[0].value} jobs found</p>
    </div>
  );
}

function SourceTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs shadow-card">
      <p className="mb-1 font-medium text-text">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className={SOURCE_TEXT_CLASS[entry.dataKey]}>
          {entry.dataKey}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function RunHistoryPage() {
  const { totalRuns, totalJobsFound, runHistory } = useAgent();

  const chronological = [...runHistory].sort((a, b) => a.run_number - b.run_number);
  const avgDuration =
    runHistory.length > 0
      ? Math.round(
          runHistory.reduce((sum, r) => sum + (r.duration_seconds || 0), 0) / runHistory.length
        )
      : 0;

  const trendData = chronological.map((run) => ({
    date: format(new Date(run.ran_at), "MMM d"),
    jobs: run.jobs_found,
  }));

  const sourceData = chronological.map((run) => ({
    run: `Run ${run.run_number}`,
    LinkedIn: run.sources?.LinkedIn ?? 0,
    Indeed: run.sources?.Indeed ?? 0,
    Glassdoor: run.sources?.Glassdoor ?? 0,
  }));

  const mostRecent = runHistory[0];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageWrapper title="Run History — CareerBot AI">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Run History</h1>
          <p className="mt-1 text-text-2">Complete log of all automated job scans</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Calendar} label="Total Scans" value={totalRuns} />
          <StatCard icon={Briefcase} label="Jobs Discovered" value={totalJobsFound} />
          <StatCard icon={CheckCircle} label="Success Rate" value="100%" accent />
          <StatCard icon={Timer} label="Avg Duration" value={formatDuration(avgDuration)} />
        </div>

        {runHistory.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No runs yet"
            description="Start the agent to begin scanning for jobs."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-card border border-border bg-surface p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-text-2" />
                  <h3 className="text-sm font-semibold text-text">Jobs Found Over Time</h3>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ left: -20 }}>
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "var(--color-text-3)", fontSize: 11 }}
                        axisLine={{ stroke: "var(--color-border)" }}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<LineTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="jobs"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        fill="url(#trendFill)"
                        dot={{ r: 4, fill: "var(--color-accent)" }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-card border border-border bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-text">Sources Per Run</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData} margin={{ left: -20 }}>
                      <XAxis
                        dataKey="run"
                        tick={{ fill: "var(--color-text-3)", fontSize: 11 }}
                        axisLine={{ stroke: "var(--color-border)" }}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<SourceTooltip />} cursor={{ fill: "var(--color-surface-2)" }} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, color: "var(--color-text-2)" }}
                        iconType="circle"
                        iconSize={8}
                      />
                      <Bar dataKey="LinkedIn" fill={SOURCE_COLORS.LinkedIn} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Indeed" fill={SOURCE_COLORS.Indeed} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Glassdoor" fill={SOURCE_COLORS.Glassdoor} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-surface-2">
                    <tr>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3">Run</th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3">Date &amp; Time</th>
                      <th className="hidden px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3 sm:table-cell">Duration</th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3">Jobs Found</th>
                      <th className="hidden px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3 sm:table-cell">Sources</th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3">Status</th>
                      <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-text-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runHistory.map((run, index) => (
                      <tr
                        key={run.run_number}
                        className={`transition-colors hover:bg-surface-2 ${
                          index % 2 === 0 ? "bg-surface" : "bg-surface-2"
                        }`}
                      >
                        <td className="px-5 py-3.5 font-semibold text-text">#{run.run_number}</td>
                        <td className="px-5 py-3.5 text-text-2">{formatDateTime(run.ran_at)}</td>
                        <td className="hidden px-5 py-3.5 text-text-2 sm:table-cell">
                          {formatDuration(run.duration_seconds)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent-text">
                            {run.jobs_found} jobs
                          </span>
                        </td>
                        <td className="hidden px-5 py-3.5 sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(run.sources || {}).map(([source, count]) => (
                              <span
                                key={source}
                                className={`rounded-[4px] border border-border px-1.5 py-0.5 text-[10px] ${SOURCE_TEXT_CLASS[source] || "text-text-2"}`}
                              >
                                {source}:{count}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={run.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            type="button"
                            className="flex h-7 items-center rounded-btn border border-border bg-surface px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2"
                          >
                            View Jobs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {mostRecent && (
              <div className="mt-6 rounded-card border border-border bg-surface p-6">
                <h3 className="text-base font-semibold text-text">
                  Run #{mostRecent.run_number} — Detailed Breakdown
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-btn border border-border bg-surface-2 p-4">
                    <p className="text-xs text-text-3">Jobs Scanned</p>
                    <p className="mt-1 text-xl font-bold text-text">{totalJobsFound}</p>
                  </div>
                  <div className="rounded-btn border border-border bg-surface-2 p-4">
                    <p className="text-xs text-text-3">New Matches</p>
                    <p className="mt-1 text-xl font-bold text-text">{mostRecent.jobs_found}</p>
                  </div>
                  <div className="rounded-btn border border-border bg-surface-2 p-4">
                    <p className="text-xs text-text-3">Avg Match Score</p>
                    <p className="mt-1 text-xl font-bold text-accent">84%</p>
                  </div>
                </div>

                <div className="mt-5 h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SCORE_BUCKETS} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="bucket"
                        width={70}
                        tick={{ fill: "var(--color-text-2)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) =>
                          active && payload?.length ? (
                            <div className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs shadow-card">
                              <p className="font-medium text-text">{label}</p>
                              <p className="text-text-2">{payload[0].value} jobs</p>
                            </div>
                          ) : null
                        }
                        cursor={{ fill: "var(--color-surface-2)" }}
                      />
                      <Bar dataKey="count" fill="var(--color-accent)" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-accent-light text-accent">
        <Icon size={16} />
      </span>
      <p className={`mt-3 text-[28px] font-bold leading-none ${accent ? "text-accent" : "text-text"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-text-3">{label}</p>
    </div>
  );
}
