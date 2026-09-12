export const SAMPLE_RESUMES = [
  {
    id: "res-fullstack-001",
    name: "Alex Rivera — Senior Full-Stack Engineer",
    filename: "Alex_Rivera_Senior_FullStack_Resume.pdf",
    filesize: "418 KB",
    experience_years: 6,
    job_titles: [
      "Senior Full-Stack Developer",
      "Lead React & Python Engineer",
      "Software Architect"
    ],
    skills: [
      "Python", "FastAPI", "React.js", "TypeScript", "Node.js",
      "PostgreSQL", "Tailwind CSS", "Docker", "AWS", "GraphQL",
      "Redis", "Next.js", "CI/CD", "RESTful APIs", "Git"
    ],
    skills_by_category: {
      "Languages & Core": ["Python", "JavaScript", "TypeScript", "SQL"],
      "Frontend & UI": ["React.js", "Next.js", "Tailwind CSS", "Zustand", "HTML5/CSS3"],
      "Backend & APIs": ["FastAPI", "Node.js", "Express", "GraphQL", "REST APIs"],
      "Databases & Cloud": ["PostgreSQL", "Redis", "Docker", "AWS (ECS, S3, RDS)", "CI/CD"]
    },
    education: "B.S. in Computer Science — Univ. of Washington",
    summary: "Senior Full-Stack Engineer with 6+ years building scalable cloud platforms, modern React web applications, and high-performance Python/FastAPI microservices. Experienced in leading sprint deliverables and distributed systems architecture.",
    suggested_prompt: "Find Senior Full-Stack and Backend Engineer roles (React + Python/FastAPI), remote or hybrid in US/Canada, offering $130,000+ per year."
  },
  {
    id: "res-aiml-002",
    name: "Dr. Elena Rostova — AI/ML & LLM Engineer",
    filename: "Elena_Rostova_AI_ML_Engineer.pdf",
    filesize: "520 KB",
    experience_years: 5,
    job_titles: [
      "AI/ML Engineer",
      "LLM Application Developer",
      "Generative AI Specialist"
    ],
    skills: [
      "Python", "PyTorch", "Google Gemini API", "LangChain", "OpenAI API",
      "FastAPI", "Hugging Face", "Vector Databases (Pinecone/Milvus)", "RAG Systems",
      "Docker", "AWS SageMaker", "PostgreSQL", "Scikit-Learn", "MLflow"
    ],
    skills_by_category: {
      "AI & GenAI": ["Gemini 1.5 Flash", "LangChain", "RAG Systems", "Hugging Face", "Prompt Engineering"],
      "ML Frameworks": ["PyTorch", "TensorFlow", "Scikit-Learn", "MLflow", "Pandas", "NumPy"],
      "Backend & Data": ["Python", "FastAPI", "Vector DBs (Pinecone, Chroma)", "PostgreSQL"],
      "Cloud & MLOps": ["Docker", "AWS SageMaker", "GCP Vertex AI", "Kubernetes"]
    },
    education: "Ph.D. in Computer Science (Machine Learning) — Stanford University",
    summary: "AI/ML Engineer specializing in LLM application architecture, Retrieval-Augmented Generation (RAG), and model fine-tuning with 5 years of industry experience deploying generative AI microservices to production.",
    suggested_prompt: "Target Generative AI, LLM Application Engineer, and AI Agent Developer roles with focus on Gemini/OpenAI integration, fully remote, $150k+ salary."
  },
  {
    id: "res-devops-003",
    name: "Marcus Vance — Cloud & DevOps Architect",
    filename: "Marcus_Vance_Cloud_DevOps.docx",
    filesize: "340 KB",
    experience_years: 7,
    job_titles: [
      "Senior DevOps Engineer",
      "Site Reliability Engineer (SRE)",
      "Cloud Infrastructure Architect"
    ],
    skills: [
      "Kubernetes", "Terraform", "AWS", "Docker", "Python",
      "CI/CD (GitHub Actions, GitLab)", "Prometheus & Grafana", "Linux/Bash",
      "Helm", "ArgoCD", "PostgreSQL", "Ansible", "GCP"
    ],
    skills_by_category: {
      "Container & Orchestration": ["Kubernetes (EKS/GKE)", "Docker", "Helm", "ArgoCD"],
      "Infrastructure as Code": ["Terraform", "Ansible", "AWS CloudFormation", "Terragrunt"],
      "Cloud & Observability": ["AWS", "GCP", "Prometheus", "Grafana", "Datadog", "OpenTelemetry"],
      "Scripting & Tools": ["Python", "Bash", "Linux", "Git", "GitHub Actions"]
    },
    education: "B.S. in Software Engineering — Georgia Tech",
    summary: "Senior DevOps & Cloud Architect with 7+ years orchestrating highly available Kubernetes clusters, automated GitOps CI/CD pipelines, and multi-region AWS cloud infrastructure.",
    suggested_prompt: "Find Senior Cloud Architect and DevOps / SRE positions with Kubernetes and Terraform focus, remote or New York, $140,000+ base."
  }
];

