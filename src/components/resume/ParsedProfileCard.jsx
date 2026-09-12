import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Award, 
  GraduationCap, 
  Code2, 
  Play, 
  CheckCircle2, 
  Edit3,
  Bot,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAgentStore } from '../../store/useAgentStore';
import { useNavigate } from 'react-router-dom';

export const ParsedProfileCard = () => {
  const navigate = useNavigate();
  const { resumeData, userPrompt, setUserPrompt } = useResumeStore();
  const { startAgent, agentStatus, isLoadingAction } = useAgentStore();

  if (!resumeData) return null;

  const handleStartAgentFromProfile = async () => {
    await startAgent(resumeData.resume_id, userPrompt);
    navigate('/dashboard');
  };

  return (
    <div className="glass-card rounded-2xl p-6 dark:border-slate-800 border-slate-200 space-y-6 shadow-xl relative overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with extracted titles and experience */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b dark:border-slate-800 border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-lg dark:text-slate-100 text-slate-900">
              AI-Parsed Resume Profile
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
              Gemini 1.5 Flash Verified
            </span>
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-600">
            Parsed from <span className="dark:text-slate-200 text-slate-800 font-mono font-semibold">{resumeData.filename}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Experience badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700 border-slate-200">
            <Award className="w-4 h-4 text-cyan-500" />
            <div className="text-left">
              <div className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-wider font-semibold">Experience</div>
              <div className="text-xs font-bold dark:text-slate-200 text-slate-800">{resumeData.experience_years} Years Industry</div>
            </div>
          </div>

          {/* Education badge */}
          {resumeData.education && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700 border-slate-200">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <div className="text-left">
                <div className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-wider font-semibold">Education</div>
                <div className="text-xs font-bold dark:text-slate-200 text-slate-800 truncate max-w-[180px]">{resumeData.education}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Target Job Titles */}
      <div className="space-y-2">
        <label className="text-xs font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
          Extracted Target Job Titles
        </label>
        <div className="flex flex-wrap gap-2">
          {resumeData.job_titles.map((title, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/15 dark:text-indigo-300 text-indigo-700 border border-indigo-500/30 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              {title}
            </span>
          ))}
        </div>
      </div>

      {/* Skills Taxonomy */}
      <div className="space-y-3">
        <label className="text-xs font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-cyan-500" />
          Parsed Skills Taxonomy ({resumeData.skills.length} Extracted)
        </label>

        {resumeData.skills_by_category ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(resumeData.skills_by_category).map(([category, skillsList]) => (
              <div key={category} className="p-3.5 rounded-xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 space-y-2">
                <div className="text-[11px] font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[10px] font-mono dark:text-slate-500 text-slate-400">{skillsList.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2 py-0.5 rounded-md dark:bg-slate-800 bg-white dark:text-slate-200 text-slate-800 border dark:border-slate-700/80 border-slate-200 shadow-sm hover:border-indigo-500 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {resumeData.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-medium px-2.5 py-1 rounded-md dark:bg-slate-800 bg-white dark:text-slate-200 text-slate-800 border dark:border-slate-700 border-slate-200 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI Summary */}
      {resumeData.summary && (
        <div className="p-4 rounded-xl dark:bg-slate-900/70 bg-slate-50 border dark:border-slate-800 border-slate-200 text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
          <div className="text-[10px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-1 flex items-center gap-1">
            <Bot className="w-3 h-3 text-indigo-500" />
            Profile Summary
          </div>
          {resumeData.summary}
        </div>
      )}

      {/* User Prompt Configuration */}
      <div className="space-y-2 pt-2 border-t dark:border-slate-800 border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            Agent Search Prompt / Criteria Tuning
          </label>
          <span className="text-[10px] dark:text-slate-400 text-slate-500">
            Guides daily 9:00 AM scraping & scoring
          </span>
        </div>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. Find Senior Full-Stack and Backend Engineer roles (React + Python), remote or hybrid in US, offering $130,000+ per year."
          className="w-full px-4 py-3 text-xs dark:bg-slate-900/90 bg-white border dark:border-slate-700 border-slate-300 rounded-xl dark:text-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed font-sans shadow-inner"
        />
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs dark:text-slate-400 text-slate-600 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-cyan-500" />
          Autonomous agent will scrape daily at <span className="dark:text-slate-200 text-slate-900 font-bold">9:00 AM</span>
        </div>
        <button
          onClick={handleStartAgentFromProfile}
          disabled={isLoadingAction}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          {agentStatus === 'ACTIVE' ? 'Update & Restart Agent Loop' : 'Start Autonomous Agent'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
