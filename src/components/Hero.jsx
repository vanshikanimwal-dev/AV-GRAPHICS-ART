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
  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.04, 0.88]);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, [reduced]);

  const slide = slides[index];

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden noise">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,106,0.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(61,224,255,0.12),transparent_40%)]"
        style={{ y: bgY }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-8">
        <motion.div style={{ opacity: textOpacity, y: textY }}>
          <p className="text-xs uppercase tracking-[0.28em] text-magenta">Delhi · Custom signage</p>
          <h1
            className={`mt-4 font-display text-4xl leading-tight text-paper sm:text-5xl lg:text-6xl ${
              reduced ? "glow-text" : "glow-text glow-text-settle"
            }`}
          >
            Custom Signs, Designed to Glow
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-paper/70">Designed to define your space</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            LED sign boards, neon flex, 3D letters, printing and branding — drawn by hand, built to light a room,
            a shopfront, or a name on a door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quote"
              className="btn-glow btn-glow-cta rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition hover:bg-magenta-soft"
            >
              Get a Custom Quote
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-blue/50 px-6 py-3 text-sm font-semibold text-blue transition hover:bg-blue/10"
            >
              Browse Products
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-white/5"
            >
              View All Services
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative will-change-transform"
          style={{ opacity: imageOpacity, y: imageY, scale: imageScale }}
        >
          <div className="glow-border mx-auto w-full max-w-xl overflow-hidden rounded-3xl bg-ink-2 lg:max-w-none">
            <div className="aspect-[16/11]">
              <ProductVisual
                key={slide.id}
                signText={slide.signText}
                accent={slide.accent}
                variant={slide.variant}
                lit
                className={`h-full ${reduced ? "" : "animate-pulse-glow"}`}
                label={`${slide.name} flagship photo — replace with real product photo`}
              />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-magenta">{slide.category}</p>
                <p className="mt-1 font-display text-sm text-paper">{slide.name}</p>
              </div>
              <div className="flex gap-2">
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