export const INITIAL_JOBS = [
  {
    id: "job-001",
    title: "Senior Python & React Full Stack Engineer",
    company: "Google LLC (Cloud AI Platform)",
    company_logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=faces",
    description_summary: "Build high-throughput developer platforms for Google Cloud AI services. Collaborate with cross-functional AI research teams to integrate Gemini models into interactive React web consoles. Architect asynchronous FastAPI microservices and manage PostgreSQL data pipelines with automated CI/CD.",
    salary_range: "$145,000 – $185,000/yr",
    work_mode: "Remote",
    location: "San Francisco, CA (Remote eligible)",
    date_posted: "2 hours ago (Today)",
    match_score: 96,
    match_reason: "Exceptional alignment: Your 6+ years with FastAPI, React, and Docker directly matches their core stack. Gemini highlighted your strong asynchronous Python and scalable microservice experience as top differentiators.",
    apply_link: "https://www.linkedin.com/jobs/view/3991204851",
    source: "LinkedIn",
    skills_required: ["Python", "FastAPI", "React.js", "Docker", "PostgreSQL", "REST APIs"],
    skills_matched: ["Python", "FastAPI", "React.js", "Docker", "PostgreSQL", "REST APIs"],
    skills_missing: ["GCP Vertex AI"],
    experience_level: "Senior (5+ yrs)",
    status: "new"
  },
  {
    id: "job-002",
    title: "Lead Full Stack Developer (AI Products)",
    company: "Anthropic / AI Safety Labs",
    company_logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    description_summary: "Lead the frontend and API architecture for interactive AI safety evaluation tools. Drive component design with React 18, Tailwind CSS, and state management using modern patterns. Deploy containerized Python services handling real-time model evaluation streaming.",
    salary_range: "$160,000 – $210,000/yr",
    work_mode: "Hybrid",
    location: "San Francisco, CA, USA",
    date_posted: "4 hours ago (Today)",
    match_score: 94,
    match_reason: "High synergy: Your combination of React state management, Tailwind design systems, and robust Python API development matches 94% of criteria.",
    apply_link: "https://www.indeed.com/viewjob?jk=789b124a91",
    source: "Indeed",
    skills_required: ["React.js", "Python", "TypeScript", "Tailwind CSS", "Docker", "GraphQL"],
    skills_matched: ["React.js", "Python", "Tailwind CSS", "Docker", "TypeScript"],
    skills_missing: ["GraphQL Federation"],
    experience_level: "Lead / Staff (6+ yrs)",
    status: "new"
  },
  {
    id: "job-003",
    title: "Senior Backend Engineer (FastAPI & Cloud)",
    company: "Stripe",
    company_logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop",
    description_summary: "Design resilient payment orchestration APIs and asynchronous webhooks with Python and FastAPI. Optimize database query performance across sharded PostgreSQL and Redis caching layers. Implement strict distributed transaction safety and automated reliability testing.",
    salary_range: "$150,000 – $190,000/yr",
    work_mode: "Remote",
    location: "New York, NY, USA (Remote)",
    date_posted: "5 hours ago (Today)",
    match_score: 92,
    match_reason: "Strong fit on backend engineering: Matches your deep expertise in FastAPI, PostgreSQL indexing, and distributed Redis architectures.",
    apply_link: "https://www.linkedin.com/jobs/view/4019283719",
    source: "LinkedIn",
    skills_required: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Docker"],
    skills_matched: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Docker"],
    skills_missing: ["Distributed Transactions / Raft"],
    experience_level: "Senior (5+ yrs)",
    status: "new"
  },
  {
    id: "job-004",
    title: "AI Agent & Workflow Engineer",
    company: "Zapier Automations",
    company_logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop",
    description_summary: "Build autonomous agent pipelines connecting LLM models (Gemini, Claude, GPT) to thousands of app integrations. Formulate agent decision loops, multi-step tool calling, and structured JSON parsing. Optimize prompt engineering latency and system resilience.",
    salary_range: "$135,000 – $170,000/yr",
    work_mode: "Remote",
    location: "Remote (Global / US)",
    date_posted: "7 hours ago (Today)",
    match_score: 89,
    match_reason: "Direct fit for autonomous loop architecture: Your experience building automated agent loops and structured Gemini API parsing fits Zapier's new autonomous workforce team.",
    apply_link: "https://www.linkedin.com/jobs/view/4021948194",
    source: "LinkedIn",
    skills_required: ["Python", "LLM APIs", "FastAPI", "Prompt Engineering", "CI/CD"],
    skills_matched: ["Python", "FastAPI", "LLM APIs", "CI/CD"],
    skills_missing: ["LangGraph"],
    experience_level: "Mid-Senior (4+ yrs)",
    status: "new"
  },
  {
    id: "job-005",
    title: "Frontend Architect — React & Modern Web",
    company: "Figma",
    company_logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop",
    description_summary: "Develop ultra-responsive web collaboration tools with React, TypeScript, and WebGL rendering. Define design system primitives and reusable component libraries with Tailwind CSS. Champion web accessibility, micro-interactions, and sub-100ms UI latency.",
    salary_range: "$155,000 – $200,000/yr",
    work_mode: "Hybrid",
    location: "San Francisco, CA, USA",
    date_posted: "9 hours ago (Today)",
    match_score: 88,
    match_reason: "Strong frontend match: Your React component architecture and modern UI design system mastery aligns well with Figma's UI engineering requirements.",
    apply_link: "https://www.indeed.com/viewjob?jk=9023485710",
    source: "Indeed",
    skills_required: ["React.js", "TypeScript", "Tailwind CSS", "Design Systems", "Web Performance"],
    skills_matched: ["React.js", "TypeScript", "Tailwind CSS", "Design Systems"],
    skills_missing: ["WebGL / Canvas2D"],
    experience_level: "Senior (5+ yrs)",
    status: "new"
  },
  {
    id: "job-006",
    title: "Software Engineer — Cloud Platforms & API",
    company: "Datadog",
    company_logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop",
    description_summary: "Implement cloud telemetry collection microservices using Python and Go. Build real-time alerting dashboards and high-throughput RESTful endpoints. Ensure 99.99% uptime and zero-downtime blue/green deployments on containerized clusters.",
    salary_range: "$130,000 – $165,000/yr",
    work_mode: "Onsite",
    location: "New York, NY, USA",
    date_posted: "11 hours ago (Today)",
    match_score: 85,
    match_reason: "Solid cloud infrastructure and API match with your Python and Docker background.",
    apply_link: "https://www.glassdoor.com/job-listing/datadog-software-engineer",
    source: "Glassdoor",
    skills_required: ["Python", "Docker", "REST APIs", "PostgreSQL", "Observability"],
    skills_matched: ["Python", "Docker", "REST APIs", "PostgreSQL"],
    skills_missing: ["Go (Golang)"],
    experience_level: "Mid-Senior (3-6 yrs)",
    status: "new"
  },
  {
    id: "job-007",
    title: "Senior Full Stack Cloud Developer",
    company: "Shopify",
    company_logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
    description_summary: "Empower millions of merchant storefronts with cutting-edge React storefront builders and Python cloud services. Scale GraphQL queries and implement edge caching for sub-second page loads worldwide. Collaborate with merchant growth teams on automated merchandising agents.",
    salary_range: "$140,000 – $175,000/yr",
    work_mode: "Remote",
    location: "Remote (North America)",
    date_posted: "14 hours ago (Today)",
    match_score: 91,
    match_reason: "High match: 91% alignment with React, Python, PostgreSQL, and modern API ecosystem.",
    apply_link: "https://www.linkedin.com/jobs/view/4028374921",
    source: "LinkedIn",
    skills_required: ["React.js", "Python", "GraphQL", "PostgreSQL", "AWS"],
    skills_matched: ["React.js", "Python", "GraphQL", "PostgreSQL", "AWS"],
    skills_missing: ["Ruby on Rails"],
    experience_level: "Senior (5+ yrs)",
    status: "new"
  },
  {
    id: "job-008",
    title: "Python Backend & AI Microservices Engineer",
    company: "Scale AI",
    company_logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop",
    description_summary: "Develop robust data ingestion pipelines and microservices backing autonomous AI training workflows. Build asynchronous batch workers with FastAPI, Celery, and Redis. Monitor data quality metrics and optimize vector embeddings storage.",
    salary_range: "Not disclosed",
    work_mode: "Remote",
    location: "San Francisco, CA (Remote)",
    date_posted: "18 hours ago (Today)",
    match_score: 87,
    match_reason: "Great match for Python async backend, data pipelines, and Redis caching.",
    apply_link: "https://www.linkedin.com/jobs/view/4011298492",
    source: "LinkedIn",
    skills_required: ["Python", "FastAPI", "Redis", "Docker", "SQLAlchemy"],
    skills_matched: ["Python", "FastAPI", "Redis", "Docker"],
    skills_missing: ["Celery"],
    experience_level: "Senior (4+ yrs)",
    status: "new"
  }
];

