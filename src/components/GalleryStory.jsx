import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import ScrollReveal from "./ScrollReveal";
import { gallery } from "../data/gallery";
import { site } from "../data/site";
import { useMediaQuery, usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const items = gallery.slice(0, 8);

export default function GalleryStory() {
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const horizontal = desktop && !reduced;
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return undefined;
    const measure = () => {
      if (!trackRef.current) return;
      const extra = Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 48);
      setTravel(extra);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [horizontal]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  const header = (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-blue">Instagram</p>
        <h2 className="mt-2 font-display text-xl text-paper sm:text-3xl">Past work</h2>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 text-sm sm:items-end sm:flex-row sm:gap-4">
        <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="text-magenta">
          {site.instagram}
        </a>
        <a href={site.facebookUrl} target="_blank" rel="noreferrer" className="text-mute hover:text-paper">
          Facebook
        </a>
      </div>
    </div>
  );

  if (!horizontal) {
    return (
      <section className="site-wrap page-section">
        <ScrollReveal>{header}</ScrollReveal>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.05}>
              <Link to="/gallery" className="overflow-hidden rounded-xl border border-white/8">
                <ProductVisual
                  signText={item.signText}
                  accent={item.accent}
                  variant={item.variant}
                  className="aspect-square"
                  label={`${item.title}. replace with real product photo`}
                />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${Math.max(travel, 400)}px)` }}
    >
      <div className="sticky top-[72px] flex h-[calc(100svh-72px)] flex-col justify-center overflow-hidden">
        <div className="site-wrap mb-8">{header}</div>
        <motion.div ref={trackRef} className="flex w-max gap-4 px-6 will-change-transform" style={{ x }}>
          {items.map((item) => (
            <Link
              key={item.id}
              to="/gallery"
              className="w-[min(72vw,22rem)] shrink-0 overflow-hidden rounded-2xl border border-white/8"
            >
              <ProductVisual
                signText={item.signText}
                accent={item.accent}
                variant={item.variant}
                className="aspect-square"
                label={`${item.title}. replace with real product photo`}
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
