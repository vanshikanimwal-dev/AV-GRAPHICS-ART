import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import ScrollReveal from "../components/ScrollReveal";
import SocialIcons from "../components/SocialIcons";
import { site, workTypesCopy } from "../data/site";
import { postJson, wakeApi } from "../lib/api";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  useEffect(() => {
    wakeApi();
  }, []);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await postJson("/api/contact", form);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send the message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo
        title={`Contact ${site.name} in ${site.city} | Boards, Letters & Prints`}
        description={`Call, WhatsApp, or visit ${site.name} in ${site.city} for ${workTypesCopy} by ${site.owner}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Geeta Colony · Delhi</p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">Contact</h1>
        </ScrollReveal>

        <ScrollReveal className="mt-8 space-y-4 text-sm text-mute" delay={0.04}>
          <ul className="space-y-2">
            <li className="text-paper">
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-magenta">
                {site.address}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p.raw}>
                Phone:{" "}
                <a className="text-magenta" href={`tel:${p.tel}`}>
                  +91 {p.label}
                </a>
              </li>
            ))}
            <li className="break-all">
              Email:{" "}
              <a className="text-blue" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>Hours: {site.hours}</li>
            <li>{site.hoursNote}</li>
          </ul>
          <SocialIcons className="pt-1" />
        </ScrollReveal>

        <ScrollReveal className="two-col mt-8" delay={0.08}>
          <form className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2" onSubmit={onSubmit}>
            {sent ? (
              <p className="text-paper">Message saved. For a faster reply, continue on WhatsApp.</p>
            ) : (
              <>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Name</span>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={update}
                    className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base sm:text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Phone or email</span>
                  <input
                    name="contact"
                    required
                    value={form.contact}
                    onChange={update}
                    className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base sm:text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block text-mute">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update}
                    className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base sm:text-sm"
                  />
                </label>
                {error && <p className="text-sm text-magenta">{error}</p>}
                <button type="submit" disabled={busy} className="btn-glow w-full rounded-full bg-magenta py-3 font-semibold disabled:opacity-60">
                  {busy ? "Sending…" : "Send message"}
                </button>
              </>
            )}
          </form>

          <div className="min-w-0">
            <div className="map-frame overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title={`Map of ${site.name}, Geeta Colony, Delhi`}
                src={site.mapEmbed}
                className="h-full w-full max-w-full grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm text-magenta hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
