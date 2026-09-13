import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      role="alert"
      className="flex items-start gap-3 rounded-btn border border-red bg-red-light px-4 py-3 text-sm text-red"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded-sm p-0.5 text-red transition-opacity hover:opacity-70"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
}
