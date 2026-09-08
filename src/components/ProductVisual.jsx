export default function ProductVisual({
  signText = "GLOW",
  accent = "#ff2d6a",
  variant = "board",
  lit = true,
  className = "",
  label,
}) {
  const opacity = lit ? 1 : 0.28;
  const glow = lit
    ? `drop-shadow(0 0 10px ${accent}) drop-shadow(0 0 28px ${accent}88)`
    : "none";

  return (
    <div
      className={`relative overflow-hidden bg-[#07070b] ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 70%, rgba(255,45,106,0.12), transparent 60%)",
      }}
    >
      <svg
        viewBox="0 0 400 260"
        className="h-full w-full"
        role="img"
        aria-label={label || `${signText} product preview — replace with real product photo`}
        style={{ filter: glow, opacity }}
      >
        {variant === "board" && (
          <>
            <rect x="38" y="58" width="324" height="144" rx="10" fill="#101018" stroke={accent} strokeWidth="5" />
            <rect x="52" y="72" width="296" height="116" rx="4" fill="#0b0b12" stroke={accent} strokeOpacity="0.45" />
            <text
              x="200"
              y="148"
              textAnchor="middle"
              fill={accent}
              fontFamily="Orbitron, sans-serif"
              fontSize="36"
              fontWeight="700"
              letterSpacing="8"
            >
              {signText}
            </text>
          </>
        )}
        {variant === "nameplate" && (
          <>
            <rect x="70" y="70" width="260" height="120" rx="8" fill="#16161f" stroke={accent} strokeWidth="3" />
            <rect x="86" y="84" width="228" height="92" rx="3" fill="none" stroke={accent} strokeOpacity="0.4" />
            <circle cx="96" cy="94" r="4" fill={accent} />
            <circle cx="304" cy="94" r="4" fill={accent} />
            <circle cx="96" cy="166" r="4" fill={accent} />
            <circle cx="304" cy="166" r="4" fill={accent} />
            <text
              x="200"
              y="144"
              textAnchor="middle"
              fill={accent}
              fontFamily="Orbitron, sans-serif"
              fontSize="32"
              fontWeight="700"
              letterSpacing="6"
            >
              {signText}
            </text>
          </>
        )}
        {variant === "neon" && (
          <>
            <path
              d="M70 170 C110 70, 170 70, 200 130 C230 70, 290 70, 330 170"
              fill="none"
              stroke={accent}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <text
              x="200"
              y="210"
              textAnchor="middle"
              fill={accent}
              fontFamily="Orbitron, sans-serif"
              fontSize="22"
              fontWeight="600"
              letterSpacing="10"
            >
              {signText}
            </text>
          </>
        )}
      </svg>
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-mute">
        Placeholder visual
      </span>
    </div>
  );
}
