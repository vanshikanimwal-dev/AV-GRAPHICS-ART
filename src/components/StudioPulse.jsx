import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { site } from "../data/site";

const stats = [
  { label: "Studio", value: "Geeta Colony" },
  { label: "Work types", value: "12" },
  { label: "Made", value: "By hand" },
  { label: "Quote", value: "To size" },
];

const tiles = [
  { src: "/work/workshop-j101.jpg", className: "mosaic-wide", alt: "AV Graphics Art workshop wall of signs" },
  { src: "/work/mahamaya-property.jpg", className: "", alt: "Mahamaya Property Dealer LED fascia" },
  { src: "/work/steel-lux-nails.jpg", className: "", alt: "LUX Nails Studio halo letters" },
  { src: "/work/steel-imed.jpg", className: "", alt: "iMED gold steel letters" },
  { src: "/work/anand-studio.jpg?v=3", className: "mosaic-tall", alt: `${site.owner} at the workshop` },
];

export default function StudioPulse() {
  return (
    <section className="site-wrap page-section">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">The studio</p>
        <h2 className="mt-2 font-display text-[clamp(1.2rem,3.8vw,2.25rem)] text-paper">A shop that lights the street</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
          {site.owner} draws, cuts and installs from {site.address}. The wall behind the desk is the catalog:
          name plates, neon flex, steel letters and boards waiting to go up.
        </p>
      </ScrollReveal>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="stat-chip">
            <p className="text-[10px] uppercase tracking-[0.2em] text-magenta">{item.label}</p>
            <p className="mt-1 font-display text-lg text-paper sm:text-xl">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mosaic mt-8">
        {tiles.map((tile) => (
          <Link key={tile.src} to="/gallery" className={`mosaic-tile ${tile.className}`}>
            <img src={tile.src} alt={tile.alt} />
          </Link>
        ))}
      </div>
    </section>
  );
}
