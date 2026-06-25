import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, MapPin, ExternalLink, Trophy, GraduationCap, Award, BookOpen, Briefcase, Sparkles, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useState, useRef } from "react";

import { SpaceBackground } from "@/components/SpaceBackground";
import { SolarSystem3D } from "@/components/SolarSystem3D";
import { MouseCursor } from "@/components/MouseCursor";
import { Spaceship3D } from "@/components/Spaceship3D";
import { Reveal } from "@/components/Reveal";
import { Loader } from "@/components/Loader";

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
  { title: "Programming Languages", items: ["Python", "C", "C++", "SQL", "JavaScript", "HTML", "CSS", "Java"], accent: "gold" },
  { title: "Frameworks & Libraries", items: ["Streamlit", "Dash", "React", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Seaborn"], accent: "purple" },
  { title: "Technologies & Concepts", items: ["Prompt Engineering", "Retrieval-Augmented Generation (RAG)", "LLM", "Generative AI", "AI Agents", "Data Analytics", "A/B Testing"], accent: "cyan" },
  { title: "Backend", items: ["REST APIs", "API Integration", "Async Processing", "JSON", "FastAPI"], accent: "gold" },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "VectorDB"], accent: "purple" },
  { title: "Tools", items: ["Vercel", "Git", "GitHub", "Claude", "Jira", "MS Excel/Google Sheets", "Power BI"], accent: "cyan" },
  { title: "Methodologies & Professional Skills", items: ["Agile", "SDLC", "Research", "Analytical Thinking", "Product Roadmaps", "Market Research", "Competitor Analysis"], accent: "gold" },
  { title: "Creative Skills", items: ["Canva", "Photoshop", "Typography", "Branding", "Layout Design"], accent: "purple" },
];

const accentMap: Record<string, string> = {
  gold: "text-[var(--space-gold)] border-[var(--space-gold)]/30 hover:border-[var(--space-gold)]/70 hover:bg-[var(--space-gold)]/10",
  purple: "text-[var(--space-purple)] border-[var(--space-purple)]/30 hover:border-[var(--space-purple)]/70 hover:bg-[var(--space-purple)]/10",
  cyan: "text-[var(--space-cyan)] border-[var(--space-cyan)]/30 hover:border-[var(--space-cyan)]/70 hover:bg-[var(--space-cyan)]/10",
};

const ACHIEVEMENTS = [
  {
    title: "1st Place – IndustrySolve 2025",
    sub: "Ideathon & Productathon, IIIT Delhi",
    body: "Won both rounds out of 150+ teams, advancing to the top 20 finalist Productathon. Led end-to-end design and development of the solution, delivering a fully functional prototype that secured a ₹40,000 award.",
    accent: "gold",
  },
  {
    title: "Rift26-Physics Wallah Institute of Innovation",
    sub: "1st in problem statement · 5th overall",
    body: "Secured 1st position in our problem statement and ranked 5th overall among participating teams in a 24-hour national-level hackathon.",
    accent: "purple",
  },
  {
    title: "iQOO x Reskill Hackathon 2026",
    sub: "4th Position (Special Honour)",
    body: "Secured 4th Position (Special Honour) among 80+ teams in a national-level hackathon organized by iQOO and Reskill, earning a ₹10,000 cash prize.",
    accent: "gold",
  },
  {
    title: "Vibecon — Emergent AI at IIT Delhi",
    sub: "Invite-only national hackathon",
    body: "Selected to participate in an exclusive, invite-only 24-hour national hackathon, collaborating with top student innovators to build and present a high-impact AI-driven solution under tight deadlines.",
    accent: "cyan",
  },
];

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>
      <motion.div 
        className="relative min-h-screen text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <SpaceBackground />
        <MouseCursor />
        {isLoaded && <Spaceship3D isShifted={isCarouselHovered} />}
        <Nav />
        <main className="mx-auto max-w-6xl px-6 pb-24">
          {isLoaded && (
            <>
              <Hero />
              <Summary />
              <Skills />
              <Experience />
              <Projects onHoverChange={setIsCarouselHovered} />
              <Achievements />
              <Publications />
              <Education />
              <Certifications />
            </>
          )}
        </main>
        {isLoaded && <Footer />}
      </motion.div>
    </>
  );
}

