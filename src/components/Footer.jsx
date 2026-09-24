import { Link } from "react-router-dom";
import { site } from "../data/site";
import ScrollReveal from "./ScrollReveal";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <ScrollReveal y={36} className="footer-grid site-wrap">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img
              src="/logo.png?v=2"
              alt="AV Graphics Art logo"
              className="footer-logo"
              width={62}
              height={48}
            />
            <p className="footer-name">{site.name}</p>
          </div>
          <p className="footer-copy">
            Designed to define your space. Crystal, ACP, sparkle, glow and LED boards, letters,
            name plates, standees and digital prints in {site.city}. Every piece designed personally by {site.owner}.
          </p>
          <Link to="/quote" className="btn-glow btn-glow-cta footer-cta">
            Get a Custom Quote
          </Link>
          <SocialIcons className="footer-socials" />
        </div>

        <div className="footer-col">
          <p className="footer-heading">Visit</p>
          <ul className="footer-links">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/quote">Custom quote</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-heading">Contact</p>
          <ul className="footer-links">
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer">
                {site.address}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p.raw}>
                <a href={`tel:${p.tel}`}>+91 {p.label}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </ScrollReveal>
      <div className="site-footer-bar">
        © {new Date().getFullYear()} {site.name}, {site.city}. Handcrafted signs, designed to glow.
      </div>
    </footer>
  );
}
