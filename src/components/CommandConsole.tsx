import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { PROFILE, SECTIONS } from "@/data";
import { goTo } from "@/lib/nav";

type Command = { key: string; label: string; hint: string; run: () => void };

/** Terminal-style command palette. Opens with "/" or Ctrl/⌘+K. */
export function CommandConsole({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const openUrl = (url: string) => () => window.open(url, "_blank", "noopener");
    return [
      ...SECTIONS.map((s) => ({
        key: `goto ${s.short.toLowerCase()}`,
        label: `${s.code} ${s.label}`,
        hint: "navigate",
        run: () => goTo(s.id),
      })),
      { key: "goto top", label: "Launch pad", hint: "navigate", run: () => goTo("top") },
      { key: "open resume", label: "Resume (PDF)", hint: "open", run: openUrl(PROFILE.resume) },
      { key: "open github", label: "GitHub", hint: "open", run: openUrl(PROFILE.github) },
      { key: "open linkedin", label: "LinkedIn", hint: "open", run: openUrl(PROFILE.linkedin) },
      { key: "mail", label: PROFILE.email, hint: "compose", run: () => (window.location.href = `mailto:${PROFILE.email}`) },
      {
        key: "copy email",
        label: "Copy email to clipboard",
        hint: "copy",
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email);
          setFlash("EMAIL COPIED TO CLIPBOARD");
        },
      },
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.key} ${c.label}`.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      setFlash(null);
    }
  }, [open]);

  useEffect(() => setSel(0), [query]);

  const exec = (c: Command | undefined) => {
    if (!c) return;
    c.run();
    if (c.hint !== "copy") onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center bg-[var(--c-space)]/85 px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command console"
            className="crt w-full max-w-lg shadow-[8px_8px_0_var(--c-red)]"
            initial={{ y: -12, scaleY: 0.02 }}
            animate={{ y: 0, scaleY: 1 }}
            exit={{ scaleY: 0.02, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="flex items-center justify-between border-b border-[#1f3326] px-4 py-2 text-[10px] uppercase tracking-[0.2em] opacity-70">
              <span>RT-01 // Command Console</span>
              <span>ESC to exit</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 text-sm">
              <span>&gt;</span>
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSel((s) => Math.min(results.length - 1, s + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSel((s) => Math.max(0, s - 1));
                  } else if (e.key === "Enter") {
                    exec(results[sel]);
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder="type a command — e.g. goto projects"
                className="w-full bg-transparent text-[var(--c-phosphor)] placeholder:text-[var(--c-phosphor)]/35 focus:outline-none"
                aria-label="Command"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto border-t border-[#1f3326] py-1 text-sm" role="listbox">
              {results.length === 0 && <li className="px-4 py-2 opacity-60">ERR: unknown command. try "goto", "open", "copy".</li>}
              {results.map((c, i) => (
                <li
                  key={c.key}
                  role="option"
                  aria-selected={i === sel}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => exec(c)}
                  className={`flex items-center justify-between gap-4 px-4 py-1.5 ${
                    i === sel ? "bg-[var(--c-phosphor)] text-[#0b120e]" : ""
                  }`}
                >
                  <span className="truncate">
                    <span className="opacity-60">{c.key}</span>
                    <span className="mx-2 opacity-40">—</span>
                    {c.label}
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider opacity-60">{c.hint}</span>
                </li>
              ))}
            </ul>
            {flash && <div className="border-t border-[#1f3326] px-4 py-2 text-xs">&gt; {flash}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
