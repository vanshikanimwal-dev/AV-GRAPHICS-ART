import { Link } from "react-router-dom";
import { getProduct, homepagePreview } from "../data/products";
import ScrollReveal from "./ScrollReveal";

const shortLabels = {
  "crystal-board": "Crystal Board",
  "acp-board": "ACP Board",
  "sparkle-board": "Sparkle Board",
  "backlit-signboards": "Glow Sign Board",
  "aurora-shopfront": "LED Board",
  "acrylic-door-plate": "Acrylic Plates",
  "3d-letters": "Plastic Letter",
  "steel-letter": "Steel Letter",
  "brass-classic": "Name Plate",
  "led-video-walls": "Moving Display",
  standee: "Standee",
  "flex-vinyl-banners": "Digital Prints",
};

export default function ServicesPreview() {
  return (
    <section className="site-wrap page-section">
      <ScrollReveal>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Studio range</p>
          <h2 className="mt-2 font-display text-[clamp(1.2rem,3.8vw,2.25rem)] text-paper">Boards, letters, plates & print</h2>
        </div>
        <Link to="/services" className="shrink-0 text-sm text-blue hover:underline">
          View All Services
        </Link>
      </div>
      <div className="service-blocks">
        {homepagePreview.map((block) => (
          <div key={block.group} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-magenta">{block.group}</p>
            <ul className="mt-4 space-y-3">
              {block.items.map((id) => {
                const item = getProduct(id);
                if (!item) return null;
                return (
                  <li key={id}>
                    <Link to={`/products/${id}`} className="flex min-w-0 items-center gap-3 text-sm text-paper hover:text-magenta">
                      {item.image ? (
                        <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink">
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </span>
                      ) : (
                        <span className="h-11 w-11 shrink-0 rounded-lg border border-white/10 bg-ink" />
                      )}
                      <span>{shortLabels[id] || item.name}</span>
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
