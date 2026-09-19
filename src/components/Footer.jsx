import { Link } from "react-router-dom";
import { site } from "../data/site";
import ScrollReveal from "./ScrollReveal";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/8 bg-[#08080c]">
      <ScrollReveal y={36} className="footer-grid site-wrap py-10 sm:py-14">
        <div className="footer-brand">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/logo.png?v=2" alt="AV Graphics Art logo" className="h-10 w-auto shrink-0 bg-transparent object-contain sm:h-14" />
            <p className="min-w-0 truncate font-display text-paper">{site.name}</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
            Designed to define your space. LED sign boards, neon flex, printing, branding,
            events and fabrication in {site.city}. Every piece designed personally by {site.owner}.
          </p>
          <Link
            to="/quote"
            className="btn-glow btn-glow-cta mt-5 inline-flex rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold"
          >
            Get a Custom Quote
          </Link>
          <form
            className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(site.instagramUrl, "_blank", "noreferrer");
            }}
          >
            <label className="sr-only" htmlFor="ig-follow">
              Follow us on Instagram
            </label>
            <input
              id="ig-follow"
              type="email"
              required
              placeholder="Follow us on Instagram"
              className="w-full min-w-0 rounded-full border border-white/10 bg-ink-2 px-4 py-2.5 text-base outline-none ring-magenta/40 placeholder:text-mute/70 focus:ring-2 sm:text-sm"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-magenta px-4 py-2 text-sm font-semibold"
            >
              {site.instagram}
            </button>
          </form>
          <p className="mt-4 flex min-w-0 flex-col gap-3 text-sm text-mute sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <SocialIcons />
            <a href={`mailto:${site.email}`} className="break-all hover:text-paper">
              {site.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-magenta">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li><Link to="/products" className="hover:text-paper">Products</Link></li>
            <li><Link to="/services" className="hover:text-paper">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-paper">Gallery</Link></li>
            <li><Link to="/quote" className="hover:text-paper">Custom quote</Link></li>
            <li><Link to="/about" className="hover:text-paper">About</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-magenta">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li>{site.address}</li>
            {site.phones.map((p) => (
              <li key={p.raw}>
                <a href={`tel:${p.tel}`} className="hover:text-paper">
                  +91 {p.label}
                </a>
              </li>
            ))}
            <li className="break-all">
              <a href={`mailto:${site.email}`} className="hover:text-paper">
                {site.email}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
          <SocialIcons className="mt-5" />
        </div>
      </ScrollReveal>
      <div className="border-t border-white/8 py-5 text-center text-xs text-mute">
        © {new Date().getFullYear()} {site.name}, {site.city}. Handcrafted signs, designed to glow.
      </div>
    </footer>
  );
}
