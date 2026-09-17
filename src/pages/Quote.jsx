import QuoteForm from "../components/QuoteForm";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { site, whatsappUrl } from "../data/site";

export default function Quote() {
  return (
    <>
      <Seo
        title={`Get a Custom Quote in ${site.city} | ${site.name}`}
        description={`Request a quote for LED sign boards, neon flex signs, 3D letters, vehicle branding, event boards or signage AMC from ${site.owner} at ${site.name}, ${site.city}.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Commission</p>
          <h1 className="mt-2 font-display text-4xl text-paper">Get a custom quote</h1>
          <p className="mt-4 max-w-2xl text-mute">
            Every piece is designed personally by {site.owner}. Share a brief here, or skip ahead on WhatsApp
            if you already know what you want.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-10 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]" delay={0.08}>
          <QuoteForm />
          <aside className="rounded-3xl border border-[#25D366]/40 bg-ink-2 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#25D366]">Faster path</p>
            <h2 className="mt-2 font-display text-2xl text-paper">Chat on WhatsApp</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Send a photo of the wall, the name, or a rough sketch. {site.owner} replies from {site.city}.
            </p>
            <p className="mt-4 text-sm text-paper">+91 {site.phones[0].label}</p>
            <p className="text-sm text-mute">Alt: +91 {site.phones[1].label}</p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 font-semibold text-ink"
            >
              Chat on WhatsApp
            </a>
          </aside>
        </ScrollReveal>
      </section>
    </>
  );
}
