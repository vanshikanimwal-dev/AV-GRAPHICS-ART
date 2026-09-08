import { useMemo, useState } from "react";
import ProductVisual from "../components/ProductVisual";
import Seo from "../components/Seo";
import { gallery } from "../data/gallery";
import { categories, site } from "../data/site";

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const items = useMemo(
    () => gallery.filter((g) => filter === "All" || g.category === filter),
    [filter]
  );

  return (
    <>
      <Seo
        title={`Portfolio of Custom Signs in ${site.city} | ${site.name}`}
        description={`Gallery of LED boards, nameplates, and neon plates by ${site.owner} in ${site.city}.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-blue">Portfolio</p>
        <h1 className="mt-2 font-display text-4xl text-paper">Gallery</h1>
        <p className="mt-3 max-w-2xl text-mute">
          Placeholder compositions of completed work. Tap a tile for a larger view; swap in photographs when ready.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === c ? "bg-blue text-ink" : "border border-white/15 text-mute"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="mb-4 block w-full overflow-hidden rounded-2xl border border-white/8"
              style={{ breakInside: "avoid" }}
            >
              <ProductVisual
                signText={item.signText}
                accent={item.accent}
                variant={item.variant}
                className={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[16/11]"}
                label={`${item.title} — replace with real product photo`}
              />
              <div className="bg-ink-2 px-4 py-3 text-left">
                <p className="text-xs uppercase tracking-wider text-magenta">{item.category}</p>
                <p className="mt-1 text-sm text-paper">{item.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className="max-w-3xl overflow-hidden rounded-3xl border border-magenta/40 bg-ink" onClick={(e) => e.stopPropagation()}>
            <ProductVisual
              signText={active.signText}
              accent={active.accent}
              variant={active.variant}
              className="aspect-video w-[min(90vw,48rem)]"
              label={`${active.title} lightbox — replace with real product photo`}
            />
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-paper">{active.title}</p>
              <button type="button" className="text-sm text-mute" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
