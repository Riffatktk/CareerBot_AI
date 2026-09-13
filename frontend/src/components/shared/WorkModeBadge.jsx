import React from "react";

const STYLES = {
  Remote: "bg-accent-light text-accent-text",
  Onsite: "bg-amber-light text-amber",
  Hybrid: "bg-violet-light text-violet",
};

export function WorkModeBadge({ mode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[10px] font-medium leading-none ${
        STYLES[mode] || "bg-surface-2 text-text-2"
      }`}
    >
      {mode}
    </span>
  );
}
