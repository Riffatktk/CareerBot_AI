import axios from 'axios';

// Get base URL from environment or localStorage override
const getApiBaseUrl = () => {
  return localStorage.getItem('careerbot_api_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

export const isMockModeEnabled = () => {
  const mode = localStorage.getItem('careerbot_use_mock');
  return mode === null ? true : mode === 'true'; // Default to true for seamless instant testing if backend isn't started
};

export const setMockMode = (enabled) => {
  localStorage.setItem('careerbot_use_mock', String(enabled));
};

export const setApiBaseUrl = (url) => {
  localStorage.setItem('careerbot_api_url', url);
  apiClient.defaults.baseURL = url;
};

// Create main Axios instance
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    // Attach session token or custom headers if available
    const sessionId = localStorage.getItem('careerbot_session_id') || 'demo-session-2026';
    config.headers['X-Session-ID'] = sessionId;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global 401/500 errors here
    return Promise.reject(error);
  }
);

export default apiClient;
