export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--neon-violet)]/20 blur-[120px] animate-float" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--neon-cyan)]/15 blur-[140px] animate-float-2" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[var(--neon-emerald)]/10 blur-[120px] animate-float" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--background)_80%)]" />
    </div>
  );
}
