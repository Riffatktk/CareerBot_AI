import { create } from 'zustand';
import { resumeApi } from '../api/resumeApi';
import { SAMPLE_RESUMES } from '../mock/mockData';
import toast from 'react-hot-toast';

export const useResumeStore = create((set, get) => ({
  resumeData: {
    resume_id: SAMPLE_RESUMES[0].id,
    filename: SAMPLE_RESUMES[0].filename,
    filesize: SAMPLE_RESUMES[0].filesize,
    skills: SAMPLE_RESUMES[0].skills,
    skills_by_category: SAMPLE_RESUMES[0].skills_by_category,
    job_titles: SAMPLE_RESUMES[0].job_titles,
    experience_years: SAMPLE_RESUMES[0].experience_years,
    education: SAMPLE_RESUMES[0].education,
    summary: SAMPLE_RESUMES[0].summary,
  },
  userPrompt: SAMPLE_RESUMES[0].suggested_prompt,
  isUploading: false,
  uploadError: null,

  setUserPrompt: (prompt) => set({ userPrompt: prompt }),

  uploadResume: async (file) => {
    set({ isUploading: true, uploadError: null });
    const toastId = toast.loading(`Parsing ${file.name} with Gemini AI...`);
    try {
      const data = await resumeApi.uploadResume(file);
      set({
        resumeData: {
          resume_id: data.resume_id,
          filename: data.filename,
          filesize: data.filesize,
          skills: data.skills,
          skills_by_category: data.skills_by_category || { "Extracted Skills": data.skills },
          job_titles: data.job_titles,
          experience_years: data.experience_years,
          education: data.education,
          summary: data.summary,
        },
        userPrompt: data.suggested_prompt || get().userPrompt,
        isUploading: false,
      });
      toast.success('Resume parsed successfully by Gemini AI!', { id: toastId });
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to upload and parse resume.';
      set({ uploadError: msg, isUploading: false });
      toast.error(msg, { id: toastId });
      throw err;
    }
  },

  loadPreset: async (presetId) => {
    set({ isUploading: true });
    const toastId = toast.loading('Loading preset candidate profile...');
    try {
      const data = await resumeApi.loadPreset(presetId);
      set({
        resumeData: {
          resume_id: data.resume_id,
          filename: data.filename,
          filesize: data.filesize,
          skills: data.skills,
          skills_by_category: data.skills_by_category,
          job_titles: data.job_titles,
          experience_years: data.experience_years,
          education: data.education,
          summary: data.summary,
        },
        userPrompt: data.suggested_prompt,
        isUploading: false,
      });
      toast.success(`Loaded profile for ${data.job_titles[0]}`, { id: toastId });
      return data;
    } catch (err) {
      set({ isUploading: false });
      toast.error('Failed to load preset profile', { id: toastId });
    }
  },

  clearResume: () => set({
    resumeData: null,
    userPrompt: '',
    uploadError: null,
  })
}));
