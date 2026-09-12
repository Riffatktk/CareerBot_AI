import apiClient, { isMockModeEnabled } from './axios';
import { INITIAL_JOBS } from '../mock/mockData';

export const jobsApi = {
  // Get paginated and filtered jobs list (GET /api/jobs)
  getJobs: async (params = {}) => {
    const { page = 1, limit = 20, sort = 'match_score', work_mode, min_score, search } = params;

    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      let filtered = [...INITIAL_JOBS];

      // Filter by search query
      if (search && search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills_required.some(s => s.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q)
        );
      }

      // Filter by work mode
      if (work_mode && work_mode !== 'all') {
        filtered = filtered.filter(j => j.work_mode.toLowerCase() === work_mode.toLowerCase());
      }

      // Filter by minimum score
      if (min_score) {
        filtered = filtered.filter(j => j.match_score >= Number(min_score));
      }

      // Sort
      if (sort === 'match_score') {
        filtered.sort((a, b) => b.match_score - a.match_score);
      } else if (sort === 'date_posted') {
        filtered.sort((a, b) => a.id.localeCompare(b.id)); // Newer first
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const jobs = filtered.slice(startIndex, startIndex + limit);

      return {
        jobs,
        total,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(total / limit)
      };
    }

    const response = await apiClient.get('/api/jobs', { params });
    return response.data;
  },

  // Get single job detail by ID (GET /api/jobs/{id})
  getJobById: async (jobId) => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const job = INITIAL_JOBS.find(j => j.id === jobId) || INITIAL_JOBS[0];
      return job;
    }

    const response = await apiClient.get(`/api/jobs/${jobId}`);
    return response.data;
  }
};
