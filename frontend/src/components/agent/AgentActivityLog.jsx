import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatDateTime, formatDuration } from "@/utils/formatters";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function AgentActivityLog({ runHistory = [] }) {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={16} className="text-text-2" />
        <h3 className="text-sm font-semibold text-text">Recent Activity</h3>
      </div>

      {runHistory.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-3">No activity yet</p>
      ) : (
        <motion.ul variants={container} initial="hidden" animate="show" className="flex flex-col">
          {runHistory.map((run, index) => {
            const isSuccess = run.status === "SUCCESS";
            const isLast = index === runHistory.length - 1;
            return (
              <motion.li key={run.run_number} variants={item} className="relative flex gap-4 pb-5 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden="true" />
                )}
                <span
                  className={`relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ${
                    isSuccess ? "bg-accent" : "bg-red"
                  }`}
                />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <div>
                    <p className="text-sm font-medium text-text">Run #{run.run_number}</p>
                    <p className="text-xs text-text-3">
                      {formatDateTime(run.ran_at)} · {formatDuration(run.duration_seconds)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent-text">
                      {run.jobs_found} jobs found
                    </span>
                    <span className={`text-xs font-medium ${isSuccess ? "text-accent" : "text-red"}`}>
                      {run.status}
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
