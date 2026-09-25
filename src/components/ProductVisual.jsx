function SignText({ x = 200, y = 148, accent, size = 28, tracking = 6, children }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={accent}
      fontFamily="Orbitron, sans-serif"
      fontSize={size}
      fontWeight="700"
      letterSpacing={tracking}
    >
      {children}
    </text>
  );
}

export default function ProductVisual({
  signText = "GLOW",
  accent = "#ff2d6a",
  variant = "board",
  lit = true,
  className = "",
  label,
  image,
  fit = "cover",
}) {
  if (image) {
    return (
      <div className={`media-frame ${className}`}>
        <img
          src={image}
          alt={label || signText}
          className={`absolute inset-0 h-full w-full max-w-none object-center ${fit === "contain" ? "object-contain" : "object-cover"}`}
          decoding="async"
          style={{
            filter: lit ? "none" : "brightness(0.58) saturate(0.8)",
            transition: "filter 0.45s ease",
          }}
        />
      </div>
    );
  }

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
        aria-label={label || `${signText} product preview`}
        style={{ filter: glow, opacity }}
      >
        {variant === "board" && (
          <>
            <rect x="38" y="58" width="324" height="144" rx="10" fill="#101018" stroke={accent} strokeWidth="5" />
            <rect x="52" y="72" width="296" height="116" rx="4" fill="#0b0b12" stroke={accent} strokeOpacity="0.45" />
            <SignText accent={accent} size={36} tracking={8}>
              {signText}
            </SignText>
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
            <SignText accent={accent} size={32} y={144}>
              {signText}
            </SignText>
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
            <SignText accent={accent} size={22} y={210} tracking={10}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "letters3d" && (
          <>
            <rect x="48" y="48" width="304" height="164" fill="#12121a" stroke="#f4f1ea22" />
            <path d="M92 168 L118 92 L148 168 Z" fill="#1a1a24" stroke={accent} strokeWidth="2" />
            <path d="M160 168 L188 88 L216 168 Z" fill="#16161f" stroke={accent} strokeWidth="2" />
            <path d="M228 168 L268 96 L304 168 Z" fill="#1c1c28" stroke={accent} strokeWidth="2" />
            <line x1="118" y1="92" x2="128" y2="78" stroke={accent} strokeOpacity="0.5" />
            <line x1="188" y1="88" x2="198" y2="74" stroke={accent} strokeOpacity="0.5" />
            <SignText accent={accent} size={16} y={208} tracking={8}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "backlit" && (
          <>
            <rect x="70" y="62" width="260" height="118" rx="4" fill="#101018" stroke={accent} strokeWidth="3" />
            <rect x="82" y="74" width="236" height="94" fill="#0b0b12" />
            <ellipse cx="200" cy="188" rx="118" ry="10" fill={accent} opacity="0.35" />
            <SignText accent={accent} size={28} y={132}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "videowall" && (
          <>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3, 4, 5].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={52 + col * 50}
                  y={48 + row * 42}
                  width="44"
                  height="36"
                  fill={col % 2 === row % 2 ? accent : "#14141c"}
                  opacity={col % 2 === row % 2 ? 0.85 : 1}
                />
              ))
            )}
            <SignText accent="#f4f1ea" size={18} y={232} tracking={8}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "solar" && (
          <>
            <rect x="148" y="28" width="104" height="52" fill="#0c1220" stroke="#3de0ff" strokeWidth="2" />
            <path d="M148 28 L200 18 L252 28" fill="none" stroke="#3de0ff" />
            <rect x="188" y="80" width="24" height="18" fill="#222" />
            <rect x="64" y="98" width="272" height="108" rx="6" fill="#101018" stroke={accent} strokeWidth="3" />
            <SignText accent={accent} size={24} y={164}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "banner" && (
          <>
            <polygon points="48,58 352,58 336,196 64,196" fill="#14141c" stroke={accent} strokeWidth="3" />
            <line x1="80" y1="58" x2="72" y2="36" stroke="#888" />
            <line x1="320" y1="58" x2="328" y2="36" stroke="#888" />
            <circle cx="72" cy="34" r="5" fill={accent} />
            <circle cx="328" cy="34" r="5" fill={accent} />
            <SignText accent={accent} size={26} y={140}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "vehicle" && (
          <>
            <rect x="46" y="110" width="308" height="72" rx="18" fill="#16161f" stroke={accent} strokeWidth="3" />
            <rect x="70" y="122" width="70" height="36" rx="4" fill="#0b0b12" />
            <rect x="250" y="122" width="80" height="36" rx="4" fill="#0b0b12" />
            <circle cx="110" cy="190" r="18" fill="#222" stroke={accent} />
            <circle cx="300" cy="190" r="18" fill="#222" stroke={accent} />
            <SignText accent={accent} size={18} y={96} tracking={4}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "office" && (
          <>
            <rect x="40" y="40" width="320" height="180" fill="#12121a" stroke="#f4f1ea22" />
            <rect x="58" y="58" width="120" height="150" fill="#0b0b12" stroke={accent} strokeOpacity="0.35" />
            <rect x="200" y="70" width="140" height="70" fill="#16161f" stroke={accent} />
            <rect x="220" y="160" width="100" height="36" fill="#1a1a24" />
            <SignText accent={accent} size={16} y={112} x={270} tracking={3}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "stationery" && (
          <>
            <rect x="70" y="70" width="160" height="100" rx="4" fill="#f4f1ea" />
            <rect x="90" y="92" width="90" height="6" fill={accent} />
            <rect x="90" y="108" width="120" height="4" fill="#222" opacity="0.4" />
            <rect x="90" y="120" width="80" height="4" fill="#222" opacity="0.3" />
            <rect x="248" y="88" width="90" height="128" fill="#16161f" stroke={accent} />
            <SignText accent={accent} size={14} y={54} tracking={4}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "event" && (
          <>
            <rect x="88" y="40" width="224" height="168" rx="8" fill="#14141c" stroke={accent} strokeWidth="3" />
            <path d="M120 88 Q200 48 280 88" fill="none" stroke={accent} strokeWidth="4" />
            <SignText accent={accent} size={18} y={148} tracking={3}>
              {signText}
            </SignText>
            <rect x="150" y="208" width="100" height="10" fill="#222" />
          </>
        )}
        {variant === "trophy" && (
          <>
            <path d="M150 70 H250 L238 130 H162 Z" fill="#16161f" stroke={accent} strokeWidth="3" />
            <rect x="176" y="130" width="48" height="36" fill="#1a1a24" stroke={accent} />
            <rect x="148" y="166" width="104" height="28" fill="#12121a" stroke={accent} />
            <SignText accent={accent} size={14} y={186} tracking={3}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "canvas" && (
          <>
            <rect x="90" y="42" width="220" height="168" fill="#1a1a24" stroke={accent} strokeWidth="10" />
            <rect x="112" y="64" width="176" height="124" fill="#0f0f16" />
            <path d="M130 160 L180 110 L230 148 L270 98" fill="none" stroke={accent} strokeWidth="3" />
            <SignText accent={accent} size={14} y={236} tracking={4}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "laser" && (
          <>
            <rect x="70" y="70" width="260" height="130" fill="#14141c" stroke="#3de0ff" />
            <path d="M110 160 L160 96 L210 150 L250 112 L300 158" fill="none" stroke={accent} strokeWidth="2" />
            <line x1="200" y1="48" x2="200" y2="160" stroke="#3de0ff" strokeWidth="2" />
            <circle cx="200" cy="160" r="5" fill="#3de0ff" />
            <SignText accent={accent} size={16} y={228} tracking={6}>
              {signText}
            </SignText>
          </>
        )}
        {variant === "install" && (
          <>
            <rect x="80" y="50" width="240" height="90" rx="6" fill="#101018" stroke={accent} strokeWidth="3" />
            <SignText accent={accent} size={20} y={104}>
              {signText}
            </SignText>
            <rect x="168" y="140" width="64" height="70" fill="#1a1a24" />
            <circle cx="130" cy="196" r="16" fill="#16161f" stroke={accent} />
            <circle cx="270" cy="196" r="16" fill="#16161f" stroke={accent} />
            <rect x="118" y="180" width="24" height="32" fill={accent} opacity="0.7" />
          </>
        )}
      </svg>
    </div>
  );
}
