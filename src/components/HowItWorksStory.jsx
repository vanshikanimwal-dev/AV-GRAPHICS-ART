import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const steps = [
  { n: "01", title: "Consult", copy: "Share the space, the words, and the feeling you want after dark.", accent: "#ff2d6a" },
  { n: "02", title: "Design", copy: "Anand draws the lettering, color, and scale before anything is cut.", accent: "#3de0ff" },
  { n: "03", title: "Approve", copy: "You review the artwork. We refine until the glow is right.", accent: "#ffb020" },
  { n: "04", title: "Delivered", copy: "Fabricated, packed, and installed or shipped across Delhi.", accent: "#ff5c8a" },
];

const thresholds = [0.08, 0.32, 0.58, 0.82];

export default function HowItWorksStory() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(reduced ? 3 : -1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    const next = thresholds.reduce((acc, t, i) => (v >= t ? i : acc), -1);
    setActiveIndex(next);
  });

  return (
    <section ref={ref} className="site-wrap py-16">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.24em] text-amber">How it works</p>
        <h2 className="mt-2 font-display text-[clamp(1.35rem,4.5vw,2.25rem)] leading-tight text-paper">
          Consult → Design → Approve → Delivered
        </h2>
      </ScrollReveal>

      <div className="relative mt-10 hidden lg:block">
        <svg viewBox="0 0 1000 80" className="mb-2 h-16 w-full overflow-visible" aria-hidden="true">
          <path d="M80 40 H920" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
          <motion.path
            d="M80 40 H920"
            stroke="url(#how-glow)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{ pathLength: reduced ? 1 : pathLength }}
          />
          <defs>
            <linearGradient id="how-glow" x1="0" x2="1">
              <stop offset="0%" stopColor="#ff2d6a" />
              <stop offset="50%" stopColor="#3de0ff" />
              <stop offset="100%" stopColor="#ffb020" />
            </linearGradient>
          </defs>
          {steps.map((step, i) => {
            const x = 80 + i * 280;
            const on = reduced || activeIndex >= i;
            return (
              <motion.circle
                key={step.n}
                cx={x}
                cy="40"
                r="9"
                fill="#0b0b0f"
                stroke={step.accent}
                strokeWidth="2"
                animate={{ scale: on ? 1.15 : 0.85, opacity: on ? 1 : 0.35 }}
                style={{ transformOrigin: `${x}px 40px` }}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const on = reduced || activeIndex >= i;
          return (
            <motion.div
              key={step.n}
              className="rounded-2xl border bg-ink-2 p-5"
              animate={{
                opacity: on ? 1 : 0.4,
                scale: reduced ? 1 : on ? 1 : 0.96,
                borderColor: on ? `${step.accent}aa` : "rgba(255,255,255,0.08)",
                boxShadow: on ? `0 0 22px ${step.accent}40` : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display" style={{ color: on ? step.accent : "#b7b4c4" }}>
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-lg text-paper">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{step.copy}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