function Nav() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 px-4 w-[min(960px,95vw)]"
    >
      <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5">
        <a href="#top" className="flex items-center gap-2 text-sm font-bold tracking-tight group">
          <span className="relative h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-[var(--space-gold)] animate-pulse-glow" />
            <span className="absolute inset-0 rounded-full bg-[var(--space-gold)] blur-sm opacity-50" />
          </span>
          <span className="group-hover:text-[var(--space-gold)] transition-colors">RT</span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <a 
              key={n.id} 
              href={`#${n.id}`} 
              className="relative rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-all hover:text-foreground group"
            >
              <span className="relative z-10">{n.label}</span>
              <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors" />
            </a>
          ))}
        </nav>
        <a 
          href={`mailto:${EMAIL}`} 
          className="relative rounded-lg bg-gradient-to-r from-[var(--space-gold)] to-[var(--space-orange)] px-4 py-1.5 text-xs font-semibold text-background transition-all hover:scale-105 hover:brightness-110"
        >
          Contact
        </a>
      </div>
    </motion.header>
  );
}

function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="top" 
      className="relative flex min-h-screen flex-col justify-center pt-24 overflow-hidden"
    >
      {/* 3D Solar System positioned on the right */}
      <SolarSystem3D />
      
      <motion.div style={{ y, opacity }} className="relative z-10">
        <Reveal>
          <motion.div 
            className="flex items-center gap-2 text-xs text-muted-foreground"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MapPin className="h-3.5 w-3.5 text-[var(--space-gold)]" />
            <span>NOIDA, India</span>
            <span className="mx-2 h-1 w-1 rounded-full bg-[var(--space-gold)] animate-pulse-glow" />
            <span>Available for opportunities</span>
          </motion.div>
        </Reveal>
        
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="inline-block">
              {"Raghav".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 1.5 + index * 0.1 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>{" "}
            <span className="inline-block text-accent relative">
              {"Tiwari".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 2.1 + index * 0.1 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[var(--space-gold)] to-[var(--space-orange)] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 2.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </h1>
        
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Software Engineering Student — building{" "}
            <span className="text-highlight-cyan">AI-powered systems</span>,{" "}
            <span className="text-highlight-purple">RAG pipelines</span> and{" "}
            <span className="text-highlight-gold">data-driven applications</span>.
          </p>
        </Reveal>
        
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-3">
              <HeroLink href={GITHUB} icon={<Github className="h-4 w-4" />} label="Github" accent="cyan" />
              <HeroLink href={LINKEDIN} icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" accent="purple" />
              <HeroLink href={`mailto:${EMAIL}`} icon={<Mail className="h-4 w-4" />} label="Email" accent="gold" />
            </div>
            <motion.a
              whileTap={{ scale: 0.97 }}
              href="/proofs/Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[var(--space-gold)] transition-all overflow-hidden w-full sm:w-auto justify-center border border-white/10 hover:border-transparent bg-white/[0.02]"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,var(--space-gold)_100%)] -z-10" />
              <span className="absolute inset-[1px] rounded-[11px] bg-[var(--background)] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                View Resume
                <ArrowUpRight className="h-4 w-4 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.a>
          </div>
        </Reveal>
        
        {/* Scroll indicator */}
        <Reveal delay={0.5}>
          <motion.div 
            className="mt-20 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Explore</span>
            <Rocket className="h-4 w-4 text-[var(--space-gold)] rotate-180" />
          </motion.div>
        </Reveal>
      </motion.div>
    </section>
  );
}

function HeroLink({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent: string }) {
  const borderMap: Record<string, string> = {
    cyan: "hover:border-[var(--space-cyan)]/50",
    purple: "hover:border-[var(--space-purple)]/50",
    gold: "hover:border-[var(--space-gold)]/50",
  };
  const textMap: Record<string, string> = {
    cyan: "group-hover:text-[var(--space-cyan)]",
    purple: "group-hover:text-[var(--space-purple)]",
    gold: "group-hover:text-[var(--space-gold)]",
  };
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`glass group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 ${borderMap[accent]}`}
    >
      <span className={`transition-colors ${textMap[accent]}`}>{icon}</span>
      <span>{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}

function SectionHeading({ kicker, title, id }: { kicker: string; title: string; id: string }) {
  return (
    <Reveal>
      <div id={id} className="mb-10 scroll-mt-28">
        <motion.div 
          className="flex items-center gap-3"
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--space-gold)]">{kicker}</span>
          <span className="h-px flex-1 max-w-16 bg-gradient-to-r from-[var(--space-gold)]/50 to-transparent" />
        </motion.div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      </div>
    </Reveal>
  );
}

