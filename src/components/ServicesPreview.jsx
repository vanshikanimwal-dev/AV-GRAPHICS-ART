import { Link } from "react-router-dom";
import { getProduct, homepagePreview } from "../data/products";
import ScrollReveal from "./ScrollReveal";

const shortLabels = {
  "neon-flex-signs": "Neon Flex",
  "3d-letters": "3D Letters",
  "backlit-signboards": "Backlit Signs",
  "flex-vinyl-banners": "Banners",
  "vehicle-branding": "Vehicle Branding",
  "office-branding": "Office Branding",
  "event-name-boards": "Event Boards",
  "trophies-mementos": "Trophies & Mementos",
  "photo-frames-canvas": "Canvas Prints",
  "laser-cutting": "Laser Engraving",
  "installation-amc": "Installation & AMC",
};

export default function ServicesPreview() {
  return (
    <section className="site-wrap py-8">
      <ScrollReveal>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Studio range</p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,4vw,2.25rem)] text-paper">Signage, print, events & fabrication</h2>
        </div>
        <Link to="/services" className="shrink-0 text-sm text-blue hover:underline">
          View All Services
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {homepagePreview.map((block) => (
          <div key={block.group} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-magenta">{block.group}</p>
            <ul className="mt-4 space-y-2">
              {block.items.map((id) => {
                const item = getProduct(id);
                if (!item) return null;
                return (
                  <li key={id}>
                    <Link to={`/products/${id}`} className="text-sm text-paper hover:text-magenta">
                      {shortLabels[id] || item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      </ScrollReveal>
    </section>
  );
}
