import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { getProduct } from "../data/products";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const slides = ["studio-name-board", "sparkle-board", "office-branding", "neon-logo-wall", "brass-classic"]
  .map(getProduct)
  .filter(Boolean);

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
    "inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 py-2.5 text-center text-xs font-semibold sm:min-h-12 sm:w-auto sm:px-6 sm:py-3 sm:text-sm";

  return (
    <section
      ref={sectionRef}
      className="hero-shell relative flex items-stretch overflow-hidden noise lg:items-center"
    >
      <motion.div
        className="hero-wash absolute inset-0"
        style={{ y: bgY }}
      />
      <p className="hero-watermark" aria-hidden="true">
        AV
      </p>
      <div className="site-wrap relative z-[1] grid w-full flex-1 items-center gap-5 py-6 sm:gap-10 sm:py-12 lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-8">
        <motion.div className="min-w-0" style={{ opacity: textOpacity, y: textY }}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-magenta sm:text-xs sm:tracking-[0.28em]">Delhi · Custom signage</p>
          <h1
            className={`mt-2 font-display text-[clamp(1.45rem,6.4vw,4.75rem)] leading-[1.12] text-paper sm:mt-4 ${
              reduced ? "glow-text" : "glow-text glow-text-settle"
            }`}
          >
            Custom Signs, Designed to Glow
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-paper/70 sm:mt-3 sm:text-xs sm:tracking-[0.22em]">
            Designed to define your space · Geeta Colony
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute sm:mt-5 sm:text-base lg:text-lg">
            Crystal, ACP, sparkle, glow and LED boards, acrylic plates, plastic and steel letters,
            name plates, moving displays, standees and digital prints, drawn by hand, built to light a room,
            a shopfront, or a name on a door.
          </p>
          <div className="hero-chip-row">
            <span className="hero-chip">Handmade lettering</span>
            <span className="hero-chip">Quoted to size</span>
            <span className="hero-chip">Installed in Delhi</span>
          </div>
          <div className="mt-5 flex w-full flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
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
          <div className="hero-bloom" aria-hidden="true" />
          <div className="hero-frame glow-border overflow-hidden rounded-xl bg-ink-2 sm:rounded-3xl">
            <div className="hero-media">
              <ProductVisual
                key={slide.id}
                signText={slide.signText}
                accent={slide.accent}
                variant={slide.variant}
                image={slide.image}
                lit
                className="h-full w-full"
                label={`${slide.name} flagship photo`}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-magenta sm:text-[11px] sm:tracking-[0.2em]">{slide.category}</p>
                <p className="mt-0.5 truncate font-display text-xs text-paper sm:mt-1 sm:text-sm">{slide.name}</p>
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
