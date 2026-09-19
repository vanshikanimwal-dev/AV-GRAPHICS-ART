import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { products } from "../data/products";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const slides = products.slice(0, 5);

export default function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], reduced ? [1, 1] : [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -48]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.75], reduced ? [1, 1] : [1, 0.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 0.92]);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [reduced]);

  const slide = slides[index];
  const cta =
    "inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 text-center text-sm font-semibold sm:w-auto";

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-stretch overflow-x-clip noise lg:items-center lg:overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,106,0.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(61,224,255,0.12),transparent_40%)]"
        style={{ y: bgY }}
      />
      <div className="site-wrap relative grid w-full flex-1 items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-8">
        <motion.div className="min-w-0" style={{ opacity: textOpacity, y: textY }}>
          <p className="text-[11px] uppercase tracking-[0.28em] text-magenta sm:text-xs">Delhi · Custom signage</p>
          <h1
            className={`mt-3 font-display text-[clamp(2.15rem,8vw,4.75rem)] leading-[1.08] text-paper sm:mt-4 ${
              reduced ? "glow-text" : "glow-text glow-text-settle"
            }`}
          >
            Custom Signs, Designed to Glow
          </h1>
          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-paper/70 sm:text-xs">
            Designed to define your space
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            LED sign boards, neon flex, 3D letters, printing and branding — drawn by hand, built to light a room,
            a shopfront, or a name on a door.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/quote" className={`btn-glow btn-glow-cta bg-magenta text-white transition hover:bg-magenta-soft ${cta}`}>
              Get a Custom Quote
            </Link>
            <Link
              to="/products"
              className={`border border-blue/50 text-blue transition hover:bg-blue/10 ${cta}`}
            >
              Browse Products
            </Link>
            <Link
              to="/services"
              className={`border border-white/20 text-paper transition hover:bg-white/5 ${cta}`}
            >
              View All Services
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative min-w-0 w-full will-change-transform"
          style={{ opacity: imageOpacity, y: imageY, scale: imageScale }}
        >
          <div className="glow-border w-full overflow-hidden rounded-2xl bg-ink-2 sm:rounded-3xl">
            <div className="aspect-[16/11] w-full">
              <ProductVisual
                key={slide.id}
                signText={slide.signText}
                accent={slide.accent}
                variant={slide.variant}
                lit
                className={`h-full w-full ${reduced ? "" : "animate-pulse-glow"}`}
                label={`${slide.name} flagship photo — replace with real product photo`}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-magenta">{slide.category}</p>
                <p className="mt-1 truncate font-display text-sm text-paper">{slide.name}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Show ${s.name}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-magenta" : "bg-white/20"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
