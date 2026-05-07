import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, MapPin, ExternalLink, Trophy, GraduationCap, Award, BookOpen, Briefcase, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Raghav Tiwari — Software Engineering Student" },
      { name: "description", content: "Portfolio of Raghav Tiwari — building AI-powered systems, RAG pipelines and data-driven applications." },
    ],
  }),
});

const EMAIL = "raghav31.tiwari@gmail.com";
const GITHUB = "https://github.com/RaghavTiwari31";
const LINKEDIN = "https://linkedin.com/in/raghav-tiwari-225b22326/";

const NAV = [
  { id: "summary", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "publications", label: "Publications" },
  { id: "education", label: "Education" },
];

const SKILLS: { title: string; items: string[]; accent: string }[] = [
  { title: "Programming Languages", items: ["Python", "C", "C++", "SQL", "JavaScript"], accent: "cyan" },
  { title: "Frameworks & Libraries", items: ["Streamlit", "Dash", "FastAPI"], accent: "violet" },
  { title: "Technologies & Concepts", items: ["Prompt Engineering", "RAG", "LLM Pipelines", "Data Ingestion", "Structured Outputs", "Few-shot Design"], accent: "emerald" },
  { title: "Databases & ORMs", items: ["PostgreSQL", "MySQL", "VectorDB"], accent: "cyan" },
  { title: "Tools", items: ["VS Code", "IntelliJ IDEA", "Microsoft Office Suite"], accent: "violet" },
  { title: "Methodologies & Professional Skills", items: ["Agile", "SDLC", "Research", "Remote Collaboration", "Effective Communication", "Creative Problem Solving", "Trend Awareness"], accent: "emerald" },
  { title: "Design & Visual Communication", items: ["Graphic Design", "Colour Theory", "Typography", "Layout Composition", "Branding", "Canva", "Photoshop"], accent: "cyan" },
];

const accentMap: Record<string, string> = {
  cyan: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 hover:shadow-[0_0_20px_var(--neon-cyan)]/40 hover:border-[var(--neon-cyan)]/60",
  violet: "text-[var(--neon-violet)] border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)]/60",
  emerald: "text-[var(--neon-emerald)] border-[var(--neon-emerald)]/30 hover:border-[var(--neon-emerald)]/60",
};

const ACHIEVEMENTS = [
  {
    title: "1st Place – IndustrySolve 2025",
    sub: "Ideathon & Productathon, IIIT Delhi",
    body: "Won both rounds out of 150+ teams, advancing to the top 20 finalist Productathon. Led end-to-end design and development of the solution, delivering a fully functional prototype that secured a ₹40,000 award.",
    accent: "cyan",
  },
  {
    title: "Rift26 — Physics Wallah Institute of Innovation",
    sub: "1st in problem statement · 5th overall",
    body: "Secured 1st position in our problem statement and ranked 5th overall among participating teams in a 24-hour national-level hackathon.",
    accent: "violet",
  },
  {
    title: "Vibecon — Emergent AI at IIT Delhi",
    sub: "Invite-only national hackathon",
    body: "Selected to participate in an exclusive, invite-only 24-hour national hackathon, collaborating with top student innovators to build and present a high-impact AI-driven solution under tight deadlines.",
    accent: "emerald",
  },
];

function Portfolio() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AnimatedBackground />
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <Hero />
        <Summary />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Publications />
        <Education />
        <Certifications />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 w-[min(960px,95vw)]"
    >
      <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5">
        <a href="#top" className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-[var(--neon-cyan)] animate-pulse-glow shadow-[0_0_12px_var(--neon-cyan)]" />
          RT
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground hover:bg-white/5">
              {n.label}
            </a>
          ))}
        </nav>
        <a href={`mailto:${EMAIL}`} className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition hover:scale-105">
          Contact
        </a>
      </div>
    </motion.header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center pt-24">
      <Reveal>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          NOIDA, India · Available for opportunities
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Raghav <span className="text-accent">Tiwari</span>
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Software Engineering Student — building AI-powered systems, RAG pipelines and data-driven applications.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mt-10 flex flex-wrap gap-3">
          <HeroLink href={GITHUB} icon={<Github className="h-4 w-4" />} label="Github" accent="cyan" />
          <HeroLink href={LINKEDIN} icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" accent="violet" />
          <HeroLink href={`mailto:${EMAIL}`} icon={<Mail className="h-4 w-4" />} label="Email" accent="emerald" />
        </div>
      </Reveal>
    </section>
  );
}

