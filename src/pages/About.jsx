import Seo from "../components/Seo";
import { site } from "../data/site";

const values = [
  {
    title: "Handcrafted",
    copy: "Lettering is drawn, not dumped from a clip-art folder. Each board starts as a composition.",
  },
  {
    title: "Custom",
    copy: "Names, logos, sizes, and colorways are built around the wall they will live on.",
  },
  {
    title: "Quality materials",
    copy: "Acrylic, LED neon-flex, brass, and sealed frames chosen to hold glow and weather Delhi nights.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title={`About ${site.name} | Custom Signs in ${site.city}`}
        description={`${site.owner} designs handcrafted LED boards, nameplates, and neon plates at ${site.name} in ${site.city}.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">Studio</p>
        <h1 className="mt-2 font-display text-4xl text-paper sm:text-5xl">About AV Graphics Art</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mute">
          {site.name} is the signage practice of {site.owner} in {site.city} — a graphic designer who
          builds LED light boards, door nameplates, and neon-style plates as designed objects, not
          off-the-shelf stock.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <img
            src="/logo.png"
            alt={`${site.owner} workshop portrait placeholder — replace with real photo`}
            className="h-80 w-full rounded-3xl object-cover ring-1 ring-white/10"
          />
          <div className="flex flex-col justify-center rounded-3xl border border-white/8 bg-ink-2 p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-blue">The designer</p>
            <h2 className="mt-2 font-display text-2xl text-paper">{site.owner}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Trained as a graphic designer, Anand treats neon and LED as typography you can stand in front of.
              Spacing, weight, and glow are decided on paper and screen before a single strip is bent.
              The studio exists so shops, homes, and brands in Delhi can commission a sign that feels authored.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {["Sketch & type", "Prototype glow", "Finish & install"].map((label, i) => (
            <div key={label} className="overflow-hidden rounded-2xl border border-white/8 bg-ink-2">
              <div
                className="h-36"
                style={{
                  background: [
                    "linear-gradient(135deg,#1a1a24,rgba(255,45,106,.35))",
                    "linear-gradient(135deg,#1a1a24,rgba(61,224,255,.3))",
                    "linear-gradient(135deg,#1a1a24,rgba(255,176,32,.3))",
                  ][i],
                }}
                role="img"
                aria-label={`${label} workshop process photo placeholder — replace with real process photo`}
              />
              <p className="px-4 py-3 text-sm text-paper">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="glow-border rounded-2xl bg-ink-2 p-6">
              <h3 className="font-display text-xl text-paper">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
