import { useState } from "react";
import { Link } from "react-router-dom";
import { gallery } from "../data/gallery";

const featured = ["g27", "g29", "g32", "g33", "g25", "g2"]
  .map((id) => gallery.find((item) => item.id === id))
  .filter(Boolean);

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const item = featured[index];
  if (!item) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-ink-2">
      <div className="work-frame">
        <img src={item.image} alt={item.title} decoding="async" />
      </div>
      <div className="p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-magenta">{item.category}</p>
        <h3 className="mt-2 font-display text-lg text-paper sm:text-2xl">{item.title}</h3>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-mute">
            {index + 1} / {featured.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-magenta"
              onClick={() => setIndex((i) => (i - 1 + featured.length) % featured.length)}
            >
              Prev
            </button>
            <button
              type="button"
              className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-magenta"
              onClick={() => setIndex((i) => (i + 1) % featured.length)}
            >
              Next
            </button>
            <Link to="/gallery" className="rounded-full border border-white/15 px-4 py-2 text-sm text-blue hover:border-magenta">
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
