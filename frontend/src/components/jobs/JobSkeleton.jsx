import React from "react";

export function JobSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-card border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 rounded-btn shimmer" />
          <div className="h-3 w-20 rounded shimmer" />
        </div>
        <div className="h-4 w-16 rounded shimmer" />
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="h-[18px] w-2/3 rounded shimmer" />
        <div className="h-5 w-14 rounded-full shimmer" />
      </div>

      <div className="mt-3 flex gap-2">
        <div className="h-4 w-16 rounded shimmer" />
        <div className="h-4 w-14 rounded shimmer" />
        <div className="h-4 w-12 rounded shimmer" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded shimmer" />
        <div className="h-3 w-5/6 rounded shimmer" />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
        <div className="h-10 w-10 rounded-full shimmer" />
        <div className="h-3 w-16 rounded shimmer" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-16 rounded-btn shimmer" />
          <div className="h-8 w-16 rounded-btn shimmer" />
        </div>
      </div>
    </div>
  );
}
