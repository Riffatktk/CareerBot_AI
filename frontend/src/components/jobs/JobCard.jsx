import React from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign } from "lucide-react";
import { WorkModeBadge } from "@/components/shared/WorkModeBadge";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { SalaryDisplay } from "@/components/shared/SalaryDisplay";
import { formatRelativeTime } from "@/utils/formatters";

const VISIBLE_TAGS = 3;

export const JobCard = React.forwardRef(function JobCard(
  { job, index = 0, onViewDetails },
  ref
) {
  const showLocation = job.work_mode === "Onsite" || job.work_mode === "Hybrid";
  const visibleTags = (job.tags || []).slice(0, VISIBLE_TAGS);
  const extraTagCount = Math.max((job.tags || []).length - VISIBLE_TAGS, 0);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
      className="flex h-full flex-col rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-2 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-surface-2 text-sm font-semibold text-accent">
            {job.company.charAt(0)}
          </span>
          <span className="text-[13px] text-text-2">{job.company}</span>
        </div>
        <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-3">
          {job.source}
        </span>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-text">{job.title}</h3>
        <WorkModeBadge mode={job.work_mode} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-2">
        {showLocation && job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-text-3" />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <DollarSign size={12} className="text-text-3" />
          <SalaryDisplay min={job.salary_min} max={job.salary_max} />
        </span>
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-2"
          >
            {tag}
          </span>
        ))}
        {extraTagCount > 0 && (
          <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-3">
            +{extraTagCount} more
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-[13px] text-text-2">{job.description_summary}</p>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <MatchScoreBadge score={job.match_score} size="sm" />

        <span className="text-[11px] text-text-3">
          Posted {formatRelativeTime(job.posted_at)}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(job)}
            className="flex h-8 items-center rounded-btn border border-border bg-surface px-2.5 text-xs font-medium text-text transition-colors hover:bg-surface-2"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => window.open(job.apply_url, "_blank", "noopener,noreferrer")}
            className="flex h-8 items-center rounded-btn bg-accent px-2.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
});
