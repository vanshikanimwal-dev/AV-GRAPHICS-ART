import { useState } from "react";
import Seo from "../components/Seo";
import { site, whatsappUrl } from "../data/site";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Seo
        title={`Contact ${site.name} in ${site.city} | LED Signs & Neon`}
        description={`Call, WhatsApp, or visit ${site.name} in ${site.city}. Custom LED boards and neon plates by ${site.owner}.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">Delhi</p>
        <h1 className="mt-2 font-display text-4xl text-paper">Contact</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title={`Map of ${site.city} — replace with exact studio location`}
                src={site.mapEmbed}
                className="h-72 w-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
            <ul className="space-y-2 text-sm text-mute">
              <li className="text-paper">{site.address} — map placeholder until a street address is set</li>
              {site.phones.map((p) => (
                <li key={p.raw}>
                  Phone / WhatsApp:{" "}
                  <a className="text-magenta" href={`tel:${p.tel}`}>
                    +91 {p.label}
                  </a>
                </li>
              ))}
              <li>
                Instagram:{" "}
                <a className="text-blue" href={site.instagramUrl} target="_blank" rel="noreferrer">
                  {site.instagram}
                </a>
              </li>
              <li>Hours: {site.hours}</li>
              <li>{site.hoursNote}</li>
            </ul>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#25D366] px-5 py-3 font-semibold text-ink"
            >
              WhatsApp {site.name}
            </a>
          </div>

          <form
            className="space-y-4 rounded-3xl border border-white/10 bg-ink-2 p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <p className="text-paper">Message noted. For a faster reply, continue on WhatsApp.</p>
            ) : (
              <>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Name</span>
                  <input required className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Phone or email</span>
                  <input required className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Message</span>
                  <textarea required rows={5} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3" />
                </label>
                <button type="submit" className="btn-glow w-full rounded-full bg-magenta py-3 font-semibold">
                  Send message
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
