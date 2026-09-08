import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { products } from "../data/products";

const slides = products.slice(0, 5);

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden noise">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,45,106,0.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(61,224,255,0.12),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.28em] text-magenta">Delhi · Custom signage</p>
          <h1 className="glow-text mt-4 font-display text-4xl leading-tight text-paper sm:text-5xl lg:text-6xl">
            Custom Signs, Designed to Glow
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            LED light boards, nameplates, and neon-style plates — drawn by hand, built to light a room,
            a shopfront, or a name on a door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quote"
              className="btn-glow rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition hover:bg-magenta-soft"
            >
              Get a Custom Quote
            </Link>
            <Link
              to="/products"
              className="rounded-full border border-blue/50 px-6 py-3 text-sm font-semibold text-blue transition hover:bg-blue/10"
            >
              Browse Products
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="glow-border overflow-hidden rounded-3xl bg-ink-2">
            <div className="aspect-[16/11]">
              <ProductVisual
                key={slide.id}
                signText={slide.signText}
                accent={slide.accent}
                variant={slide.variant}
                lit
                className="h-full animate-pulse-glow"
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
        </div>
      </div>
    </section>
  );
}