export const INITIAL_RUN_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-09-12 09:00:02",
    type: "SUCCESS",
    run_type: "SCHEDULED_CRON",
    jobs_scraped: 28,
    jobs_scored: 28,
    top_score: 96,
    duration: "4.2s",
    details: "Automated 9:00 AM Cron triggered. Scraped LinkedIn and Indeed past 24h listings. Gemini 1.5 Flash batch-scored 28 candidate jobs. Top match: Google LLC (96%)."
  },
  {
    id: "log-102",
    timestamp: "2026-09-11 09:00:01",
    type: "SUCCESS",
    run_type: "SCHEDULED_CRON",
    jobs_scraped: 22,
    jobs_scored: 22,
    top_score: 94,
    duration: "3.8s",
    details: "Automated 9:00 AM Cron triggered. Scraped 22 new listings matching skills: Python, React, FastAPI. Gemini relevance threshold >80% applied."
  },
  {
    id: "log-103",
    timestamp: "2026-09-10 16:42:15",
    type: "SUCCESS",
    run_type: "MANUAL_RUN_NOW",
    jobs_scraped: 19,
    jobs_scored: 19,
    top_score: 92,
    duration: "3.1s",
    details: "Manual 'Run Now' triggered by user. Parsed fresh listings from JobSpy scraper aggregator. Stored 8 top matched jobs in SQLite DB."
  }
];
