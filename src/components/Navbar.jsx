import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navLinks, site } from "../data/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-magenta/20 bg-[#0b0b0f]/82 pt-[env(safe-area-inset-top)] shadow-[0_1px_24px_rgba(255,45,106,0.12)] backdrop-blur-xl">
      <div className="site-wrap flex min-h-14 items-center justify-between gap-3 py-2 sm:min-h-16 sm:py-2.5">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/logo.png?v=2"
            alt="AV Graphics Art logo"
            className="brand-logo"
            width={62}
            height={48}
          />
          <span className="brand-name truncate font-display text-xs tracking-wide text-paper sm:text-base">
            {site.name}
          </span>
        </Link>

        <nav className="nav-desktop items-center gap-5 xl:gap-7" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm transition hover:text-paper ${isActive ? "text-paper" : "text-mute"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/quote"
            className="btn-glow rounded-full bg-magenta px-4 py-2 text-sm font-semibold text-white transition hover:bg-magenta-soft"
          >
            Get a Quote
          </Link>
        </nav>

        <div className="nav-mobile shrink-0 items-center gap-2">
          <Link
            to="/quote"
            className="btn-glow rounded-full bg-magenta px-2.5 py-1.5 text-[11px] font-semibold"
          >
            Quote
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-paper" />
              <span className="block h-0.5 w-5 bg-paper" />
              <span className="block h-0.5 w-5 bg-paper" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-drawer max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/8 bg-ink py-4">
          <div className="site-wrap flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-2 py-2 text-paper"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/quote"
              className="btn-glow rounded-full bg-magenta px-4 py-3 text-center font-semibold"
              onClick={() => setOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
