import { create } from 'zustand';
import { jobsApi } from '../api/jobsApi';
import { INITIAL_JOBS } from '../mock/mockData';
import toast from 'react-hot-toast';

export const useJobStore = create((set, get) => ({
  jobs: INITIAL_JOBS,
  selectedJob: null,
  isDetailModalOpen: false,
  isLoading: false,
  page: 1,
  limit: 20,
  totalPages: 1,
  totalCount: INITIAL_JOBS.length,
  
  // Filters
  searchQuery: '',
  workModeFilter: 'all', // 'all', 'remote', 'hybrid', 'onsite'
  minMatchScore: 80,
  sortBy: 'match_score', // 'match_score', 'date_posted'
  autoPollEnabled: true,

  // Saved & Applied state
  savedJobIds: ['job-001'],
  appliedJobIds: [],

  setSearchQuery: (q) => {
    set({ searchQuery: q, page: 1 });
    get().fetchJobs();
  },

  setWorkModeFilter: (mode) => {
    set({ workModeFilter: mode, page: 1 });
    get().fetchJobs();
  },

  setMinMatchScore: (score) => {
    set({ minMatchScore: score, page: 1 });
    get().fetchJobs();
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
    get().fetchJobs();
  },

  setAutoPoll: (enabled) => set({ autoPollEnabled: enabled }),

  setSelectedJob: (job) => set({ selectedJob: job, isDetailModalOpen: !!job }),
  closeDetailModal: () => set({ selectedJob: null, isDetailModalOpen: false }),

  toggleSaveJob: (jobId) => {
    const saved = get().savedJobIds;
    const isSaved = saved.includes(jobId);
    if (isSaved) {
      set({ savedJobIds: saved.filter(id => id !== jobId) });
      toast('Removed from saved bookmarks', { icon: '🔖' });
    } else {
      set({ savedJobIds: [...saved, jobId] });
      toast.success('Job saved to your bookmarks!');
    }
  },

  markAsApplied: (jobId, jobTitle) => {
    const applied = get().appliedJobIds;
    if (!applied.includes(jobId)) {
      set({ appliedJobIds: [...applied, jobId] });
      toast.success(`Application registered for "${jobTitle}"!`);
    }
  },

  fetchJobs: async (showLoader = false) => {
    if (showLoader) set({ isLoading: true });
    try {
      const { searchQuery, workModeFilter, minMatchScore, sortBy, page, limit } = get();
      const data = await jobsApi.getJobs({
        search: searchQuery,
        work_mode: workModeFilter,
        min_score: minMatchScore,
        sort: sortBy,
        page,
        limit
      });

      set({
        jobs: data.jobs || [],
        totalCount: data.total || data.jobs?.length || 0,
        totalPages: data.total_pages || 1,
        isLoading: false
      });
    } catch (err) {
      set({ isLoading: false });
      // In case of network error, preserve existing jobs
    }
  },

  // Append new mock job when agent runs
  addNewScrapedJob: (customTitle) => {
    const newJob = {
      id: `job-${Date.now()}`,
      title: customTitle || "Staff AI/ML Platform Engineer",
      company: "Cohere AI & Foundation Models",
      company_logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      description_summary: "Design ultra-low latency inference gateways for enterprise LLMs using Python and FastAPI. Optimize distributed vector similarity searches and coordinate model evaluation benchmarks.",
      salary_range: "$165,000 – $220,000/yr",
      work_mode: "Remote",
      location: "San Francisco / Remote",
      date_posted: "Just now (Fresh 24h listing)",
      match_score: 97,
      match_reason: "Near-perfect match: 97% alignment with Gemini prompt instructions, Python asynchronous architecture, and AI platform engineering capabilities.",
      apply_link: "https://www.linkedin.com/jobs/view/4099812731",
      source: "LinkedIn",
      skills_required: ["Python", "FastAPI", "LLM APIs", "Docker", "PostgreSQL"],
      skills_matched: ["Python", "FastAPI", "LLM APIs", "Docker", "PostgreSQL"],
      skills_missing: [],
      experience_level: "Senior / Staff (5+ yrs)",
      status: "new"
    };

    set((state) => ({
      jobs: [newJob, ...state.jobs],
      totalCount: state.totalCount + 1
    }));
  }
}));
