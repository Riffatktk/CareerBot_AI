import React from "react";

const CONFIG = {
  ACTIVE: { dot: "bg-accent", text: "text-accent", label: "Active", pulse: true },
  SUCCESS: { dot: "bg-accent", text: "text-accent", label: "Active", pulse: true },
  IDLE: { dot: "bg-text-3", text: "text-text-2", label: "Idle", pulse: false },
  STOPPED: { dot: "bg-red", text: "text-red", label: "Stopped", pulse: false },
  FAILED: { dot: "bg-red", text: "text-red", label: "Failed", pulse: false },
};

export function StatusBadge({ status, size = "md" }) {
  const config = CONFIG[status] || CONFIG.IDLE;
  const dotSize = size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${textSize} ${config.text}`}>
      <span className={`relative inline-flex ${dotSize}`}>
        {config.pulse && <span className="pulse-ring" />}
        <span className={`relative inline-block h-full w-full rounded-full ${config.dot}`} />
      </span>
      {config.label}
    </span>
  );
}
