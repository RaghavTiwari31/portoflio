import { useId } from "react";

/**
 * Embroidered-style circular mission patch. `ringText` runs around the band,
 * `center` sits in the middle (initials, a rank, etc.).
 */
export function MissionPatch({
  ringText,
  center,
  color,
  footer,
  spin = false,
  className = "",
}: {
  ringText: string;
  center: string;
  color: string;
  footer?: string;
  spin?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const unit = `${ringText} ✦ `;
  const text = unit.length < 24 ? unit.repeat(2) : unit;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${ringText} patch`}>
      <defs>
        <path id={`ring-${id}`} d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        <clipPath id={`inner-${id}`}>
          <circle cx="100" cy="100" r="60" />
        </clipPath>
      </defs>

      {/* Outer stitched border + band */}
      <circle cx="100" cy="100" r="96" fill="var(--c-cream)" />
      <circle cx="100" cy="100" r="91" fill="var(--c-space)" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--c-cream)" strokeWidth="1" strokeDasharray="2 3" />

      <g style={spin ? { transformOrigin: "100px 100px", animation: "orbit 30s linear infinite" } : undefined}>
        <text fontFamily="IBM Plex Mono, monospace" fontSize="11" fontWeight="600" letterSpacing="2.4" fill="var(--c-cream)">
          <textPath href={`#ring-${id}`} startOffset="0" textLength="458" lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </g>

      {/* Inner field: sky, horizon stripes, orbit */}
      <circle cx="100" cy="100" r="62" fill={color} />
      <g clipPath={`url(#inner-${id})`}>
        <rect x="30" y="30" width="140" height="140" fill="var(--c-panel)" />
        <rect x="30" y="118" width="140" height="8" fill={color} />
        <rect x="30" y="130" width="140" height="6" fill={color} opacity="0.75" />
        <rect x="30" y="140" width="140" height="4" fill={color} opacity="0.5" />
        <rect x="30" y="148" width="140" height="30" fill={color} opacity="0.3" />
        <ellipse cx="100" cy="100" rx="56" ry="16" fill="none" stroke="var(--c-cream)" strokeWidth="1.2" transform="rotate(-18 100 100)" />
        {[
          [62, 62],
          [140, 70],
          [128, 50],
          [72, 90],
          [150, 100],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="2" height="2" fill="var(--c-cream)" />
        ))}
      </g>
      <circle cx="100" cy="100" r="62" fill="none" stroke="var(--c-cream)" strokeWidth="2" />

      <text
        x="100"
        y="112"
        textAnchor="middle"
        fontFamily="Big Shoulders Display, sans-serif"
        fontWeight="900"
        fontSize={center.length > 3 ? 30 : 38}
        fill="var(--c-cream)"
        letterSpacing="1"
      >
        {center}
      </text>
      {footer && (
        <g>
          <rect x="72" y="143" width="56" height="14" fill="var(--c-cream)" />
          <text x="100" y="153.5" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9.5" fontWeight="600" fill="var(--c-space)">
            {footer}
          </text>
        </g>
      )}
    </svg>
  );
}
