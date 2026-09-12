import React from 'react';
import { SAMPLE_RESUMES } from '../../mock/mockData';
import { useResumeStore } from '../../store/useResumeStore';
import { Sparkles } from 'lucide-react';

export const PresetResumeSelector = () => {
  const { resumeData, loadPreset, isUploading } = useResumeStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          Or Test with Demo Profiles (1-Click)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_RESUMES.map((preset) => {
          const isSelected = resumeData?.resume_id === preset.id || resumeData?.filename === preset.filename;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={isUploading}
              onClick={() => loadPreset(preset.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'dark:bg-indigo-950/50 bg-indigo-50/80 dark:border-indigo-500/80 border-indigo-400 shadow-md ring-1 ring-indigo-500/30'
                  : 'dark:bg-slate-900/40 bg-white dark:border-slate-800 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-8 h-8 dark:bg-indigo-500/20 bg-indigo-500/20 rotate-45 border-b border-l border-indigo-400/50" />
              )}
              
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${isSelected ? 'dark:text-indigo-300 text-indigo-700' : 'dark:text-slate-200 text-slate-800'}`}>
                  {preset.job_titles[0]}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-600 border dark:border-slate-700 border-slate-200">
                  {preset.experience_years}y Exp
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {preset.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded dark:bg-slate-800/80 bg-slate-100 dark:text-slate-300 text-slate-700 border dark:border-slate-700/60 border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
                {preset.skills.length > 3 && (
                  <span className="text-[10px] px-1 dark:text-slate-500 text-slate-400 font-mono">
                    +{preset.skills.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
