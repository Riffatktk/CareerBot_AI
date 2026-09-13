import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageWrapper title="404 — CareerBot AI">
        <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-accent-light text-accent">
            <Compass size={28} />
          </span>
          <h1 className="text-[96px] font-bold leading-none tracking-[-4px] text-accent">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-text">Page not found</h2>
          <p className="mt-2 max-w-sm text-sm text-text-2">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/job-feed"
              className="flex h-11 items-center justify-center rounded-btn bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Go to Job Feed
            </Link>
            <Link
              to="/"
              className="flex h-11 items-center justify-center rounded-btn border border-border bg-surface px-6 text-sm font-semibold text-text transition-colors hover:bg-surface-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
