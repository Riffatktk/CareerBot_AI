import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Clock,
  Layers,
  FileUp,
  SlidersHorizontal,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ResumeUploadZone } from "@/components/resume/ResumeUploadZone";
import { DemoProfileCard } from "@/components/resume/DemoProfileCard";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useResumeUpload } from "@/hooks/useResumeUpload";
import { useCountUp } from "@/hooks/useCountUp";
import { DEMO_PROFILES, MAX_PROMPT_LENGTH } from "@/utils/constants";

const FEATURE_PILLS = [
  { icon: Cpu, label: "AI-Powered Matching" },
  { icon: Clock, label: "Daily 9 AM Scan" },
  { icon: Layers, label: "3 Job Platforms" },
];

const HOW_IT_WORKS = [
  {
    icon: FileUp,
    title: "Upload Your Resume",
    description:
      "Drop your PDF or DOCX resume. Gemini AI reads every line and extracts your skills, titles, and experience in seconds.",
  },
  {
    icon: SlidersHorizontal,
    title: "Set Your Preferences",
    description:
      "Tell the agent what roles you want, preferred locations, remote vs onsite, and salary expectations.",
  },
  {
    icon: Cpu,
    title: "Activate the Loop",
    description:
      "Press Start. The agent registers a daily 9 AM cron job and begins its first scan immediately.",
  },
  {
    icon: Inbox,
    title: "Receive Daily Job Lists",
    description:
      "Every morning, a fresh curated list of matched jobs appears on your dashboard — automatically.",
  },
];

const PLATFORMS = [
  { name: "LinkedIn", subtitle: "Professional Network", detail: "Largest source of tech jobs", volume: "1,200+ jobs/day" },
  { name: "Indeed", subtitle: "Job Aggregator", detail: "High volume of daily postings", volume: "2,400+ jobs/day" },
  { name: "Glassdoor", subtitle: "Reviews + Jobs", detail: "Salary transparency data", volume: "800+ jobs/day" },
];

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{
            display: "inline-block",
            marginLeft: "2px",
            width: "3px",
            height: "0.85em",
            background: "var(--color-accent)",
            verticalAlign: "middle",
            borderRadius: "1px",
          }}
        />
      )}
    </span>
  );
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

