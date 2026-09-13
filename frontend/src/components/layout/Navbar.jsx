import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Bot,
  Crosshair,
  Upload,
  LayoutGrid,
  History,
  Clock,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAgentStore } from "@/store/agentStore";
import { runAgentNow } from "@/api/client";

const TABS = [
  { to: "/resume-profile", label: "Resume Profile", icon: Upload },
  { to: "/job-feed", label: "Job Feed", icon: LayoutGrid },
  { to: "/agent-control", label: "Agent Control", icon: Bot },
  { to: "/run-history", label: "Run History", icon: History },
];

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

function RunNowButton({ compact = false }) {
  const status = useAgentStore((s) => s.status);
  const isRunningNow = useAgentStore((s) => s.isRunningNow);
  const setIsRunningNow = useAgentStore((s) => s.setIsRunningNow);
  const setStatus = useAgentStore((s) => s.setStatus);
  const incrementTotalJobsFound = useAgentStore((s) => s.incrementTotalJobsFound);

  async function handleClick() {
    setIsRunningNow(true);
    try {
      const data = await runAgentNow();
      setStatus(data.status);
      incrementTotalJobsFound(data.jobs_found_this_run || 0);
    } catch (err) {
      // surfaced via the compact agent status strip / control page; navbar stays silent on failure
    } finally {
      setIsRunningNow(false);
    }
  }

  return (
    <motion.div
      animate={isRunningNow ? { scale: 1 } : { scale: [1, 1.03, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={isRunningNow || status === "STOPPED"}
        className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-[6px] bg-accent px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunningNow && <LoadingSpinner size={12} color="#ffffff" />}
        {compact ? "Run" : "Run Now"}
      </button>
    </motion.div>
  );
}

const STATUS_TEXT_COLOR = {
  ACTIVE: "text-accent",
  IDLE: "text-text-2",
  STOPPED: "text-red",
};

const STATUS_DOT_COLOR = {
  ACTIVE: "bg-accent",
  IDLE: "bg-text-3",
  STOPPED: "bg-red",
};

export function Navbar() {
  const now = useClock();
  const status = useAgentStore((s) => s.status);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-surface backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-border bg-surface-2">
              <Crosshair size={18} className="text-accent" />
            </span>
            <span className="whitespace-nowrap text-[16px] font-bold leading-none">
              <span className="text-text">CareerBot.</span>
              <span className="text-accent">AI</span>
            </span>
            <span className="hidden items-center whitespace-nowrap rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-semibold text-accent-text min-[400px]:inline-flex">
              24H AUTOPILOT
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface-2 p-1 md:flex">
            {TABS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-2 hover:bg-surface"
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1.5 lg:flex">
              <span className="relative inline-flex h-2 w-2">
                {status === "ACTIVE" && <span className="pulse-ring" />}
                <span
                  className={`relative inline-block h-2 w-2 rounded-full ${STATUS_DOT_COLOR[status] || STATUS_DOT_COLOR.IDLE}`}
                />
              </span>
              <span
                className={`text-[11px] font-semibold ${STATUS_TEXT_COLOR[status] || STATUS_TEXT_COLOR.IDLE}`}
              >
                {status}
              </span>
              <span className="text-border-2">|</span>
              <Clock size={12} className="text-text-3" />
              <span className="text-[11px] text-text-3">{format(now, "HH:mm")}</span>
            </div>

            <div className="hidden md:block">
              <RunNowButton />
            </div>
            <div className="md:hidden">
              <RunNowButton compact />
            </div>

            <ThemeToggle />

            <button
              type="button"
              aria-label="Settings"
              title="Settings"
              className="hidden h-[34px] w-[34px] shrink-0 items-center justify-center rounded-btn bg-surface-2 text-text-2 transition-colors hover:border hover:border-border-2 lg:inline-flex"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-surface md:hidden">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium ${
                isActive ? "text-accent" : "text-text-3"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
