import QuoteForm from "../components/QuoteForm";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import SocialIcons from "../components/SocialIcons";
import { site, workTypesCopy } from "../data/site";

export default function Quote() {
  return (
    <>
      <Seo
        title={`Get a Custom Quote in ${site.city} | ${site.name}`}
        description={`Request a quote for ${workTypesCopy} from ${site.owner} at ${site.name}, ${site.city}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Commission</p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">Get a custom quote</h1>
          <p className="page-copy mt-4 text-sm leading-relaxed text-mute sm:text-base">
            Every piece is designed personally by {site.owner}. Share a brief here, or skip ahead on WhatsApp
            if you already know what you want.
          </p>
        </ScrollReveal>

        <ScrollReveal className="quote-layout mt-8 sm:mt-10" delay={0.08}>
          <QuoteForm />
          <aside className="form-card min-w-0 rounded-3xl border border-[#25D366]/40 bg-ink-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[#25D366]">Faster path</p>
            <h2 className="mt-2 font-display text-xl text-paper sm:text-2xl">Chat on WhatsApp</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Send a photo of the wall, the name, or a rough sketch. {site.owner} replies from {site.city}.
            </p>
            <p className="mt-4 text-sm text-paper">+91 {site.phones[0].label}</p>
            <p className="text-sm text-mute">Alt: +91 {site.phones[1].label}</p>
            <p className="mt-2 break-all text-sm text-mute">
              <a href={`mailto:${site.email}`} className="hover:text-paper">
                {site.email}
              </a>
            </p>
            <SocialIcons className="mt-4" />
          </aside>
        </ScrollReveal>
      </section>
    </>
  );
}
