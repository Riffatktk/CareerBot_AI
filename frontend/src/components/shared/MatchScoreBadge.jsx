import React from "react";
import { motion } from "framer-motion";
import { getMatchColor } from "@/utils/formatters";

const SIZES = {
  sm: { box: 40, stroke: 3.5, fontClass: "text-[0.6rem]" },
  lg: { box: 72, stroke: 5, fontClass: "text-[1.15rem]" },
};

export function MatchScoreBadge({ score, size = "sm" }) {
  const { box, stroke, fontClass } = SIZES[size] || SIZES.sm;
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = box / 2;
  const color = getMatchColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={box} height={box} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (score / 100) * circumference,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className={`absolute font-bold text-text ${fontClass}`}>
        {score}
      </span>
    </div>
  );
}