function Summary() {
  return (
    <section className="mt-32">
      <SectionHeading id="summary" kicker="01" title="PROFESSIONAL SUMMARY" />
      <Reveal>
        <motion.div 
          className="glass rounded-2xl p-8 md:p-10 hover-lift"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            B.Tech Computer Science student specializing in building{" "}
            <span className="text-highlight-cyan">AI-powered systems</span> and{" "}
            <span className="text-highlight-purple">data-driven applications</span>. Experienced in developing
            RAG pipelines, backend APIs, and automation workflows using Python, FastAPI, and PostgreSQL. Strong focus on{" "}
            <span className="text-highlight-gold">LLM-based systems, prompt engineering, and scalable AI pipelines</span>,
            with applied research experience and strong design thinking for building intuitive, user-centric solutions.
          </p>
        </motion.div>
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
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }} 
              transition={{ type: "spring", stiffness: 200 }}
              className="glass group h-full rounded-2xl p-6 transition-all hover:border-white/15"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((s, idx) => (
                  <motion.span 
                    key={s} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`rounded-full border bg-white/[0.02] px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-110 cursor-default ${accentMap[cat.accent]}`}
                  >
                    {s}
                  </motion.span>
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
          <motion.div 
            className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--space-gold)] via-[var(--space-gold)]/20 to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute left-[-5px] top-3 h-3 w-3 rounded-full bg-[var(--space-gold)]"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <span className="absolute inset-0 rounded-full bg-[var(--space-gold)] animate-ping opacity-30" />
          </motion.div>
          <motion.div 
            className="glass rounded-2xl p-7 md:p-8 hover-lift"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-[var(--space-gold)]" />
                  Gaurs Group · Ghaziabad, India
                </div>
                <h3 className="mt-2 text-xl font-bold md:text-2xl">Data Management Specialist Intern</h3>
              </div>
              <span className="rounded-full border border-[var(--space-gold)]/30 bg-[var(--space-gold)]/5 px-3 py-1 text-xs font-medium text-[var(--space-gold)]">
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
              ].map((line, idx) => (
                <motion.li 
                  key={line} 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--space-gold)]" />
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

