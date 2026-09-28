import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Copy, FileText, Github, Globe, Linkedin, Mail, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { AltitudeRail } from "@/components/AltitudeRail";
import { CommandConsole } from "@/components/CommandConsole";
import { FlightDeck } from "@/components/FlightDeck";
import { Loader } from "@/components/Loader";
import { MissionPatch } from "@/components/MissionPatch";
import { OrbitNav } from "@/components/OrbitNav";
import { Reveal } from "@/components/Reveal";
import { SpaceBackground } from "@/components/SpaceBackground";
import { ACHIEVEMENTS, EDUCATION, EXPERIENCE, PROFILE, PROJECTS, PUBLICATIONS, SECTIONS, SKILLS, STATS, type SectionId } from "@/data";
import { goTo, useActiveSection } from "@/lib/nav";

const SECTION_IDS = SECTIONS.map((s) => s.id);
const NO_IDS: string[] = [];
const BOOT_KEY = "rt-booted";

function hasBooted() {
  try {
    return sessionStorage.getItem(BOOT_KEY) === "1";
  } catch {
    return false;
  }
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(hasBooted);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const active = useActiveSection(loaded ? SECTION_IDS : NO_IDS);

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* storage unavailable — boot will simply replay next time */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setConsoleOpen((o) => !o);
      } else if (e.key === "Escape") {
        setConsoleOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Honour deep links (e.g. /#missions) once content has mounted
  useEffect(() => {
    if (!loaded) return;
    const hash = window.location.hash.slice(1);
    if (hash) setTimeout(() => goTo(hash), 100);
  }, [loaded]);

  return (
    <>
      <SpaceBackground />
      <AnimatePresence>{!loaded && <Loader onComplete={finishBoot} />}</AnimatePresence>

      {loaded && (
        <>
          <FlightDeck active={active} onConsole={() => setConsoleOpen(true)} />
          <AltitudeRail active={active} />
          <CommandConsole open={consoleOpen} onClose={() => setConsoleOpen(false)} />

          <main className="relative">
            <Hero onConsole={() => setConsoleOpen(true)} />
            <Ticker />
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <Brief />
              <Skills />
              <FlightLog />
              <Missions />
              <Awards />
              <Papers />
              <Training />
              <Comms />
            </div>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

/* ───────────────────────── Shared bits ───────────────────────── */

function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const meta = SECTIONS.find((s) => s.id === id)!;
  return (
    <section id={id} className="scroll-mt-20 pt-28 md:pt-36" aria-labelledby={`${id}-title`}>
      <Reveal>
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="bg-[var(--c-red)] px-1.5 py-0.5 font-semibold text-[var(--c-space)]">SEC {meta.code}</span>
            <span className="text-[var(--c-dim)]">{meta.label}</span>
            <span className="h-px flex-1 bg-[var(--c-line)]" />
            <span className="hidden text-[var(--c-line-strong)] sm:inline">{meta.code} / 08</span>
          </div>
          <h2 id={`${id}-title`} className="mt-4 text-6xl font-black md:text-8xl">
            {meta.short}
          </h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function ExtLink({ href, children, className = "btn" }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
      {children}
    </a>
  );
}

function Counter({ value, decimals }: { value: number; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {decimals ? n.toFixed(decimals) : String(Math.round(n)).padStart(2, "0")}
    </span>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero({ onConsole }: { onConsole: () => void }) {
  const current = EXPERIENCE.find((e) => e.active);
  const rows = [
    ["Callsign", PROFILE.name],
    ["Base", PROFILE.base],
    ["Current orbit", current ? `${current.role} @ EDMO` : PROFILE.role],
    ["Trajectory", "Applied AI · Intelligent systems"],
  ];

  return (
    <section id="top" className="relative overflow-hidden pt-24 md:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--c-dim)]"
          >
            <span className="flex items-center gap-2 text-[var(--c-cream)]">
              <span className="animate-blink h-2 w-2 bg-[var(--c-red)]" />
              Mission RT-01
            </span>
            <span>Status: Active</span>
            <span>Open to opportunities</span>
          </motion.div>

          <h1 className="mt-6 font-black leading-[0.82]" aria-label={PROFILE.name}>
            {["Raghav", "Tiwari"].map((word, w) => (
              <span key={word} className="block overflow-hidden text-[clamp(4.5rem,14vw,10.5rem)]">
                <motion.span
                  className={`block ${w === 1 ? "text-transparent [-webkit-text-stroke:2px_var(--c-cream)]" : ""}`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 + w * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="stripes mt-5 h-6 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.7, 0, 0.3, 1] }}
            style={{ width: "min(100%, 26rem)" }}
          />

          <Reveal delay={0.3}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--c-cream)]/85 md:text-xl">
              {PROFILE.role} building <span className="text-[var(--c-mustard)]">user-centric, AI-powered products</span> — LLM
              workflows, RAG pipelines, backend APIs and data-driven applications.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <dl className="mt-8 grid max-w-xl grid-cols-1 border-t border-[var(--c-line)] font-mono text-xs sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 border-b border-[var(--c-line)] py-2.5 sm:odd:border-r sm:odd:pr-4 sm:even:pl-4">
                  <dt className="label text-[10px]">{k}</dt>
                  <dd className="uppercase tracking-wide">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ExtLink href={PROFILE.resume} className="btn btn-primary">
                <FileText className="h-4 w-4" /> Resume
              </ExtLink>
              <ExtLink href={PROFILE.github}>
                <Github className="h-4 w-4" /> GitHub
              </ExtLink>
              <ExtLink href={PROFILE.linkedin}>
                <Linkedin className="h-4 w-4" /> LinkedIn
              </ExtLink>
              <ExtLink href={`mailto:${PROFILE.email}`}>
                <Mail className="h-4 w-4" /> Email
              </ExtLink>
            </div>
            <button onClick={onConsole} className="label mt-6 hidden hover:text-[var(--c-cream)] md:block">
              Tip — press <kbd className="border border-[var(--c-line-strong)] px-1.5 text-[var(--c-mustard)]">/</kbd> to open
              the command console
            </button>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="panel panel-corners p-4 sm:p-5"
        >
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--c-dim)]">
            <span>Fig. 1 — Navigation chart</span>
            <span>Scale 1:∞</span>
          </div>
          <OrbitNav />
        </motion.div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [
    "Python",
    "FastAPI",
    "RAG pipelines",
    "PostgreSQL · pgvector",
    "LLM workflows",
    "AI agents",
    "1st — IndustrySolve 2025",
    "Winner — RIFT'26",
    "2 × published research",
    "CGPA 9.77",
    "React · D3.js",
  ];
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-6 px-6 font-mono text-xs uppercase tracking-[0.18em]">
          {t}
          <span className="text-[var(--c-red)]">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-[var(--c-cream)] bg-[var(--c-cream)] py-2.5 text-[var(--c-space)]" aria-hidden>
      <div className="animate-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ───────────────────────── 01 Brief ───────────────────────── */

function Brief() {
  return (
    <Section id="brief">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="text-2xl leading-snug md:text-[2rem] md:leading-[1.25]">
            B.Tech Computer Science student focused on building{" "}
            <mark className="bg-transparent text-[var(--c-mustard)] underline decoration-[var(--c-red)] decoration-2 underline-offset-4">
              user-centric, AI-powered products
            </mark>{" "}
            and data-driven applications.
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-[var(--c-dim)] md:text-lg">
            Experienced in developing LLM-based workflows, RAG pipelines, backend APIs, and interactive visualization tools
            using Python, FastAPI, and PostgreSQL. Interested in applied AI research, intelligent systems, and scalable
            software engineering.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-px self-start border border-[var(--c-line)] bg-[var(--c-line)]">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-[var(--c-panel)] p-5">
              <div className="label text-[10px]">RDG-0{i + 1}</div>
              <div className="mt-2 font-display text-5xl font-black text-[var(--c-cream)] md:text-6xl">
                <Counter value={s.value} decimals={s.decimals} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--c-mustard)]">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────────── 02 Skills ───────────────────────── */

function Skills() {
  const [idx, setIdx] = useState(0);
  const cat = SKILLS[idx];

  return (
    <Section id="skills">
      <Reveal>
        <div className="panel panel-corners grid md:grid-cols-[minmax(0,17rem)_1fr]">
          {/* Selector switches */}
          <div role="tablist" aria-label="Skill categories" className="border-b border-[var(--c-line)] md:border-r md:border-b-0">
            <div className="label border-b border-[var(--c-line)] px-4 py-2.5 text-[10px]">Select module</div>
            <div className="grid grid-cols-2 md:grid-cols-1">
              {SKILLS.map((s, i) => {
                const on = i === idx;
                return (
                  <button
                    key={s.code}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setIdx(i)}
                    className={`flex items-center gap-3 border-b border-[var(--c-line)] px-4 py-3 text-left transition-colors ${
                      on ? "bg-[var(--c-cream)] text-[var(--c-space)]" : "hover:bg-[var(--c-panel-2)]"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 border ${
                        on ? "border-[var(--c-red)] bg-[var(--c-red)]" : "border-[var(--c-line-strong)]"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block font-mono text-[10px] ${on ? "text-[var(--c-red)]" : "text-[var(--c-dim)]"}`}>{s.code}</span>
                      <span className="block text-sm font-medium leading-snug">{s.title}</span>
                    </span>
                    <span className="hidden font-mono text-[10px] opacity-60 sm:inline">{String(s.items.length).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CRT readout */}
          <div className="p-4 sm:p-6">
            <div className="crt min-h-[20rem] p-5 text-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] opacity-70">
                <span>&gt; load module {cat.code.toLowerCase()}</span>
                <span>{cat.items.length} units online</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={cat.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <div className="mt-4 font-display text-4xl font-extrabold uppercase text-[var(--c-phosphor)] sm:text-5xl">
                    {cat.title}
                  </div>
                  <ul className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {cat.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 + i * 0.06, duration: 0 }}
                        className="flex items-baseline gap-3"
                      >
                        <span className="text-[11px] opacity-60">[OK]</span>
                        <span>{item}</span>
                        <span className="flex-1 translate-y-[-3px] border-b border-dotted border-current opacity-20" />
                        <span className="text-[11px] opacity-50">{String(i + 1).padStart(2, "0")}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-6 text-[11px] opacity-60">
                    &gt; ready<span className="animate-blink">_</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────────────────────── 03 Flight log ───────────────────────── */

function FlightLog() {
  return (
    <Section id="log">
      <ol className="relative space-y-8 border-l border-[var(--c-line-strong)] pl-6 md:pl-0 md:border-l-0">
        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.08}>
            <li className="relative grid gap-4 md:grid-cols-[12rem_1fr] md:gap-8">
              <span
                className={`absolute -left-[31px] top-1.5 h-3 w-3 border-2 md:hidden ${
                  e.active ? "border-[var(--c-red)] bg-[var(--c-red)]" : "border-[var(--c-line-strong)] bg-[var(--c-space)]"
                }`}
              />
              <div className="font-mono text-xs uppercase tracking-wider md:pt-6 md:text-right">
                <div className="text-[var(--c-dim)]">LOG-{String(EXPERIENCE.length - i).padStart(3, "0")}</div>
                <div className="mt-1 text-[var(--c-cream)]">
                  {e.start} → {e.end}
                </div>
                <div
                  className={`mt-2 inline-block px-1.5 py-0.5 text-[10px] font-semibold ${
                    e.active ? "bg-[var(--c-red)] text-[var(--c-space)]" : "border border-[var(--c-line-strong)] text-[var(--c-dim)]"
                  }`}
                >
                  {e.active ? "● In flight" : "Mission complete"}
                </div>
              </div>
              <article className="panel group p-6 transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--c-line-strong)] md:p-8">
                <div className="label text-[10px]">
                  {e.org} · {e.place}
                </div>
                <h3 className="mt-2 text-3xl font-extrabold md:text-4xl">{e.role}</h3>
                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-[var(--c-cream)]/80">
                  {e.points.map((p, j) => (
                    <li key={p} className="grid grid-cols-[2.25rem_1fr]">
                      <span className="font-mono text-[11px] leading-[1.9] text-[var(--c-mustard)]">{String(j + 1).padStart(2, "0")}</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ───────────────────────── 04 Missions ───────────────────────── */

function Missions() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const p = PROJECTS[idx];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    const next = (i + PROJECTS.length) % PROJECTS.length;
    setDir(next > idx || (idx === PROJECTS.length - 1 && next === 0) ? 1 : -1);
    setIdx(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  return (
    <Section id="missions">
      <Reveal>
        {/* Folder tabs */}
        <div
          role="tablist"
          aria-label="Projects"
          className="flex gap-1 overflow-x-auto"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") select(idx + 1, true);
            if (e.key === "ArrowLeft") select(idx - 1, true);
          }}
        >
          {PROJECTS.map((proj, i) => {
            const on = i === idx;
            return (
              <button
                key={proj.id}
                ref={(el) => void (tabRefs.current[i] = el)}
                role="tab"
                aria-selected={on}
                aria-controls="mission-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                className={`shrink-0 border border-b-0 px-4 py-2.5 text-left transition-colors ${
                  on
                    ? "border-[var(--c-cream)] bg-[var(--c-cream)] text-[var(--c-space)]"
                    : "border-[var(--c-line)] bg-[var(--c-panel)] text-[var(--c-dim)] hover:text-[var(--c-cream)]"
                }`}
              >
                <span className={`block font-mono text-[10px] ${on ? "text-[var(--c-red)]" : ""}`}>{proj.designation}</span>
                <span className="block font-display text-lg font-extrabold uppercase leading-tight">{proj.name}</span>
              </button>
            );
          })}
        </div>

        <div id="mission-panel" role="tabpanel" className="panel overflow-hidden border-t-2 border-t-[var(--c-cream)]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={p.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="grid gap-8 p-6 md:grid-cols-[15rem_1fr] md:p-10"
            >
              <div className="flex flex-col items-center gap-5 md:items-start">
                <MissionPatch
                  ringText={`${p.name} · ${p.designation}`}
                  center={p.designation.split("-")[0]}
                  color={p.color}
                  footer={p.date.split(" – ").pop()}
                  spin
                  className="w-44 md:w-full"
                />
                <dl className="w-full font-mono text-xs">
                  {[
                    ["Window", p.date],
                    ["Class", p.tag],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-[var(--c-line)] py-2">
                      <dt className="text-[var(--c-dim)] uppercase">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <div className="label text-[10px]" style={{ color: p.color }}>
                  Mission file · {p.designation}
                </div>
                <h3 className="mt-2 text-5xl font-black md:text-7xl">{p.name}</h3>
                <ol className="mt-6 space-y-3.5 text-[15px] leading-relaxed text-[var(--c-cream)]/80">
                  {p.points.map((pt, j) => (
                    <li key={pt} className="grid grid-cols-[3.5rem_1fr]">
                      <span className="font-mono text-[11px] leading-[1.9] text-[var(--c-mustard)]">OBJ-{String(j + 1).padStart(2, "0")}</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-7 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--c-line)] pt-6">
                  <div className="flex flex-wrap gap-3">
                    {p.live && (
                      <ExtLink href={p.live} className="btn btn-primary">
                        <Globe className="h-4 w-4" /> Launch live <ArrowUpRight className="h-3.5 w-3.5" />
                      </ExtLink>
                    )}
                    {p.github && (
                      <ExtLink href={p.github} className={p.live ? "btn" : "btn btn-primary"}>
                        <Github className="h-4 w-4" /> View source <ArrowUpRight className="h-3.5 w-3.5" />
                      </ExtLink>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tabular-nums text-[var(--c-dim)]">
                      {String(idx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </span>
                    <button onClick={() => select(idx - 1)} className="btn px-2.5" aria-label="Previous project">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => select(idx + 1)} className="btn px-2.5" aria-label="Next project">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────────────────────── 05 Awards ───────────────────────── */

function Awards() {
  const [open, setOpen] = useState<number | null>(null);
  const a = open !== null ? ACHIEVEMENTS[open] : null;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Section id="awards">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ACHIEVEMENTS.map((ach, i) => (
          <Reveal key={ach.title} delay={i * 0.07}>
            <button
              onClick={() => setOpen(i)}
              className="panel group flex h-full w-full flex-col items-center p-6 text-center transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_var(--c-mustard)]"
              aria-haspopup="dialog"
            >
              <MissionPatch
                ringText={ach.title.split(" — ")[0]}
                center={ach.rank}
                color={ach.color}
                footer={ach.year}
                className="w-36 transition-transform duration-500 group-hover:rotate-[8deg]"
              />
              <h3 className="mt-5 text-2xl font-extrabold">{ach.title}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--c-dim)]">{ach.sub}</p>
              <span className="label mt-auto pt-5 text-[10px] text-[var(--c-mustard)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Open dossier ▸
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {a && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--c-space)]/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(null)}
            data-lenis-prevent
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="award-title"
              className="panel max-h-[90vh] w-full max-w-3xl overflow-y-auto border-[var(--c-cream)] shadow-[8px_8px_0_var(--c-red)]"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-[var(--c-line)] px-5 py-3">
                <span className="label text-[10px]">Commendation dossier · {a.year}</span>
                <button onClick={() => setOpen(null)} aria-label="Close" className="p-1 hover:text-[var(--c-red)]" autoFocus>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-[9rem_1fr] md:p-8">
                <MissionPatch ringText={a.title.split(" — ")[0]} center={a.rank} color={a.color} footer={a.year} className="mx-auto w-32 sm:w-full" />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider" style={{ color: a.color }}>
                    {a.sub}
                  </div>
                  <h3 id="award-title" className="mt-2 text-4xl font-black">
                    {a.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[var(--c-cream)]/80">{a.body}</p>
                </div>
              </div>
              {a.proof && (
                <figure className="border-t border-[var(--c-line)] p-6 md:p-8">
                  <figcaption className="label mb-3 text-[10px]">Exhibit A — certificate</figcaption>
                  <img src={a.proof} alt={`${a.title} certificate`} className="w-full border border-[var(--c-line)]" loading="lazy" />
                </figure>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ───────────────────────── 06 Papers ───────────────────────── */

function Papers() {
  return (
    <Section id="papers">
      <div className="space-y-6">
        {PUBLICATIONS.map((p, i) => (
          <Reveal key={p.doi} delay={i * 0.08}>
            <a
              href={`https://doi.org/${p.doi}`}
              target="_blank"
              rel="noreferrer"
              className="group grid bg-[var(--c-cream)] text-[var(--c-space)] shadow-[6px_6px_0_var(--c-line-strong)] transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--c-red)] md:grid-cols-[9rem_1fr_auto]"
            >
              <div className="flex items-center justify-between border-b-2 border-[var(--c-space)] p-5 md:flex-col md:items-start md:border-r-2 md:border-b-0">
                <span className="font-display text-4xl font-black">TX-0{i + 1}</span>
                <span className="font-mono text-xs">{p.year}</span>
              </div>
              <div className="p-5 md:p-7">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--c-red)]">
                  {p.publisher} — {p.venue}
                </div>
                <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">{p.title}</h3>
                <p className="mt-2 font-mono text-xs opacity-70">{p.authors}</p>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed opacity-85">{p.desc}</p>
                <p className="mt-4 font-mono text-[11px] opacity-60">DOI {p.doi}</p>
              </div>
              <div className="flex items-center justify-end border-t-2 border-[var(--c-space)] p-5 md:border-t-0 md:border-l-2">
                <span className="flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider">
                  Read
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── 07 Training ───────────────────────── */

function Training() {
  return (
    <Section id="training">
      <Reveal>
        <div className="panel">
          <div className="hidden grid-cols-[1fr_12rem_10rem] border-b border-[var(--c-line)] px-6 py-2.5 md:grid">
            <span className="label text-[10px]">Institution</span>
            <span className="label text-[10px]">Period</span>
            <span className="label text-right text-[10px]">Score</span>
          </div>
          {EDUCATION.map((e, i) => (
            <div
              key={e.program}
              className="group grid gap-2 border-b border-[var(--c-line)] px-6 py-6 transition-colors last:border-b-0 hover:bg-[var(--c-panel-2)] md:grid-cols-[1fr_12rem_10rem] md:items-center md:gap-4"
            >
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--c-mustard)]">{e.program}</div>
                <h3 className="mt-1.5 text-2xl font-extrabold md:text-3xl">{e.school}</h3>
                <div className="mt-1 text-sm text-[var(--c-dim)]">{e.place}</div>
              </div>
              <div className="font-mono text-xs uppercase text-[var(--c-dim)]">{e.period}</div>
              <div className="flex items-baseline gap-1.5 md:justify-end">
                <span className={`font-display text-5xl font-black ${i === 0 ? "text-[var(--c-red)]" : ""}`}>{e.score}</span>
                <span className="font-mono text-xs text-[var(--c-dim)]">{e.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ───────────────────────── 08 Comms ───────────────────────── */

function Comms() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(PROFILE.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const links = [
    { label: "GitHub", sub: "@RaghavTiwari31", href: PROFILE.github, icon: Github },
    { label: "LinkedIn", sub: "raghav-tiwari", href: PROFILE.linkedin, icon: Linkedin },
    { label: "Resume", sub: "PDF · 2 pages", href: PROFILE.resume, icon: FileText },
    { label: "Design work", sub: "Branding & layout", href: PROFILE.designPortfolio, icon: ArrowUpRight },
  ];

  return (
    <Section id="comms">
      <Reveal>
        <div className="panel panel-corners overflow-hidden">
          <div className="p-6 md:p-12">
            <div className="label text-[10px]">Channel open · awaiting transmission</div>
            <p className="mt-4 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] md:text-7xl">
              Let's build something <span className="text-[var(--c-mustard)]">worth launching.</span>
            </p>
            <p className="mt-6 max-w-xl text-[var(--c-dim)] md:text-lg">
              Open to internships, research collaborations and ambitious AI products. The fastest route is email.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <a
                href={`mailto:${PROFILE.email}`}
                className="btn btn-primary justify-center text-sm normal-case tracking-normal sm:text-base"
              >
                <Mail className="h-4 w-4" /> {PROFILE.email}
              </a>
              <button onClick={copy} className="btn justify-center" aria-live="polite">
                <Copy className="h-4 w-4" /> {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-[var(--c-line)] md:grid-cols-4">
            {links.map((l) => (
              <ExtLink
                key={l.label}
                href={l.href}
                className="group flex items-center justify-between gap-3 border-[var(--c-line)] p-5 transition-colors odd:border-r hover:bg-[var(--c-cream)] hover:text-[var(--c-space)] md:border-r md:last:border-r-0 [&:nth-child(-n+2)]:border-b md:[&:nth-child(-n+2)]:border-b-0"
              >
                <span>
                  <span className="block font-display text-2xl font-extrabold uppercase">{l.label}</span>
                  <span className="block font-mono text-[11px] opacity-60">{l.sub}</span>
                </span>
                <l.icon className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </ExtLink>
            ))}
          </div>
          <div className="stripes h-8" />
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="mt-28 border-t border-[var(--c-line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--c-dim)] sm:px-6 md:flex-row md:items-center">
        <span>
          End of transmission · © {new Date().getFullYear()} {PROFILE.name}
        </span>
        <button onClick={() => goTo("top")} className="flex items-center gap-2 text-[var(--c-cream)] hover:text-[var(--c-mustard)]">
          ▲ Return to launch pad
        </button>
      </div>
    </footer>
  );
}
