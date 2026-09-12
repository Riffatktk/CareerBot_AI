import apiClient, { isMockModeEnabled } from './axios';
import { INITIAL_RUN_LOGS } from '../mock/mockData';

export const agentApi = {
  // Start the autonomous agent loop (POST /api/agent/start)
  startAgent: async ({ resume_id, user_prompt }) => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        agent_id: `agent-loop-${Date.now()}`,
        status: "ACTIVE",
        next_run: "09:00 AM (Tomorrow)",
        message: "Autonomous loop started. Daily cron scheduled for 9:00 AM."
      };
    }

    const response = await apiClient.post('/api/agent/start', {
      resume_id,
      user_prompt,
    });
    return response.data;
  },

  // Stop the agent loop (POST /api/agent/stop)
  stopAgent: async ({ agent_id }) => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        agent_id: agent_id || 'agent-loop-001',
        status: "STOPPED",
        message: "Agent scheduler stopped. Autonomous loop paused."
      };
    }

    const response = await apiClient.post('/api/agent/stop', {
      agent_id,
    });
    return response.data;
  },

  // Pause the agent
  pauseAgent: async ({ agent_id }) => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        agent_id: agent_id || 'agent-loop-001',
        status: "PAUSED",
        message: "Agent execution paused temporarily."
      };
    }

    const response = await apiClient.post('/api/agent/pause', {
      agent_id,
    });
    return response.data;
  },

  // Get current agent state and next run time (GET /api/agent/status)
  getStatus: async () => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        status: "ACTIVE",
        last_run: "2026-09-12 09:00:00",
        next_run: "09:00 AM Daily",
        next_run_countdown_seconds: 35400, // Calculated dynamically in store
        total_jobs_found: 8,
        active_sources: ["LinkedIn", "Indeed", "Glassdoor"],
        gemini_model: "gemini-1.5-flash",
        scheduler_status: "CRON_REGISTERED"
      };
    }

    const response = await apiClient.get('/api/agent/status');
    return response.data;
  },

  // Run Now instant trigger for testing without waiting for 9:00 AM
  triggerRunNow: async ({ resume_id, user_prompt }) => {
    if (isMockModeEnabled()) {
      // Simulate real agent step pipeline
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        success: true,
        run_id: `run-${Date.now()}`,
        jobs_discovered: 8,
        jobs_scored: 8,
        top_match_score: 96,
        duration: "3.2s",
        message: "Scraped 24h fresh listings from LinkedIn & Indeed. Batch scored with Gemini 1.5 Flash."
      };
    }

    const response = await apiClient.post('/api/agent/run-now', {
      resume_id,
      user_prompt,
    });
    return response.data;
  },

  // Get run history logs
  getHistoryLogs: async () => {
    if (isMockModeEnabled()) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return INITIAL_RUN_LOGS;
    }

    const response = await apiClient.get('/api/agent/history');
    return response.data;
  }
};
