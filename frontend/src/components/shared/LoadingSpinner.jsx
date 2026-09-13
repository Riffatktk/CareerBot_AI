import React from "react";
import { motion } from "framer-motion";

export function LoadingSpinner({ size = 20, color = "var(--color-accent)" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
