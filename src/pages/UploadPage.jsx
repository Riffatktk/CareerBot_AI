import React from 'react';
import { DropzoneUpload } from '../components/resume/DropzoneUpload';
import { ParsedProfileCard } from '../components/resume/ParsedProfileCard';
import { PresetResumeSelector } from '../components/resume/PresetResumeSelector';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, Bot, ShieldCheck, Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UploadPage = () => {
  const { resumeData } = useResumeStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Single-Prompt Autonomous Job Hunter
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
          Upload Once. <span className="neon-text-gradient">Run on Autopilot.</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          CareerBot AI uses <span className="text-slate-200 font-semibold">Google Gemini 1.5 Flash</span> to parse your resume, then wakes up every morning at <span className="text-cyan-300 font-semibold font-mono">09:00 AM</span> to scrape 24-hour-fresh listings from LinkedIn & Indeed matched to your skills.
        </p>
      </div>

      {/* Upload Zone & Presets Grid */}
      <div className="space-y-6">
        <DropzoneUpload />
        <PresetResumeSelector />
      </div>

      {/* Extracted Structured Data Profile */}
      {resumeData && (
        <div className="space-y-3 pt-4">
          <ParsedProfileCard />
        </div>
      )}

      {/* Architecture Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wide">
            <Bot className="w-4 h-4 text-indigo-400" />
            1. Resume AI Extraction
          </div>
          <p className="text-xs text-slate-400">
            PDF/DOCX sent to backend. Gemini 1.5 Flash extracts skills, years of experience, and target titles into structured JSON.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-cyan-400" />
            2. Autonomous Loop (9 AM)
          </div>
          <p className="text-xs text-slate-400">
            APScheduler executes daily 9:00 AM cron, querying LinkedIn and Indeed for jobs posted in the past 24 hours.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wide">
            <Zap className="w-4 h-4 text-emerald-400" />
            3. AI Relevance Scoring
          </div>
          <p className="text-xs text-slate-400">
            Gemini scores candidate jobs, synthesizes 3-line summaries, and curates high-match postings directly to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
