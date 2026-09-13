import React from "react";
import { motion } from "framer-motion";

export function DemoProfileCard({ profile, isSelected, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(profile)}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      animate={{ scale: isSelected ? 1.02 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full flex-col items-start rounded-card border p-4 text-left transition-colors duration-150 hover:shadow-card ${
        isSelected
          ? "border-accent bg-accent-light"
          : "border-border bg-surface hover:border-border-2"
      }`}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <p className="text-sm font-semibold text-text">{profile.title}</p>
        <span className="shrink-0 rounded-btn border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-text-2">
          {profile.experience_years}y Exp
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.tags_display.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-text-2"
          >
            {tag}
          </span>
        ))}
        {profile.extra_count > 0 && (
          <span className="rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent-text">
            +{profile.extra_count}
          </span>
        )}
      </div>
    </motion.button>
  );
}