function HeroLink({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent: string }) {
  const glowMap: Record<string, string> = {
    cyan: "hover:shadow-[0_0_30px_oklch(0.85_0.18_200/0.5)] hover:border-[var(--neon-cyan)]",
    violet: "hover:shadow-[0_0_30px_oklch(0.7_0.25_295/0.5)] hover:border-[var(--neon-violet)]",
    emerald: "hover:shadow-[0_0_30px_oklch(0.78_0.2_160/0.5)] hover:border-[var(--neon-emerald)]",
  };
  return (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`glass group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${glowMap[accent]}`}
    >
      {icon}
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

function SectionHeading({ kicker, title, id }: { kicker: string; title: string; id: string }) {
  return (
    <Reveal>
      <div id={id} className="mb-10 scroll-mt-28">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--neon-cyan)]">{kicker}</div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      </div>
    </Reveal>
  );
}

function Summary() {
  return (
    <section className="mt-32">
      <SectionHeading id="summary" kicker="01" title="PROFESSIONAL SUMMARY" />
      <Reveal>
        <div className="glass rounded-2xl p-8 md:p-10">
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            B.Tech Computer Science student specializing in building{" "}
            <span className="text-[var(--neon-cyan)] font-medium">AI-powered systems</span> and{" "}
            <span className="text-[var(--neon-violet)] font-medium">data-driven applications</span>. Experienced in developing
            RAG pipelines, backend APIs, and automation workflows using Python, FastAPI, and PostgreSQL. Strong focus on{" "}
            <span className="text-[var(--neon-emerald)] font-medium">LLM-based systems, prompt engineering, and scalable AI pipelines</span>,
            with applied research experience and strong design thinking for building intuitive, user-centric solutions.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Skills() {
  return (
    <section className="mt-32">
      <SectionHeading id="skills" kicker="02" title="TECHNICAL & CREATIVE SKILLS" />
      <div className="grid gap-5 md:grid-cols-2">
        {SKILLS.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.05}>
            <motion.div whileHover={{ y: -4 }} className="glass group h-full rounded-2xl p-6 transition-all hover:border-white/20">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((s) => (
                  <span key={s} className={`rounded-full border bg-white/[0.02] px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 ${accentMap[cat.accent]}`}>
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="mt-32">
      <SectionHeading id="experience" kicker="03" title="PROFESSIONAL EXPERIENCE" />
      <Reveal>
        <div className="relative pl-8 md:pl-10">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-white/15" />
          <div className="absolute left-[-5px] top-3 h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]" />
          <div className="glass rounded-2xl p-7 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Gaurs Group · Ghaziabad, India
                </div>
                <h3 className="mt-2 text-xl font-bold md:text-2xl">Data Management Specialist Intern</h3>
              </div>
              <span className="rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 px-3 py-1 text-xs font-medium text-[var(--neon-cyan)]">
                Jun 2025 – Jul 2025
              </span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground md:text-[15px]">
              {[
                "Streamlined data collection and organization by designing structured workflows for large-scale real estate datasets, improving data accessibility, consistency, and data integrity.",
                "Automated data validation and reporting processes using Python and Excel-based tools, reducing manual effort and turnaround time by approximately 40%.",
                "Collaborated with cross-functional teams to analyze operational data and support data-driven management decisions.",
                "Applied research-driven and analytical methodologies to identify optimization opportunities in data handling and storage systems.",
                "Gained hands-on experience in data analysis, automation scripting, technical documentation, and structured data management.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--neon-cyan)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      name: "AquaMind",
      tag: "RAG · Oceanographic AI",
      date: "Jul 2025 – Oct 2025",
      stack: ["FastAPI", "PostgreSQL", "pgvector", "Google Gemini API", "Dash"],
      github: "https://github.com/RaghavTiwari31/AquaMind",
      points: [
        "Developed a Retrieval-Augmented Generation (RAG) system for querying multi-year ARGO oceanographic datasets using natural language.",
        "Implemented backend APIs using FastAPI and PostgreSQL with pgvector for embedding-based semantic search.",
        "Integrated Google Gemini API to generate SQL queries, summarize results, and provide contextual insights from structured data.",
        "Built an interactive Dash-based web application for real-time chat, data visualization, and geospatial exploration of ocean parameters.",
        "Designed a Model Context Protocol (MCP) layer to support persistent conversational sessions and modular tool orchestration.",
      ],
      accent: "cyan",
      span: "md:col-span-3",
    },
    {
      name: "Forensiq",
      tag: "Winner at RIFT'26 · Graph Forensics",
      date: "Feb 2026",
      stack: ["Node.js", "Express", "React", "D3.js", "Graph Algorithms"],
      github: "https://github.com/RaghavTiwari31/Forensiq",
      points: [
        "Built a graph-based financial forensics system that analyzes transaction networks to detect fraud patterns including circular fund routing, smurfing (fan-in/fan-out), and layered shell networks.",
        "Designed a detection pipeline that converts transaction CSV data into directed graphs and runs parallel algorithms to identify suspicious accounts and fraud rings.",
        "Implemented filtering mechanisms to reduce false positives from legitimate high-volume entities such as exchanges, merchants, and payroll systems.",
        "Developed an interactive D3.js visualization to explore suspicious transaction flows and network relationships.",
      ],
      accent: "violet",
      span: "md:col-span-3",
    },
  ];

  return (
    <section className="mt-32">
      <SectionHeading id="projects" kicker="04" title="PROJECTS" />
      <div className="grid gap-5 md:grid-cols-6">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className={p.span}>
            <motion.article
              whileHover={{ y: -6 }}
              className="glass group relative h-full overflow-hidden rounded-2xl p-7 transition-all hover:border-white/20 md:p-8"
            >
              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className={`text-xs font-semibold uppercase tracking-wider ${
                      p.accent === "cyan" ? "text-[var(--neon-cyan)]" : "text-[var(--neon-violet)]"
                    }`}>
                      {p.tag}
                    </div>
                    <h3 className="mt-1.5 text-2xl font-bold md:text-3xl">{p.name}</h3>
                  </div>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:scale-105"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Github
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{p.date}</div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5">
                      <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                        p.accent === "cyan" ? "bg-[var(--neon-cyan)]" : "bg-[var(--neon-violet)]"
                      }`} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Achievements() {
  const [idx, setIdx] = useState(0);
  const accentMap: Record<string, string> = {
    cyan: "text-[var(--neon-cyan)]",
    violet: "text-[var(--neon-violet)]",
    emerald: "text-[var(--neon-emerald)]",
  };

  return (
    <section className="mt-32">
      <SectionHeading id="achievements" kicker="05" title="ACHIEVEMENTS" />
      <Reveal>
        <div className="glass relative rounded-2xl p-8 md:p-10">
          <Trophy className={`absolute right-8 top-8 h-8 w-8 ${accentMap[ACHIEVEMENTS[idx].accent]}`} />
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="pr-12"
          >
            <div className={`text-xs font-semibold uppercase tracking-wider ${accentMap[ACHIEVEMENTS[idx].accent]}`}>
              {ACHIEVEMENTS[idx].sub}
            </div>
            <h3 className="mt-2 text-2xl font-bold md:text-3xl">{ACHIEVEMENTS[idx].title}</h3>
            <p className="mt-4 text-muted-foreground md:text-lg">{ACHIEVEMENTS[idx].body}</p>
          </motion.div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {ACHIEVEMENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-foreground" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Achievement ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIdx((idx - 1 + ACHIEVEMENTS.length) % ACHIEVEMENTS.length)}
                className="glass rounded-full p-2 transition hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIdx((idx + 1) % ACHIEVEMENTS.length)}
                className="glass rounded-full p-2 transition hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Publications() {
  const pubs = [
    {
      venue: "Springer Proceedings in Energy",
      title: "GreenShield – A Natural Language Processing Based Approach to Prevent Greenwashing and Attain Decarbonization",
      authors: "Raghav T., Adithya V., Dr. Nidhi S., Dr. Mudita N. (2025)",
      desc: "Proposes an NLP-driven AI framework to detect corporate greenwashing by analyzing sustainability reports and advertisements, enhancing transparency, consumer trust, and decarbonization efforts.",
      url: "https://doi.org/10.1007/978-981-96-4492-6_6",
    },
    {
      venue: "Taylor & Francis",
      title: "How GenAI Is Replacing Humans: Myth or Real. Ethical Considerations in AI: Bias and Fairness in Generative Models",
      authors: "Raghav T., Adithya V., Prachi S., Dr. Deepika B. (2025)",
      desc: "Explores the evolution and societal impact of Generative AI on human labor, analyzing automation's history and ethical challenges related to bias, fairness, and job displacement across industries.",
      url: "https://doi.org/10.1201/9781003565703-3",
    },
  ];
  return (
    <section className="mt-32">
      <SectionHeading id="publications" kicker="06" title="PUBLICATIONS" />
      <div className="grid gap-5 md:grid-cols-2">
        {pubs.map((p, i) => (
          <Reveal key={p.url} delay={i * 0.1}>
            <motion.a
              whileHover={{ y: -4 }}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="glass group block h-full rounded-2xl p-7 transition-all hover:border-[var(--neon-emerald)]/40"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--neon-emerald)]">
                <BookOpen className="h-3.5 w-3.5" />
                {p.venue}
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
              <div className="mt-2 text-xs text-muted-foreground">{p.authors}</div>
              <p className="mt-4 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--neon-emerald)] transition group-hover:gap-2.5">
                Read paper <ExternalLink className="h-3 w-3" />
              </div>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="mt-32">
      <SectionHeading id="education" kicker="07" title="EDUCATION" />
      <div className="grid gap-5 md:grid-cols-3">
        <Reveal>
          <div className="glass relative h-full overflow-hidden rounded-2xl p-7 md:col-span-1">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--neon-cyan)]/10 blur-3xl" />
            <GraduationCap className="h-7 w-7 text-[var(--neon-cyan)]" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">B.Tech · Computer Science</div>
            <h3 className="mt-1 text-lg font-bold">Guru Gobind Singh Indraprastha University</h3>
            <div className="mt-1 text-xs text-muted-foreground">New Delhi, India · Aug 2023 – Aug 2027</div>
            <div className="mt-5 flex items-baseline gap-2">
              <div className="text-4xl font-bold text-gradient">9.77</div>
              <div className="text-sm text-muted-foreground">/ 10 CGPA</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass h-full rounded-2xl p-7">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Class XII — CBSE</div>
            <h3 className="mt-1 text-lg font-bold">Father Agnel School</h3>
            <div className="mt-1 text-xs text-muted-foreground">NOIDA, India · 2022</div>
            <div className="mt-5 text-4xl font-bold text-[var(--neon-violet)]">94<span className="text-2xl text-muted-foreground">%</span></div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="glass h-full rounded-2xl p-7">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Class X — CBSE</div>
            <h3 className="mt-1 text-lg font-bold">Father Agnel School</h3>
            <div className="mt-1 text-xs text-muted-foreground">NOIDA, India · 2020</div>
            <div className="mt-5 text-4xl font-bold text-[var(--neon-emerald)]">95<span className="text-2xl text-muted-foreground">%</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section className="mt-32">
      <SectionHeading id="certifications" kicker="08" title="CERTIFICATIONS & PORTFOLIO" />
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-7">
            <Award className="h-6 w-6 text-[var(--neon-cyan)]" />
            <h3 className="mt-4 text-lg font-bold">Graphic Design Masterclass</h3>
            <div className="mt-1 text-xs text-muted-foreground">Udemy · Issued May 2025</div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.a
            whileHover={{ y: -4 }}
            href="https://tinyurl.com/raghavtiwariportfolio"
            target="_blank"
            rel="noreferrer"
            className="glass group relative block h-full overflow-hidden rounded-2xl p-7 transition-all hover:border-[var(--neon-violet)]/50 hover:shadow-[0_0_40px_oklch(0.7_0.25_295/0.4)]"
          >
            <div className="absolute inset-0 -z-0 bg-gradient-to-br from-[var(--neon-violet)]/10 via-transparent to-[var(--neon-cyan)]/10 opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <Sparkles className="h-6 w-6 text-[var(--neon-violet)]" />
              <h3 className="mt-4 text-lg font-bold">Design Portfolio</h3>
              <div className="mt-1 text-xs text-muted-foreground">Visual identity, branding & typography work</div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--neon-violet)]">
                Open portfolio <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div>Built for the Future by <span className="text-foreground font-medium">Raghav Tiwari</span>.</div>
        <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-foreground">
          <Mail className="h-4 w-4" /> {EMAIL}
        </a>
      </div>
    </footer>
  );
}
