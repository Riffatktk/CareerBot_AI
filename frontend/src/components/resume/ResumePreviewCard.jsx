import React from "react";
import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { formatFileSize, truncateText } from "@/utils/formatters";

export function ResumePreviewCard({ file, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mt-4 flex items-center gap-3 rounded-full border border-border bg-surface-2 py-2 pl-3 pr-2"
    >
      <FileText size={16} className="shrink-0 text-accent" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text">
        {truncateText(file.name, 40)}
      </span>
      <span className="shrink-0 text-xs text-text-3">{formatFileSize(file.size)}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove file"
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-2 transition-colors hover:bg-surface hover:text-text"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
