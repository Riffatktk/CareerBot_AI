import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      const data = error.response.data;
      if (data?.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      } else if (data?.message) {
        message = data.message;
      } else if (typeof data === "string" && data.trim()) {
        message = data;
      } else {
        message = `Request failed with status ${error.response.status}`;
      }
    } else if (error.request) {
      message =
        "Could not reach the CareerBot AI server. Is the backend running on http://localhost:8000?";
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post("/api/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function startAgent({ resumeId, prompt }) {
  const { data } = await apiClient.post("/api/agent/start", {
    resume_id: resumeId,
    prompt,
  });
  return data;
}

export async function stopAgent() {
  const { data } = await apiClient.post("/api/agent/stop");
  return data;
}

export async function runAgentNow() {
  const { data } = await apiClient.post("/api/agent/run-now");
  return data;
}

export async function getAgentStatus() {
  const { data } = await apiClient.get("/api/agent/status");
  return data;
}

export async function getJobs() {
  const { data } = await apiClient.get("/api/jobs");
  return data;
}

export async function getJobById(id) {
  const { data } = await apiClient.get(`/api/jobs/${id}`);
  return data;
}

export default apiClient;
