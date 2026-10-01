// Single source of truth for portfolio content — mirrors public/proofs/Resume.pdf.

export const PROFILE = {
  name: "Raghav Tiwari",
  role: "Computer Science Student",
  base: "Noida, India",
  email: "raghav31.tiwari@gmail.com",
  github: "https://github.com/RaghavTiwari31",
  linkedin: "https://linkedin.com/in/raghav-tiwari-225b22326/",
  designPortfolio: "https://tinyurl.com/raghavtiwariportfolio",
  resume: "/proofs/Resume.pdf",
  summary:
    "B.Tech Computer Science student focused on building user-centric, AI-powered products and data-driven applications. Experienced in developing LLM-based workflows, RAG pipelines, backend APIs, and interactive visualization tools using Python, FastAPI, and PostgreSQL. Interested in applied AI research, intelligent systems, and scalable software engineering.",
};

export type SectionId =
  | "brief"
  | "skills"
  | "log"
  | "missions"
  | "awards"
  | "papers"
  | "training"
  | "comms";

export const SECTIONS: { id: SectionId; code: string; label: string; short: string }[] = [
  { id: "brief", code: "01", label: "Mission Brief", short: "About" },
  { id: "skills", code: "02", label: "Instrument Panel", short: "Skills" },
  { id: "log", code: "03", label: "Flight Log", short: "Experience" },
  { id: "missions", code: "04", label: "Mission Files", short: "Projects" },
  { id: "awards", code: "05", label: "Commendations", short: "Awards" },
  { id: "papers", code: "06", label: "Transmissions", short: "Papers" },
  { id: "training", code: "07", label: "Training", short: "Education" },
  { id: "comms", code: "08", label: "Open Comms", short: "Contact" },
];

export const STATS = [
  { value: 9.77, decimals: 2, label: "CGPA / 10" },
  { value: 2, decimals: 0, label: "Publications" },
  { value: 4, decimals: 0, label: "National hackathons" },
  { value: 2, decimals: 0, label: "Internships" },
];

