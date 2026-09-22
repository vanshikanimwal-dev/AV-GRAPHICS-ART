import { useMemo, useState } from "react";
import ProductVisual from "../components/ProductVisual";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { gallery } from "../data/gallery";
import { site, workTypesCopy } from "../data/site";

const galleryFilters = ["All", ...new Set(gallery.map((g) => g.category))];

function tileAspect(item, index) {
  if (item.aspect === "wide") return "aspect-[16/10]";
  if (item.aspect === "tall") return "aspect-[4/5]";
  if (item.aspect === "square") return "aspect-square";
  return index % 3 === 0 ? "aspect-[4/5]" : "aspect-[16/11]";
}

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
        description={`Gallery of ${workTypesCopy} by ${site.owner} in ${site.city}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-blue">Portfolio</p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">Gallery</h1>
          <p className="page-copy mt-3 text-sm text-mute sm:text-base">
            Completed boards, letters, name plates and prints from the studio. Tap a tile for a larger view.
          </p>
        </ScrollReveal>
        <div className="chip-row mt-8">
          {galleryFilters.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm ${
                filter === c ? "bg-blue text-ink" : "border border-white/15 text-mute"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ScrollReveal className="gallery-masonry mt-10" y={24}>
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              className="mb-4 block w-full overflow-hidden rounded-2xl border border-white/8"
              style={{ breakInside: "avoid" }}
            >
              <div className={`relative overflow-hidden ${tileAspect(item, i)}`}>
              <ProductVisual
                image={item.image}
                className="absolute inset-0 h-full w-full"
                label={item.title}
              />
              </div>
              <div className="bg-ink-2 px-4 py-3 text-left">
                <p className="text-xs uppercase tracking-wider text-magenta">{item.category}</p>
                <p className="mt-1 text-sm text-paper">{item.title}</p>
              </div>
            </button>
          ))}
        </ScrollReveal>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 sm:p-6"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-magenta/40 bg-ink sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <ProductVisual
              image={active.image}
              fit="contain"
              className="h-[min(70svh,32rem)] w-full"
              label={active.title}
            />
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <p className="min-w-0 truncate text-sm text-paper sm:text-base">{active.title}</p>
              <button type="button" className="shrink-0 text-sm text-mute" onClick={() => setActive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
