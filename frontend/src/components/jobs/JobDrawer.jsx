import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, DollarSign } from "lucide-react";
import { WorkModeBadge } from "@/components/shared/WorkModeBadge";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { useAgentStore } from "@/store/agentStore";
import { formatDateTime } from "@/utils/formatters";

export function JobDrawer({ job, onClose }) {
  const resumeKeywords = useAgentStore(
    (s) => s.resume?.parsed?.match_keywords || []
  );

  useEffect(() => {
    if (!job) return undefined;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [job, onClose]);

  return (
    <AnimatePresence>
      {job && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 dark:bg-black/70"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${job.title} details`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-surface sm:w-[480px]"
          >
            <div className="sticky top-0 border-b border-border bg-surface px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold leading-snug text-text">{job.title}</h2>
                  <p className="mt-1 text-sm text-text-2">{job.company}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close details"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-btn text-text-2 transition-colors hover:bg-surface-2 hover:text-text"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-3">
                <WorkModeBadge mode={job.work_mode} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <p className="mb-1.5 text-xs text-text-3">Work Mode</p>
                  <WorkModeBadge mode={job.work_mode} />
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-text-3">Location</p>
                  <p className="flex items-center gap-1.5 text-sm text-text">
                    {job.location ? (
                      <>
                        <MapPin size={14} className="text-text-3" />
                        {job.location}
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-text-3">Salary</p>
                  <p className="flex items-center gap-1.5 text-sm">
                    <DollarSign size={14} className="text-text-3" />
                    <SalaryDisplay min={job.salary_min} max={job.salary_max} />
                  </p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-text-3">Source</p>
                  <p className="text-sm text-text">{job.source}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs text-text-3">Posted</p>
                  <p className="text-sm text-text">{formatDateTime(job.posted_at)}</p>
                </div>
                <div className="col-span-2 flex flex-col items-center pt-2">
                  <p className="mb-2 text-xs text-text-3">Match Score</p>
                  <MatchScoreBadge score={job.match_score} size="lg" />
                </div>
              </div>

              <div className="mt-6 rounded-card border-l-[3px] border-accent bg-accent-light p-4">
                <div className="mb-2 flex items-center gap-2 text-accent">
                  <h3 className="text-sm font-semibold">Why You Match</h3>
                </div>
                <p className="text-sm leading-relaxed text-accent-text">{job.match_reason}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-text">About the Role</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  {job.description_summary}
                </p>
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
                >
                  View full description on {job.source}
                </a>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-text">Skills &amp; Keywords</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((tag) => {
                      const isMatch = resumeKeywords.some(
                        (k) => k.toLowerCase() === tag.toLowerCase()
                      );
                      return (
                        <span
                          key={tag}
                          className={`rounded-full border px-3 py-1 text-xs ${
                            isMatch
                              ? "border-accent bg-accent-light text-accent-text"
                              : "border-border bg-surface-2 text-text-2"
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-border bg-surface px-6 py-5">
              <button
                type="button"
                onClick={() => window.open(job.apply_url, "_blank", "noopener,noreferrer")}
                className="flex h-12 w-full items-center justify-center rounded-btn bg-accent text-base font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Apply Now — Opens {job.source}
              </button>
              <p className="mt-2 text-center text-xs text-text-3">
                Direct link to job listing
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
