import { useState } from "react";
import Seo from "../components/Seo";

export default function Admin() {
  const [key, setKey] = useState("");
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const load = async (event) => {
    event?.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-key": key } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load leads.");
      setLeads(data.leads || []);
      setUnlocked(true);
    } catch (err) {
      setUnlocked(false);
      setError(err.message);
    }
  };

  return (
    <>
      <Seo title="Studio leads | AV Graphics Art" description="Private lead inbox for AV Graphics Art." />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">Private</p>
        <h1 className="mt-2 font-display text-4xl text-paper">Leads</h1>
        <form onSubmit={load} className="mt-6 flex max-w-md gap-2">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-full border border-white/10 bg-ink-2 px-4 py-2.5 text-sm"
          />
          <button type="submit" className="btn-glow shrink-0 rounded-full bg-magenta px-4 py-2 text-sm font-semibold">
            Open
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-magenta">{error}</p>}

        {unlocked && (
          <div className="mt-10 space-y-4">
            {leads.length === 0 && <p className="text-mute">No leads yet.</p>}
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-magenta">{lead.type}</p>
                  <p className="text-xs text-mute">{new Date(lead.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <h2 className="mt-2 font-display text-lg text-paper">{lead.name}</h2>
                <p className="text-sm text-blue">{lead.contact}</p>
                {lead.productType && <p className="mt-2 text-sm text-mute">{lead.productType} · {lead.budget || "budget TBD"}</p>}
                {lead.size && <p className="text-sm text-mute">Size: {lead.size}</p>}
                {lead.colors && <p className="text-sm text-mute">Colors: {lead.colors}</p>}
                {lead.textLogo && <p className="text-sm text-mute">Text/logo: {lead.textLogo}</p>}
                {lead.message && <p className="mt-2 text-sm text-paper">{lead.message}</p>}
                {lead.image && (
                  <a href={lead.image} target="_blank" rel="noreferrer" className="mt-3 inline-block">
                    <img src={lead.image} alt={`Reference from ${lead.name}`} className="h-28 rounded-xl object-cover" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
