export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const QUERY_KEYS = {
  JOBS: "jobs",
  AGENT_STATUS: "agent-status",
};

export const WORK_MODES = [
  { value: "all", label: "All" },
  { value: "Remote", label: "Remote" },
  { value: "Onsite", label: "Onsite" },
  { value: "Hybrid", label: "Hybrid" },
];

export const SORT_OPTIONS = [
  { value: "match_score", label: "Best Match" },
  { value: "newest", label: "Newest First" },
  { value: "salary", label: "Salary High to Low" },
];

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

export const MAX_FILE_SIZE_MB = 10;

export const POLL_INTERVAL_MS = 30000;

export const MAX_PROMPT_LENGTH = 500;

export const DEMO_PROFILES = [
  {
    id: "demo_001",
    title: "Senior Full-Stack Developer",
    experience_years: 6,
    skills: [
      "Python",
      "FastAPI",
      "React.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Redis",
      "TypeScript",
      "GraphQL",
      "Kubernetes",
      "CI/CD",
      "Microservices",
    ],
    tags_display: ["Python", "FastAPI", "React.js"],
    extra_count: 12,
    default_prompt:
      "Find senior full-stack developer roles, preferably remote. I am open to fintech or healthtech companies. Salary expectation: $140k or above.",
  },
  {
    id: "demo_002",
    title: "AI/ML Engineer",
    experience_years: 5,
    skills: [
      "Python",
      "PyTorch",
      "Google Gemini API",
      "TensorFlow",
      "Scikit-learn",
      "MLflow",
      "Hugging Face",
      "LangChain",
      "FastAPI",
      "Docker",
      "AWS SageMaker",
      "Data Pipelines",
    ],
    tags_display: ["Python", "PyTorch", "Google Gemini API"],
    extra_count: 11,
    default_prompt:
      "Find AI/ML engineer roles working with LLMs and production ML pipelines. Remote or hybrid preferred. Salary expectation: $150k or above.",
  },
  {
    id: "demo_003",
    title: "Senior DevOps Engineer",
    experience_years: 7,
    skills: [
      "Kubernetes",
      "Terraform",
      "AWS",
      "Docker",
      "Helm",
      "ArgoCD",
      "Prometheus",
      "Grafana",
      "GitHub Actions",
      "Ansible",
    ],
    tags_display: ["Kubernetes", "Terraform", "AWS"],
    extra_count: 10,
    default_prompt:
      "Find senior DevOps or platform engineer roles focused on Kubernetes and cloud infrastructure. Remote preferred. Salary expectation: $150k or above.",
  },
];
