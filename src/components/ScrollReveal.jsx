import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const ease = [0.22, 1, 0.36, 1];

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  once = true,
  as = "div",
}) {
  const Tag = motion[as] || motion.div;
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      animate={
        inView
          ? reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y }
      }
      transition={{ duration: reduced ? 0.28 : 0.65, delay, ease }}
    >
      {children}
    </Tag>
  );
}