export function LandingPage() {
  const {
    file,
    selectedDemo,
    prompt,
    isUploading,
    isStarting,
    error,
    canSubmit,
    handleFileDrop,
    handleFileReject,
    handleDemoSelect,
    handleRemoveFile,
    handlePromptChange,
    handleSubmit,
    setError,
  } = useResumeUpload();

  const shouldReduceMotion = useReducedMotion();
  const isSubmitting = isUploading || isStarting;
  const scrollProgress = useScrollProgress();

  const { count: jobsCount, ref: jobsRef } = useCountUp(2847, 1400);
  const { count: accuracyCount, ref: accuracyRef } = useCountUp(94, 1000);
  const { count: timeCount, ref: timeRef } = useCountUp(4, 800);

  return (
    <div className="min-h-screen bg-bg" style={{ position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Blob 1 — top left, accent color */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "-120px",
            left: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            opacity: 0.07,
            filter: "blur(70px)",
          }}
        />

        {/* Blob 2 — top right, violet color */}
        <motion.div
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            position: "absolute",
            top: "-60px",
            right: "-100px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--color-violet) 0%, transparent 70%)",
            opacity: 0.06,
            filter: "blur(70px)",
          }}
        />

        {/* Blob 3 — bottom left, violet color */}
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-60px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--color-violet) 0%, transparent 70%)",
            opacity: 0.05,
            filter: "blur(60px)",
          }}
        />

        {/* Blob 4 — bottom right, accent color */}
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 25, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-80px",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
            opacity: 0.06,
            filter: "blur(65px)",
          }}
        />

        {/* Dot grid overlay */}
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 100%)",
            opacity: 0.35,
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            zIndex: 9999,
            background: "var(--color-surface-2)",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--color-accent), var(--color-violet))",
              width: `${scrollProgress}%`,
              transition: "width 0.08s linear",
            }}
          />
        </div>

        <Navbar />

        <PageWrapper title="CareerBot AI — Autonomous Job Hunter" className="lg:px-8">
          <section className="relative flex flex-col items-center text-center">
            <div className="relative z-[1] flex flex-col items-center">
              <motion.span
                initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0 }}
                className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-text-3"
              >
                <Sparkles size={12} className="text-accent" />
                Single-Prompt Autonomous Job Hunter
              </motion.span>

              <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-text sm:text-[52px]">
                <motion.span
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                  className="block"
                >
                  Upload Once.
                </motion.span>
                <motion.span
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="block text-accent"
                >
                  <TypewriterText text="Run on Autopilot." delay={0.8} />
                </motion.span>
              </h1>

              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
                className="mx-auto mt-5 max-w-[540px] text-base text-text-2"
              >
                Your resume, uploaded once. Relevant jobs delivered to your
                dashboard every morning — automatically.
              </motion.p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                {FEATURE_PILLS.map(({ icon: Icon, label }, index) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  >
                    <motion.span
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 + index * 0.08 }}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-text-2"
                    >
                      <Icon size={13} className="text-accent" />
                      {label}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mx-auto mt-10 w-full max-w-5xl"
            style={{ position: "relative", borderRadius: "16px", padding: "2px" }}
          >
            <motion.div
              aria-hidden="true"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, var(--color-accent), var(--color-violet), var(--color-accent))",
                backgroundSize: "200% 200%",
                opacity: 0.3,
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: "14px",
                background: "var(--color-surface)",
                padding: "32px",
              }}
            >
              <p className="mb-3 text-sm font-semibold text-text">1. Upload your resume</p>
              <ResumeUploadZone
                file={file}
                selectedDemo={selectedDemo}
                onDrop={handleFileDrop}
                onReject={handleFileReject}
                onRemove={handleRemoveFile}
              />

              <div className="mt-8">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">
                  <span className="h-px flex-1 bg-border" />
                  Or test with demo profiles (1-click)
                  <span className="h-px flex-1 bg-border" />
                </p>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  {DEMO_PROFILES.map((profile, index) => (
                    <motion.div
                      key={profile.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.9 + index * 0.1 }}
                    >
                      <DemoProfileCard
                        profile={profile}
                        isSelected={selectedDemo?.id === profile.id}
                        onSelect={handleDemoSelect}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 w-full">
                <label htmlFor="prompt" className="mb-3 block text-sm font-semibold text-text">
                  Describe your ideal role
                </label>
                <div className="relative w-full">
                  <textarea
                    id="prompt"
                    rows={4}
                    maxLength={MAX_PROMPT_LENGTH}
                    value={prompt}
                    onChange={(e) => handlePromptChange(e.target.value)}
                    placeholder="e.g. Find senior backend engineer roles, preferably remote. I am open to fintech or healthtech companies. Salary expectation: $120k+."
                    className="w-full rounded-btn border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <span className="pointer-events-none absolute bottom-2.5 right-3 text-xs text-text-3">
                    {prompt.length}/{MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size={18} color="#ffffff" />
                    Starting agent...
                  </>
                ) : (
                  "Start Agent — Find My Jobs"
                )}
              </button>

              {error && (
                <div className="mt-4">
                  <ErrorMessage message={error} onDismiss={() => setError(null)} />
                </div>
              )}

              <div className="mt-7 grid grid-cols-3 divide-x divide-border border-t border-border pt-6">
                <div ref={jobsRef} className="text-center">
                  <p className="text-lg font-bold text-text sm:text-xl">
                    {jobsCount.toLocaleString()}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-3">Jobs Found Today</p>
                </div>
                <div ref={accuracyRef} className="text-center">
                  <p className="text-lg font-bold text-text sm:text-xl">{accuracyCount}%</p>
                  <p className="mt-0.5 text-[11px] text-text-3">Match Accuracy</p>
                </div>
                <div ref={timeRef} className="text-center">
                  <p className="text-lg font-bold text-text sm:text-xl">{timeCount} min</p>
                  <p className="mt-0.5 text-[11px] text-text-3">Avg Setup Time</p>
                </div>
              </div>
            </div>
          </motion.div>

          <section className="mt-16">
            <h2 className="text-center text-2xl font-semibold text-text">
              How CareerBot AI Works
            </h2>
            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
              {HOW_IT_WORKS.map((step, index) => (
                <React.Fragment key={step.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
                    className="flex flex-1 flex-col items-center rounded-card border border-border bg-surface p-6 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.12 + 0.15 }}
                      className="flex h-12 w-12 items-center justify-center rounded-btn bg-accent-light text-accent"
                    >
                      <step.icon size={22} />
                    </motion.span>
                    <h3 className="mt-4 text-sm font-semibold text-text">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-text-2">
                      {step.description}
                    </p>
                  </motion.div>
                  {index < HOW_IT_WORKS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12 + 0.2, duration: 0.3 }}
                      className="hidden items-center justify-center text-text-3 md:flex"
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-center text-2xl font-semibold text-text">
              Searches Across All Major Platforms
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PLATFORMS.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.1 }}
                  whileHover="hovered"
                  style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}
                  className="border border-border bg-surface p-5 text-center"
                >
                  <motion.div
                    variants={{
                      hovered: {
                        x: ["-100%", "200%"],
                        transition: { duration: 0.55, ease: "easeInOut" },
                      },
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "50%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                      transform: "skewX(-12deg)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  <div
                    style={{ position: "relative", zIndex: 2 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-base font-bold text-text">{platform.name}</p>
                    <p className="mt-1 text-xs text-text-2">{platform.subtitle}</p>
                    <p className="mt-1 text-xs text-text-3">{platform.detail}</p>
                    <span className="mt-3 rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-medium text-accent-text">
                      {platform.volume}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </PageWrapper>
      </div>
    </div>
  );
}
