import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Code,
  GraduationCap,
  FileX,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAgentStore } from "@/store/agentStore";

const DEMAND_SCORES = [96, 89, 83, 77, 70, 63];

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-btn border border-border bg-surface px-3 py-1.5 text-xs shadow-card">
      <p className="font-medium text-text">{label}</p>
      <p className="text-text-2">Demand: {payload[0].value}</p>
    </div>
  );
}

export function ResumeProfilePage() {
  const navigate = useNavigate();
  const resume = useAgentStore((s) => s.resume);
  const parsed = resume?.parsed;

  if (!parsed) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <PageWrapper title="Resume Profile — CareerBot AI">
          <EmptyState
            icon={FileX}
            title="No resume uploaded yet"
            description="Upload your resume on the home page to get started."
            action={
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex h-10 items-center rounded-btn bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Upload Resume
              </button>
            }
          />
        </PageWrapper>
      </div>
    );
  }

  const demandData = (parsed.skills || []).slice(0, 6).map((skill, i) => ({
    skill,
    demand: DEMAND_SCORES[i] ?? 60,
  }));

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageWrapper title="Resume Profile — CareerBot AI">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text">Resume Profile</h1>
            <p className="mt-1 text-sm text-text-2">Parsed by Gemini AI</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex h-9 shrink-0 items-center rounded-btn border border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-surface-2"
          >
            Re-upload Resume
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <div className="rounded-card border border-border bg-surface p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-light text-xl font-bold text-accent">
                    {getInitials(parsed.name)}
                  </span>
                  <div>
                    <h2 className="text-[22px] font-bold text-text">{parsed.name}</h2>
                    <p className="text-text-2">{parsed.job_titles?.[0]}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-2">
                        <MapPin size={12} className="text-text-3" />
                        {parsed.location}
                      </span>
                      <span className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-2">
                        <Mail size={12} className="text-text-3" />
                        {parsed.email}
                      </span>
                      <span className="flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-2">
                        <Phone size={12} className="text-text-3" />
                        {parsed.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-40">
                  <p className="mb-1.5 text-right text-xs text-text-3">87% Complete</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full w-[87%] rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface p-6">
              <div className="mb-5 flex items-center gap-2">
                <Briefcase size={16} className="text-text-2" />
                <h3 className="text-sm font-semibold text-text">Work Experience</h3>
              </div>
              <div className="flex flex-col">
                {(parsed.experience || []).map((exp, index) => {
                  const isLast = index === parsed.experience.length - 1;
                  const isRecent = index === 0;
                  return (
                    <div key={`${exp.company}-${exp.title}`} className="relative flex gap-4 pb-6 last:pb-0">
                      {!isLast && (
                        <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden="true" />
                      )}
                      <span className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full bg-accent" />
                      <div
                        className={`flex-1 ${
                          isRecent ? "border-l-2 border-accent pl-4" : "pl-4"
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <p className="text-sm font-semibold text-text">
                            {exp.company}{" "}
                            <span className="font-normal text-text-2">— {exp.title}</span>
                          </p>
                          <p className="text-xs text-text-3">{exp.duration}</p>
                        </div>
                        <p className="mt-1 text-[13px] text-text-2">{exp.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <Code size={16} className="text-text-2" />
                <h3 className="text-sm font-semibold text-text">Skills &amp; Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(parsed.skills || []).map((skill) => {
                  const isMatched = (parsed.match_keywords || []).includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        isMatched
                          ? "border-accent bg-accent-light text-accent-text"
                          : "border-border bg-surface-2 text-text-2"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <GraduationCap size={16} className="text-text-2" />
                <h3 className="text-sm font-semibold text-text">Education</h3>
              </div>
              <div className="rounded-btn border border-border bg-surface-2 p-4">
                <p className="text-sm font-medium text-text">{parsed.education}</p>
              </div>
            </div>

            <div className="rounded-card border border-border bg-surface p-6">
              <div className="mb-3 flex items-center gap-2 text-accent">
                <h3 className="text-sm font-semibold">AI-Generated Summary</h3>
              </div>
              <div className="rounded-card border-l-[3px] border-accent bg-accent-light p-4">
                <p className="text-sm leading-relaxed text-accent-text">{parsed.summary}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-card border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-text">Resume Keywords</h3>
              <p className="mt-1 text-xs text-text-3">Matched Against Job Market</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(parsed.match_keywords || []).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent-text"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-6 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandData} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      width={90}
                      tick={{ fill: "var(--color-text-2)", fontSize: 11 }}
                      axisLine={{ stroke: "var(--color-border)" }}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-surface-2)" }} />
                    <Bar dataKey="demand" fill="var(--color-accent)" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
