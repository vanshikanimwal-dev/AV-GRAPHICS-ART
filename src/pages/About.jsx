import ScrollReveal from "../components/ScrollReveal";
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
        description={`${site.owner} designs LED sign boards, neon flex, 3D letters, printing and branding at ${site.name} in ${site.city}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Studio</p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">About AV Graphics Art</h1>
          <p className="page-copy mt-4 text-sm leading-relaxed text-mute sm:mt-6 sm:text-lg">
            {site.name} is the signage practice of {site.owner} in {site.city}, a graphic designer who
            builds LED light boards, door nameplates, and neon-style plates as designed objects, not
            off-the-shelf stock. The studio also handles printing and branding, event boards, laser
            cutting, and installation with AMC.
          </p>
        </ScrollReveal>

        <ScrollReveal className="two-col mt-8 sm:mt-12" delay={0.08}>
          <img
            src="/logo.png?v=2"
            alt="AV Graphics Art logo"
            className="mx-auto h-36 w-full max-w-[12rem] object-contain sm:h-64 sm:max-w-md lg:h-80 lg:max-w-full"
          />
          <div className="form-card flex min-w-0 flex-col justify-center rounded-3xl border border-white/8 bg-ink-2">
            <p className="text-xs uppercase tracking-[0.2em] text-blue">The designer</p>
            <h2 className="mt-2 font-display text-2xl text-paper">{site.owner}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Trained as a graphic designer, Anand treats neon and LED as typography you can stand in front of.
              Spacing, weight, and glow are decided on paper and screen before a single strip is bent.
              The studio exists so shops, homes, and brands in Delhi can commission a sign that feels authored.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 md:grid-cols-3">
          {["Sketch & type", "Prototype glow", "Finish & install"].map((label, i) => (
            <ScrollReveal key={label} delay={i * 0.08} className="overflow-hidden rounded-2xl border border-white/8 bg-ink-2">
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
                aria-label={`${label} workshop process photo placeholder. replace with real process photo`}
              />
              <p className="px-4 py-3 text-sm text-paper">{label}</p>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.08}>
            <div className="glow-border rounded-2xl bg-ink-2 p-5 sm:p-6">
              <h3 className="font-display text-xl text-paper">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{v.copy}</p>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
