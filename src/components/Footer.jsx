import { Link } from "react-router-dom";
import { site, whatsappUrl } from "../data/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/8 bg-[#08080c]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="AV Graphics Art logo" className="h-12 w-12 rounded-xl object-cover" />
            <p className="font-display text-paper">{site.name}</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
            Handcrafted LED light boards, nameplates, and neon-style plates in {site.city}.
            Every piece designed personally by {site.owner}.
          </p>
          <form
            className="mt-6 flex max-w-md gap-2"
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
              className="w-full rounded-full border border-white/10 bg-ink-2 px-4 py-2.5 text-sm outline-none ring-magenta/40 placeholder:text-mute/70 focus:ring-2"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-magenta px-4 py-2 text-sm font-semibold"
            >
              {site.instagram}
            </button>
          </form>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-magenta">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-mute">
            <li><Link to="/products" className="hover:text-paper">Products</Link></li>
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
            <li>{site.hours}</li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-paper">
                {site.instagram}
              </a>
            </li>
          </ul>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-ink"
          >
            WhatsApp us
          </a>
        </div>
      </div>
      <div className="border-t border-white/8 py-5 text-center text-xs text-mute">
        © {new Date().getFullYear()} {site.name}, {site.city}. Handcrafted signs, designed to glow.
      </div>
    </footer>
  );
}