export const SKILLS: { code: string; title: string; items: string[] }[] = [
  { code: "LNG", title: "Programming Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "C", "C++", "Java", "HTML", "CSS"] },
  { code: "FWK", title: "Frameworks & Libraries", items: ["FastAPI", "React", "Next.js", "NestJS", "Tailwind CSS", "Pydantic", "Pandas", "NumPy", "Scikit-learn", "Streamlit", "Dash", "Matplotlib", "Seaborn"] },
  { code: "AI", title: "Technologies & Concepts", items: ["LLM", "Generative AI", "Multi-Provider LLM Orchestration (OpenAI, Anthropic, Gemini)", "Document AI / OCR", "Structured LLM Extraction", "Retrieval-Augmented Generation (RAG)", "Prompt Engineering", "AI Agents", "Risk & Fraud Scoring", "Data Analytics", "A/B Testing"] },
  { code: "API", title: "Backend", items: ["REST APIs", "API Integration", "Webhooks", "Async Processing", "Task Queues (Celery, Redis)", "Web Security (CSRF, CORS, CSP, Cookies)", "CRM Integration (Zoho, Salesforce, MS Dynamics)", "JSON"] },
  { code: "DB", title: "Databases", items: ["PostgreSQL", "MySQL", "Redis", "SQLAlchemy", "Alembic", "Prisma", "VectorDB"] },
  { code: "CLD", title: "Cloud & DevOps", items: ["Docker", "Docker Compose", "Google Cloud Run", "Google Cloud Storage", "Vercel"] },
  { code: "TLS", title: "Tools", items: ["Git", "GitHub", "Pytest", "Jest", "Azure Document Intelligence", "AWS Textract", "Claude", "Jira", "MS Excel / Google Sheets"] },
  { code: "OPS", title: "Methodologies & Professional", items: ["Agile", "SDLC", "Research", "Analytical Thinking", "Product Roadmaps", "Market Research", "Competitor Analysis"] },
];

export const EXPERIENCE = [
  {
    role: "Product Research Intern",
    org: "EDMO (iSchoolConnect India Pvt. Ltd.)",
    place: "Noida, India",
    start: "Jul 2026",
    end: "Present",
    active: true,
    points: [
      "Built EDMO's AI Application Evaluator, an admissions platform scoring 15+ applicant document types against program policies; demoed to City Colleges of Chicago, Iowa State University and NU.",
      "Developed its pipeline with FastAPI, Celery, Redis and PostgreSQL, using Azure OCR and multi-provider LLMs (OpenAI, Anthropic, Gemini) with source-cited, audited decisions.",
      "Added pre-evaluation risk routing (ID verification, residency, source integrity), integrated with Zoho CRM and NestJS microservices.",
      "Embedded the Document Intelligence product in Microsoft Dynamics via CHIPS cookies and CSRF/CSP hardening; demoed to University of the People.",
      "Built and deployed DocTranslator, a layout-preserving AI translation platform, made stateless (PostgreSQL + GCS) to scale on Cloud Run.",
    ],
    tags: ["FastAPI", "Celery", "PostgreSQL", "LLM", "OCR", "Next.js", "NestJS", "Docker", "Cloud Run"],
  },
  {
    role: "Data Management Specialist Intern",
    org: "Gaurs Group",
    place: "Ghaziabad, India",
    start: "Jun 2025",
    end: "Jul 2025",
    active: false,
    points: [
      "Worked with Excel datasets to clean, organize, and validate data for improved accuracy and consistency.",
      "Used Python to automate repetitive data processing and reporting tasks, reducing manual effort.",
      "Performed data analysis to identify trends, anomalies, and data quality issues.",
      "Gained practical experience in data management, data analytics, automation, and reporting workflows.",
    ],
    tags: ["Python", "Excel", "Data Analysis", "Automation"],
  },
];

export const PROJECTS = [
  {
    id: "nirikshak",
    name: "Nirikshak",
    designation: "NRK-26",
    tag: "SIH 2026 · SAT-SA · SOC Analytics",
    date: "Sep 2026",
    stack: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Pandas", "Scikit-learn", "React 19", "TypeScript", "ECharts", "Docker"],
    live: "https://nirikshak-tau.vercel.app",
    github: "https://github.com/RaghavTiwari31/Nirikshak",
    color: "var(--c-teal)",
    points: [
      "Built SAT-SA, a Supervisory Analytics Tool for SOC Assessment, for the Smart India Hackathon 2026 NCIIPC problem statement, used to audit SOC alert and case-management submissions from Critical Sector Entities.",
      "Designed a configurable signal engine that detects execution gaps and “negative space” (what a SOC should have reported but didn't), then ranks entities and samples cases for manual review.",
      "Backed every finding with explainable, auditable evidence: reproducible analysis runs, a hash-chained tamper-evident audit log, and precision/recall validation against synthetic ground truth.",
      "Built a data-ingestion pipeline with a published data contract, automatic column mapping and validation for CSV/JSON/NDJSON submissions, plus a synthetic CSE generator with planted weaknesses.",
      "Shipped a fully offline, air-gapped Docker deployment with role-based access, pseudonymised analyst identities, strict CSP and login throttling, alongside a cloud demo on Vercel, Render and Neon.",
    ],
  },
  {
    id: "vajra",
    name: "Vajra",
    designation: "VJR-26",
    tag: "ECDAT · Post-Quantum Crypto Discovery",
    date: "Sep 2026",
    stack: ["Next.js 16", "TypeScript", "Neon Postgres", "Prisma", "GitHub Apps", "Webhooks", "CycloneDX", "Recharts"],
    live: "https://vajra-swart-ten.vercel.app",
    github: "https://github.com/RaghavTiwari31/Vajra",
    color: "var(--c-mustard)",
    points: [
      "Built an Enterprise Cryptographic Discovery & Analysis Tool (ECDAT) that finds every cryptographic asset in connected GitHub repositories, scanning on connect and on every push.",
      "Wrote a custom TypeScript discovery engine with rule packs for crypto call-sites, dependency manifests, certificates, keys, protocols and hard-coded secrets.",
      "Scored quantum risk for each asset (PQC safety, Mosca's theorem timelines) and recommended post-quantum migration paths.",
      "Integrated as a GitHub App with verified webhooks, a DB-backed job queue and Check Runs, and exported findings as a CycloneDX 1.6 CBOM (Cryptographic Bill of Materials).",
    ],
  },
  {
    id: "revguard",
    name: "RevGuard",
    designation: "RVG-26",
    tag: "Fintech AI · Smart Dunning",
    date: "Sep 2026",
    stack: ["FastAPI", "PostgreSQL", "SQLAlchemy (async)", "APScheduler", "Razorpay API", "Groq / Gemini", "Twilio", "React", "SSE"],
    github: "https://github.com/RaghavTiwari31/RevGuard",
    color: "var(--c-orange)",
    points: [
      "Built an autonomous revenue-recovery and smart-dunning engine that triages failed Razorpay payments, developed for the Razorpay AI Buildathon 2026 (Track 03).",
      "Designed a deterministic triage pipeline — O(1) error-code classifier, issuer-health radar, confidence gate and post-flight validator — keeping LLMs off the critical path for amounts, categories and retry decisions.",
      "Routed each failure to one of four recovery strategies (scheduled retries, Razorpay payment links, a promise-to-pay conversational flow, and a circuit breaker for disputes and fraud), with Groq/Gemini generating rationale and Hinglish outreach only.",
      "Added an epsilon-greedy bandit that learns the best outreach channel (SMS / WhatsApp / Voice), a durable DB-backed retry queue that survives cold starts, and policy-as-code guardrails for quiet hours, cooldowns and retry caps.",
      "Shipped a live SSE dashboard with a “do-nothing” shadow ledger that benchmarks recovery against naive cron retries, plus real Twilio WhatsApp sends with stop-keyword handling.",
    ],
  },
  {
    id: "application-evaluator",
    name: "Application Evaluator",
    designation: "APE-26",
    tag: "AI Admissions · EDMO",
    date: "Jul 2026 – Present",
    stack: ["FastAPI", "PostgreSQL", "Celery", "Redis", "React", "Azure Document Intelligence", "LLMs", "Docker"],
    live: "https://application-evaluator.goedmo.com/login",
    color: "var(--c-blue)",
    points: [
      "Built an AI-powered admissions platform at EDMO that reads applicant documents and evaluates applications against each program's criteria.",
      "Gives admissions teams an explainable recommendation for every applicant, backed by the evidence it found in the documents.",
      "Flags risky or incomplete applications for human review, keeping a person in the loop on every final decision.",
      "Integrates with the CRM so applications flow in automatically and results sync back.",
    ],
  },
  {
    id: "doctranslator",
    name: "DocTranslator",
    designation: "DTR-26",
    tag: "AI Document Translation · EDMO",
    date: "Jul 2026 – Present",
    stack: ["FastAPI", "PostgreSQL", "Docker", "OCR", "LLMs", "Google Cloud Run"],
    live: "https://doctranslator-556735368410.us-central1.run.app/login",
    color: "var(--c-phosphor)",
    points: [
      "Built and deployed an AI-powered document translation platform at EDMO.",
      "Translates documents while preserving their original layout and formatting.",
      "Shipped to production on Google Cloud Run in collaboration with the DevOps team.",
    ],
  },
  {
    id: "aquamind",
    name: "AquaMind",
    designation: "AQM-25",
    tag: "RAG · Oceanographic AI",
    date: "Jul 2025 – Oct 2025",
    stack: ["FastAPI", "PostgreSQL (pgvector)", "Google Gemini API", "Dash"],
    github: "https://github.com/RaghavTiwari31/AquaMind",
    color: "var(--c-teal)",
    points: [
      "Built a RAG-based platform for natural-language querying of multi-year ARGO oceanographic datasets, defining user stories for intuitive data retrieval.",
      "Developed FastAPI and PostgreSQL (pgvector) services for semantic search and retrieval.",
      "Integrated Google Gemini for SQL generation, result summarization, and contextual insights.",
      "Created interactive geospatial and analytical dashboards using Dash.",
    ],
  },
  {
    id: "forensiq",
    name: "Forensiq",
    designation: "FRQ-26",
    tag: "Winner at RIFT'26 · Graph Forensics",
    date: "Feb 2026",
    stack: ["Node.js", "Express", "React", "D3.js", "Graph Algorithms"],
    github: "https://github.com/RaghavTiwari31/Forensiq",
    color: "var(--c-red)",
    points: [
      "Built a graph-based financial fraud detection system that identifies suspicious transaction networks, focusing on optimizing investigator user journeys and workflows.",
      "Implemented graph algorithms to detect circular routing, smurfing, and layered shell structures.",
      "Developed scalable transaction-processing pipelines for fraud investigation workflows.",
      "Created interactive D3.js visualizations for exploring financial relationships and risk patterns, directly addressing user feedback and dashboard usability needs.",
    ],
  },
  {
    id: "karma",
    name: "KARMA",
    designation: "KRM-26",
    tag: "Multi-Agent Enterprise Ops",
    date: "2026",
    stack: ["React 18", "TypeScript", "Python", "FastAPI", "Google Gemini 2.0"],
    github: "https://github.com/RaghavTiwari31/Karma",
    color: "var(--c-mustard)",
    points: [
      "Designed a multi-agent AI system to autonomously eliminate enterprise waste by monitoring software utilization and vendor contracts in real time.",
      "Built a Ghost Approver agent that intercepts purchasing workflows and proposes Gemini-powered cost-saving alternatives.",
      "Developed proactive and forensic agents to prioritize expiring contracts, identify risks, and deconstruct past cost overruns.",
      "Implemented gamification that scores departments on cost accountability and savings.",
    ],
  },
  {
    id: "datasage",
    name: "Data Sage",
    designation: "DSG-25",
    tag: "Analytics Automation",
    date: "2025",
    stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Seaborn", "Streamlit"],
    github: "https://github.com/RaghavTiwari31/DataSage",
    color: "var(--c-blue)",
    points: [
      "Developed an end-to-end automation tool that cleans, validates, analyzes, and generates insights from Excel datasets.",
      "Automated duplicate removal, missing-value handling, and format standardization.",
      "Implemented rule-based validation and IQR-based numeric outlier detection.",
      "Integrated visual analytics, regression and clustering models, with a Streamlit GUI and styled HTML/PDF reports.",
    ],
  },
];

export const ACHIEVEMENTS = [
  {
    rank: "1ST",
    title: "IndustrySolve 2025",
    sub: "Ideathon & Productathon · IIIT Delhi",
    body: "Secured 1st place in both the Ideathon and Productathon rounds among 150+ teams, delivering a fully functional prototype that secured a ₹40,000 award.",
    proof: "/proofs/iiit delhi proof.jpeg",
    color: "var(--c-red)",
    year: "2025",
  },
  {
    rank: "1ST",
    title: "RIFT'26 — PW Institute of Innovation",
    sub: "1st in problem statement · 5th overall",
    body: "Secured 1st position in our problem statement and ranked 5th overall among participating teams in a 24-hour national-level hackathon.",
    proof: "/proofs/RIFT26-Certificate-Raghav-Tiwari.jpg",
    color: "var(--c-mustard)",
    year: "2026",
  },
  {
    rank: "4TH",
    title: "iQOO × Reskill Hackathon 2026",
    sub: "Special Honour · 80+ teams",
    body: "Secured 4th position (Special Honour) among 80+ teams in a national-level hackathon organized by iQOO and Reskill, earning a ₹10,000 cash prize.",
    proof: "",
    color: "var(--c-teal)",
    year: "2026",
  },
  {
    rank: "INV",
    title: "Vibecon — Emergent AI, IIT Delhi",
    sub: "Invite-only national hackathon",
    body: "Built and presented an AI-driven solution during an invite-only 24-hour national hackathon.",
    proof: "",
    color: "var(--c-blue)",
    year: "2026",
  },
];

export const PUBLICATIONS = [
  {
    venue: "Springer Proceedings in Energy",
    publisher: "Springer, Singapore",
    title: "GreenShield – A Natural Language Processing Based Approach to Prevent Greenwashing and Attain Decarbonization",
    authors: "Raghav T., Adithya V., Dr. Nidhi S., Dr. Mudita N.",
    year: "2025",
    desc: "Proposed an NLP-based framework for detecting corporate greenwashing in sustainability reports and advertisements.",
    doi: "10.1007/978-981-96-4492-6_6",
  },
  {
    venue: "Ethical Considerations in AI: Bias and Fairness in Generative Models",
    publisher: "Taylor & Francis",
    title: "How GenAI Is Replacing Humans: Myth or Real",
    authors: "Raghav T., Adithya V., Prachi S., Dr. Deepika B.",
    year: "2025",
    desc: "Explored the societal and ethical impact of Generative AI on automation, labor, bias, and fairness.",
    doi: "10.1201/9781003565703-3",
  },
];

export const EDUCATION = [
  {
    school: "Guru Gobind Singh Indraprastha University",
    program: "B.Tech · Computer Science",
    place: "New Delhi, India",
    period: "Aug 2023 – Aug 2027",
    score: "9.77",
    unit: "/ 10 CGPA",
  },
  {
    school: "Father Agnel School",
    program: "Class XII · CBSE",
    place: "Noida, India",
    period: "2022",
    score: "94",
    unit: "%",
  },
  {
    school: "Father Agnel School",
    program: "Class X · CBSE",
    place: "Noida, India",
    period: "2020",
    score: "95",
    unit: "%",
  },
];
