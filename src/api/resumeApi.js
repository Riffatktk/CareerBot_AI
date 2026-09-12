import apiClient, { isMockModeEnabled } from './axios';
import { SAMPLE_RESUMES } from '../mock/mockData';

export const resumeApi = {
  // Upload and parse resume file (POST /api/resume/upload)
  uploadResume: async (file) => {
    if (isMockModeEnabled()) {
      // Simulate Gemini 1.5 Flash parsing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));
      
      // Generate intelligent parsed data based on filename or random preset
      const preset = SAMPLE_RESUMES[0];
      return {
        success: true,
        resume_id: `res-${Date.now()}`,
        filename: file.name,
        filesize: `${(file.size / 1024).toFixed(1)} KB`,
        skills: preset.skills,
        skills_by_category: preset.skills_by_category,
        job_titles: preset.job_titles,
        experience_years: preset.experience_years,
        education: preset.education,
        summary: `Extracted from ${file.name}: ${preset.summary}`,
        suggested_prompt: preset.suggested_prompt
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Load a preset demo resume
  loadPreset: async (presetId) => {
    const preset = SAMPLE_RESUMES.find(r => r.id === presetId) || SAMPLE_RESUMES[0];
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      resume_id: preset.id,
      filename: preset.filename,
      filesize: preset.filesize,
      skills: preset.skills,
      skills_by_category: preset.skills_by_category,
      job_titles: preset.job_titles,
      experience_years: preset.experience_years,
      education: preset.education,
      summary: preset.summary,
      suggested_prompt: preset.suggested_prompt
    };
  }
};
