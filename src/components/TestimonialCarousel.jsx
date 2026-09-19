import { useState } from "react";
import { testimonials } from "../data/testimonials";

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  return (
    <div className="glow-border rounded-3xl bg-ink-2 p-5 sm:p-12">
      <div className="flex gap-1 text-amber" aria-label="5 star rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <blockquote className="mt-4 font-display text-base leading-relaxed text-paper sm:mt-6 sm:text-2xl">
        “{item.quote}”
      </blockquote>
      <p className="mt-6 text-sm text-magenta">{item.name}</p>
      <p className="text-sm text-mute">{item.role}</p>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-mute">
          {index + 1} / {testimonials.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-magenta"
            onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-magenta"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
