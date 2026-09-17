import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduced ? 400 : 120,
    damping: reduced ? 40 : 28,
    restDelta: 0.001,
  });

  return (
    <div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[3px] bg-white/5"
      aria-hidden="true"
    >
      <motion.div
        className="h-full origin-left bg-magenta"
        style={{
          scaleX,
          boxShadow: "0 0 12px rgba(255,45,106,0.85), 0 0 22px rgba(61,224,255,0.35)",
        }}
      />
    </div>
  );
}
