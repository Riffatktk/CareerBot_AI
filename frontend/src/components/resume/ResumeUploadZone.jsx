import React from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { ResumePreviewCard } from "@/components/resume/ResumePreviewCard";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from "@/utils/constants";

export function ResumeUploadZone({ file, selectedDemo, onDrop, onReject, onRemove }) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        onReject(rejected);
      } else {
        onDrop(accepted);
      }
    },
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    noClick: true,
  });

  const hasSelection = Boolean(file || selectedDemo);

  return (
    <div>
      <motion.div
        {...getRootProps()}
        animate={
          isDragActive
            ? { scale: 1.01, borderColor: "var(--color-accent)" }
            : { scale: 1, borderColor: "var(--color-border-2)" }
        }
        transition={{ duration: 0.2 }}
        className={`flex w-full flex-col items-center justify-center rounded-card border-2 border-dashed p-10 text-center ${
          isDragActive ? "bg-accent-light" : ""
        }`}
      >
        <input {...getInputProps()} />

        <div className="relative">
          <span
            className={`flex h-[72px] w-[72px] items-center justify-center rounded-card ${
              isDragActive ? "bg-accent text-white" : "bg-accent-light text-accent"
            }`}
          >
            <motion.div
              animate={isDragActive ? { y: -4, color: "var(--color-accent)" } : { y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <UploadCloud size={48} />
            </motion.div>
          </span>
          {hasSelection && (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-accent">
              <CheckCircle2 size={20} />
            </span>
          )}
        </div>

        <p className="mt-4 text-base font-semibold text-text">
          Drag and drop your resume, or{" "}
          <button
            type="button"
            onClick={open}
            className="text-accent underline-offset-2 hover:underline"
          >
            browse files
          </button>
        </p>
        <p className="mt-1 text-xs text-text-3">
          Supports PDF or Word (.docx) documents up to {MAX_FILE_SIZE_MB}MB
        </p>
      </motion.div>

      {file && <ResumePreviewCard file={file} onRemove={onRemove} />}
    </div>
  );
}
