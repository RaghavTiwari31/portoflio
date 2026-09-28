import { AnimatePresence, motion } from "framer-motion";
import { Menu, TerminalSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SECTIONS } from "@/data";
import { goTo, useScrollProgress } from "@/lib/nav";

function useMissionClock() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `T+${pad(Math.floor(elapsed / 3600))}:${pad(Math.floor(elapsed / 60) % 60)}:${pad(elapsed % 60)}`;
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        goTo("top");
        onClick?.();
      }}
      className="group flex items-center gap-2.5"
      aria-label="Back to top"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[360deg]" aria-hidden>
        <circle cx="12" cy="12" r="7" fill="var(--c-orange)" />
        <rect x="5" y="13" width="14" height="6" fill="var(--c-red)" />
        <rect x="5" y="14" width="14" height="1.2" fill="var(--c-space)" />
        <rect x="5" y="16.5" width="14" height="1.2" fill="var(--c-space)" />
        <ellipse cx="12" cy="12" rx="11" ry="3.6" fill="none" stroke="var(--c-cream)" strokeWidth="1.4" transform="rotate(-20 12 12)" />
      </svg>
      <span className="font-display text-lg font-extrabold uppercase leading-none tracking-wide">
        R. Tiwari
      </span>
    </a>
  );
}

export function FlightDeck({ active, onConsole }: { active: string | null; onConsole: () => void }) {
  const [open, setOpen] = useState(false);
  const clock = useMissionClock();
  const progress = useScrollProgress();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--c-line)] bg-[var(--c-space)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-stretch lg:flex" aria-label="Sections">
            {SECTIONS.map((s) => {
              const on = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(s.id);
                  }}
                  aria-current={on ? "location" : undefined}
                  className={`flex items-center gap-1.5 border-l border-[var(--c-line)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors last:border-r ${
                    on ? "bg-[var(--c-cream)] text-[var(--c-space)]" : "text-[var(--c-dim)] hover:text-[var(--c-cream)]"
                  }`}
                >
                  <span className={on ? "text-[var(--c-red)]" : "text-[var(--c-line-strong)]"}>{s.code}</span>
                  {s.short}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] tabular-nums text-[var(--c-dim)] sm:inline xl:inline lg:hidden">
              MET <span className="text-[var(--c-mustard)]">{clock}</span>
            </span>
            <button
              onClick={onConsole}
              className="flex items-center gap-1.5 border border-[var(--c-line-strong)] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--c-cream)] transition-colors hover:border-[var(--c-mustard)] hover:text-[var(--c-mustard)]"
              aria-label="Open command console"
            >
              <TerminalSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Console</span>
              <kbd className="hidden text-[var(--c-dim)] sm:inline">/</kbd>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="border border-[var(--c-line-strong)] p-1.5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Scroll progress — a stripe band that fills as you travel */}
        <div className="h-[3px] w-full bg-[var(--c-panel)]">
          <div className="stripes-v h-full" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[var(--c-space)] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="flex h-14 items-center justify-between border-b border-[var(--c-line)] px-4 sm:px-6">
              <Logo onClick={() => setOpen(false)} />
              <button onClick={() => setOpen(false)} className="border border-[var(--c-line-strong)] p-1.5" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-4 sm:px-6">
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    setTimeout(() => goTo(s.id), 300);
                  }}
                  className="group flex items-baseline gap-4 border-b border-[var(--c-line)] py-2"
                >
                  <span className="font-mono text-xs text-[var(--c-red)]">{s.code}</span>
                  <span className="font-display text-4xl font-extrabold uppercase transition-colors group-hover:text-[var(--c-mustard)]">
                    {s.short}
                  </span>
                  <span className="label ml-auto hidden sm:inline">{s.label}</span>
                </motion.a>
              ))}
            </nav>
            <div className="stripes h-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