function Projects({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) {
  const [activeIdx, setActiveIdx] = useState(0);

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
      accent: "purple",
    },
    {
      name: "Data Sage",
      tag: "End-to-End Analytics Automation",
      date: "Summer Internship 2025",
      stack: ["Python 3.10+", "Pandas", "NumPy", "Seaborn", "Matplotlib", "Scikit-learn", "Streamlit"],
      github: "https://github.com/RaghavTiwari31/DataSage",
      points: [
        "Developed an end-to-end automation tool that cleans, validates, analyzes, and generates insights from Excel datasets.",
        "Automated data cleaning processes including duplicate removal, missing value handling, and format standardization.",
        "Implemented rule-based data validation and numeric outlier detection using Interquartile Range (IQR).",
        "Integrated visual analytics and predictive ML models including Linear Regression and Unsupervised Clustering.",
        "Built an interactive GUI using Streamlit and generated professional styled HTML/PDF reports."
      ],
      accent: "gold",
    },
    {
      name: "KARMA",
      tag: "Enterprise Efficiency & Autonomous Operations",
      date: "2026",
      stack: ["React 18", "TypeScript", "Python", "FastAPI", "Google Gemini 2.0"],
      github: "https://github.com/RaghavTiwari31/Karma",
      points: [
        "Designed a multi-agent AI system to autonomously eliminate enterprise waste by monitoring software utilization and vendor contracts in real-time.",
        "Built a Ghost Approver agent that intercepts purchasing workflows and proposes Gemini-powered cost-saving alternatives.",
        "Developed proactive and forensic agents to prioritize expiring contracts, identify risks, and deconstruct past cost-overruns.",
        "Created an autonomous SLA monitor to track supplier uptime strings against SLA contracts and inject critical risks into the Waste Calendar.",
        "Implemented a gamification feature to score departments based on cost accountability and savings."
      ],
      accent: "cyan",
    }
  ];

  const accentColors: Record<string, { text: string; bg: string }> = {
    cyan: { text: "text-[var(--space-cyan)]", bg: "bg-[var(--space-cyan)]" },
    purple: { text: "text-[var(--space-purple)]", bg: "bg-[var(--space-purple)]" },
    gold: { text: "text-[var(--space-gold)]", bg: "bg-[var(--space-gold)]" },
  };

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % projects.length);
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section className="mt-32">
      <div className="flex flex-col md:flex-row md:items-start justify-between md:pr-4">
        <SectionHeading id="projects" kicker="04" title="PROJECTS" />
        <div className="flex justify-center gap-4 md:mt-2 mb-8 md:mb-0 relative z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
            className="flex h-14 w-14 items-center justify-center rounded-full transition-all bg-[var(--space-gold)] text-black hover:brightness-110 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
          >
            <ChevronLeft className="h-6 w-6 stroke-[3]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
            className="flex h-14 w-14 items-center justify-center rounded-full transition-all bg-[var(--space-gold)] text-black hover:brightness-110 shadow-[0_0_25px_rgba(255,215,0,0.5)]"
          >
            <ChevronRight className="h-6 w-6 stroke-[3]" />
          </motion.button>
        </div>
      </div>
      <div className="relative -mt-6 md:-mt-10 flex h-[650px] md:h-[480px] w-full items-center justify-center overflow-visible">
        {projects.map((p, i) => {
          const diff = (i - activeIdx + projects.length) % projects.length;
          const isCenter = diff === 0;
          const isRight = diff === 1;
          const isLeft = diff === projects.length - 1;

          if (!isCenter && !isRight && !isLeft && projects.length > 3) return null;

          const xOffset = isLeft ? "-55%" : isRight ? "55%" : "0%";
          const zIndex = isCenter ? 20 : 10;
          const scale = isCenter ? 1 : 0.85;
          const opacity = isCenter ? 1 : 0.4;
          const blur = isCenter ? 0 : 6;

          return (
            <motion.article
              key={p.name}
              initial={false}
              animate={{
                x: xOffset,
                scale,
                zIndex,
                opacity,
                filter: `blur(${blur}px)`,
              }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="absolute w-[95%] md:w-[85%] max-w-2xl"
              style={{ originX: 0.5, originY: 0.5, pointerEvents: isCenter ? "auto" : "none" }}
            >
              <div className={`glass group relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 md:p-8 ${isCenter ? "border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.3)]" : "border-white/5"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className={`text-xs font-semibold uppercase tracking-wider ${accentColors[p.accent].text}`}>
                      {p.tag}
                    </div>
                    <h3 className="mt-1.5 text-2xl font-bold md:text-3xl">{p.name}</h3>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-white/10"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Github
                    <ExternalLink className="h-3 w-3" />
                  </motion.a>
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
                  {p.points.map((pt, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accentColors[p.accent].bg}`} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function Achievements() {
  const [idx, setIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const accentColorMap: Record<string, string> = {
    gold: "text-[var(--space-gold)]",
    purple: "text-[var(--space-purple)]",
    cyan: "text-[var(--space-cyan)]",
  };

  const proofMap: Record<number, string> = {
    0: "/proofs/iiit delhi proof.jpeg",
    1: "/proofs/RIFT26-Certificate-Raghav-Tiwari.jpg",
    2: "",
    3: "",
  };

  const currentProof = proofMap[idx];

  return (
    <section className="mt-32">
      <SectionHeading id="achievements" kicker="05" title="ACHIEVEMENTS" />
      <Reveal>
        <motion.div 
          className="glass relative rounded-2xl p-8 md:p-10 hover-lift"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <Trophy className={`absolute right-8 top-8 h-8 w-8 ${accentColorMap[ACHIEVEMENTS[idx].accent]}`} />
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pr-12"
          >
            <div className={`text-xs font-semibold uppercase tracking-wider ${accentColorMap[ACHIEVEMENTS[idx].accent]}`}>
              {ACHIEVEMENTS[idx].sub}
            </div>
            <h3 className="mt-2 text-2xl font-bold md:text-3xl">{ACHIEVEMENTS[idx].title}</h3>
            <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">{ACHIEVEMENTS[idx].body}</p>
          </motion.div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {ACHIEVEMENTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-[var(--space-gold)]" : "w-2 bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Achievement ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIdx((idx - 1 + ACHIEVEMENTS.length) % ACHIEVEMENTS.length)}
                className="glass rounded-full p-2.5 transition hover:bg-white/10"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIdx((idx + 1) % ACHIEVEMENTS.length)}
                className="glass rounded-full p-2.5 transition hover:bg-white/10"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Reveal>
      
      <AnimatePresence>
        {isHovered && currentProof && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            src={currentProof}
            alt="Achievement Proof"
            className="fixed z-[100] rounded-xl shadow-2xl object-cover pointer-events-none border border-white/10"
            style={{
              width: "400px",
              left: mousePos.x,
              top: mousePos.y + 20,
            }}
          />
        )}
      </AnimatePresence>
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
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="glass group block h-full rounded-2xl p-7 transition-all hover:border-[var(--space-cyan)]/40 hover:shadow-[0_0_40px_rgba(100,200,255,0.15)]"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--space-cyan)]">
                <BookOpen className="h-3.5 w-3.5" />
                {p.venue}
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
              <div className="mt-2 text-xs text-muted-foreground">{p.authors}</div>
              <p className="mt-4 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--space-cyan)] transition group-hover:gap-2.5">
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
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="glass relative h-full overflow-hidden rounded-2xl p-7 md:col-span-1 hover:shadow-[0_0_40px_rgba(100,200,255,0.15)]"
          >
            <GraduationCap className="h-7 w-7 text-[var(--space-cyan)]" />
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">B.Tech · Computer Science</div>
            <h3 className="mt-1 text-lg font-bold">Guru Gobind Singh Indraprastha University</h3>
            <div className="mt-1 text-xs text-muted-foreground">New Delhi, India · Aug 2023 – Aug 2027</div>
            <div className="mt-5 flex items-baseline gap-2">
              <motion.div 
                className="text-4xl font-bold text-[var(--space-cyan)]"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                9.77
              </motion.div>
              <div className="text-sm text-muted-foreground">/ 10 CGPA</div>
            </div>
          </motion.div>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="glass h-full rounded-2xl p-7 hover:shadow-[0_0_40px_rgba(150,100,255,0.15)]"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Class XII — CBSE</div>
            <h3 className="mt-1 text-lg font-bold">Father Agnel School</h3>
            <div className="mt-1 text-xs text-muted-foreground">NOIDA, India · 2022</div>
            <motion.div 
              className="mt-5 text-4xl font-bold text-[var(--space-purple)]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              94<span className="text-2xl text-muted-foreground">%</span>
            </motion.div>
          </motion.div>
        </Reveal>
        <Reveal delay={0.2}>
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="glass h-full rounded-2xl p-7 hover:shadow-[0_0_40px_rgba(255,200,100,0.15)]"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Class X — CBSE</div>
            <h3 className="mt-1 text-lg font-bold">Father Agnel School</h3>
            <div className="mt-1 text-xs text-muted-foreground">NOIDA, India · 2020</div>
            <motion.div 
              className="mt-5 text-4xl font-bold text-[var(--space-gold)]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              95<span className="text-2xl text-muted-foreground">%</span>
            </motion.div>
          </motion.div>
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
          <motion.div 
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="glass h-full rounded-2xl p-7 hover:shadow-[0_0_40px_rgba(100,200,255,0.15)]"
          >
            <Award className="h-6 w-6 text-[var(--space-cyan)]" />
            <h3 className="mt-4 text-lg font-bold">Graphic Design Masterclass</h3>
            <div className="mt-1 text-xs text-muted-foreground">Udemy · Issued May 2025</div>
          </motion.div>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.a
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            href="https://tinyurl.com/raghavtiwariportfolio"
            target="_blank"
            rel="noreferrer"
            className="glass group relative block h-full overflow-hidden rounded-2xl p-7 transition-all hover:border-[var(--space-purple)]/50 hover:shadow-[0_0_40px_rgba(150,100,255,0.15)]"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-[var(--space-purple)]" />
              <h3 className="mt-4 text-lg font-bold">Design Portfolio</h3>
              <div className="mt-1 text-xs text-muted-foreground">Visual identity, branding & typography work</div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--space-purple)]">
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
    <footer className="relative border-t border-white/5 px-6 py-10 mt-20">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Built for the Future by <span className="text-foreground font-medium">Raghav Tiwari</span>.
        </motion.div>
        <motion.a 
          href={`mailto:${EMAIL}`} 
          className="inline-flex items-center gap-2 transition hover:text-[var(--space-gold)]"
          whileHover={{ scale: 1.05 }}
        >
          <Mail className="h-4 w-4" /> {EMAIL}
        </motion.a>
      </div>
    </footer>
  );
}
