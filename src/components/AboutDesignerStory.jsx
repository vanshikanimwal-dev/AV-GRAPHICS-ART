import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { site } from "../data/site";
import { useMediaQuery, usePrefersReducedMotion } from "../hooks/useMotionPrefs";

const lines = [
  `A graphic designer based in ${site.city}.`,
  `${site.owner} treats every board as a piece of type — not a template.`,
  "Lettering, spacing, and glow are composed by hand before fabrication.",
];

export default function AboutDesignerStory() {
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const pin = desktop && !reduced;
  const rootRef = useRef(null);
  const photoRef = useRef(null);
  const lineRefs = useRef([]);

  useLayoutEffect(() => {
    if (!pin) return undefined;
    let ctx;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const textLines = lineRefs.current.filter(Boolean);
        gsap.set(photoRef.current, { opacity: 0, y: 20 });
        gsap.set(textLines, { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 72px",
            end: "+=140%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(photoRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "none" }).to(
          textLines,
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.28, ease: "none" },
          ">-0.08"
        );
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pin]);

  const card = (
    <div className="grid min-w-0 items-center gap-8 rounded-3xl border border-white/8 bg-ink-2/80 p-5 sm:p-8 lg:grid-cols-[240px_1fr]">
      <img
        ref={photoRef}
        src="/logo.png?v=2"
        alt="AV Graphics Art logo"
        className="mx-auto h-44 w-full max-w-[220px] object-contain"
        style={pin ? { opacity: 0 } : undefined}
      />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-blue">About the designer</p>
        <h2
          ref={(el) => {
            lineRefs.current[0] = el;
          }}
          className="mt-2 font-display text-2xl text-paper"
          style={pin ? { opacity: 0 } : undefined}
        >
          {site.owner}
        </h2>
        <div className="mt-3 max-w-2xl space-y-2 text-sm leading-relaxed text-mute sm:text-base">
          {lines.map((line, i) => (
            <p
              key={line}
              ref={(el) => {
                lineRefs.current[i + 1] = el;
              }}
              style={pin ? { opacity: 0 } : undefined}
            >
              {line}
            </p>
          ))}
        </div>
        <Link
          ref={(el) => {
            lineRefs.current[lines.length + 1] = el;
          }}
          to="/about"
          className="mt-4 inline-block text-sm text-magenta hover:underline"
          style={pin ? { opacity: 0 } : undefined}
        >
          Read the studio story →
        </Link>
      </div>
    </div>
  );

  if (!pin) {
    return (
      <section className="site-wrap py-16">
        <ScrollReveal>{card}</ScrollReveal>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="site-wrap py-16">
      {card}
    </section>
  );
}
