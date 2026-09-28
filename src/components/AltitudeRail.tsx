import { SECTIONS } from "@/data";
import { goTo, useScrollProgress } from "@/lib/nav";

/** Fixed right-hand altitude gauge: a rocket climbs as you scroll; waypoints jump to sections. */
export function AltitudeRail({ active }: { active: string | null }) {
  const progress = useScrollProgress();

  return (
    <aside className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 min-[1400px]:block" aria-label="Section waypoints">
      <div className="relative flex h-[60vh] max-h-[520px] flex-col-reverse items-end justify-between py-1">
        <div className="absolute right-[5px] top-0 bottom-0 w-px bg-[var(--c-line-strong)]" />
        <div
          className="absolute right-[5px] bottom-0 w-px bg-[var(--c-mustard)]"
          style={{ height: `${progress * 100}%` }}
        />
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
              className="group relative z-10 flex items-center gap-3"
              aria-label={s.short}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-wider transition-all ${
                  on
                    ? "text-[var(--c-mustard)] opacity-100"
                    : "translate-x-1 text-[var(--c-dim)] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {s.short}
              </span>
              <span
                className={`block h-[11px] w-[11px] border transition-colors ${
                  on ? "border-[var(--c-mustard)] bg-[var(--c-mustard)]" : "border-[var(--c-line-strong)] bg-[var(--c-space)] group-hover:border-[var(--c-cream)]"
                }`}
              />
            </a>
          );
        })}
        {/* Rocket marker */}
        <svg
          viewBox="0 0 16 28"
          className="pointer-events-none absolute right-[-9px] h-7 w-4 transition-[top] duration-150"
          style={{ top: `calc(${(1 - progress) * 100}% - 14px)` }}
          aria-hidden
        >
          <path d="M8 0 C12 5 12 12 12 18 L4 18 C4 12 4 5 8 0Z" fill="var(--c-cream)" />
          <rect x="4" y="9" width="8" height="2" fill="var(--c-red)" />
          <path d="M4 14 L1 20 L4 19Z M12 14 L15 20 L12 19Z" fill="var(--c-red)" />
          <path d="M5.5 19 L8 26 L10.5 19Z" fill="var(--c-orange)" />
        </svg>
      </div>
    </aside>
  );
}
