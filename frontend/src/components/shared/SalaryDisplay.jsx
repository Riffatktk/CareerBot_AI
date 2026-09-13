import React from "react";
import { formatSalary } from "@/utils/formatters";

export function SalaryDisplay({ min, max, className = "" }) {
  const formatted = formatSalary(min, max);
  const isDisclosed = min != null || max != null;

  return (
    <span className={`${isDisclosed ? "text-text" : "text-text-3"} ${className}`}>
      {formatted}
    </span>
  );
}
