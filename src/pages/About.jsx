import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { site, workTypesCopy } from "../data/site";

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
    copy: "Acrylic, ACP, LED modules, brass, and sealed frames chosen to hold glow and weather Delhi nights.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title={`About ${site.name} | Custom Signs in ${site.city}`}
        description={`${site.owner} designs ${workTypesCopy} at ${site.name} in ${site.city}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Studio</p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">About AV Graphics Art</h1>
          <p className="page-copy mt-4 text-sm leading-relaxed text-mute sm:mt-6 sm:text-lg">
            {site.name} is the signage practice of {site.owner} in {site.city}, a graphic designer who
            builds crystal, ACP, sparkle, glow and LED boards, acrylic plates, plastic and steel letters,
            name plates, moving displays, standees and digital prints as designed objects, not
            off-the-shelf stock.
          </p>
        </ScrollReveal>

        <ScrollReveal className="two-col mt-8 sm:mt-12" delay={0.08}>
          <img
            src="/work/anand-studio.jpg"
            alt={`${site.owner} at the AV Graphics Art workshop`}
            className="mx-auto h-56 w-full max-w-sm rounded-3xl object-cover object-[center_20%] sm:h-80 sm:max-w-md lg:h-[28rem] lg:max-w-full"
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
          {[
            { label: "Shopfronts", src: "/work/mahamaya-property.jpg" },
            { label: "Steel letters", src: "/work/steel-lux-nails.jpg" },
            { label: "The workshop", src: "/work/workshop-j101.jpg" },
          ].map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.08} className="overflow-hidden rounded-2xl border border-white/8 bg-ink-2">
              <img
                src={item.src}
                alt={`${item.label} by ${site.name}`}
                className="h-36 w-full object-cover object-center sm:h-44"
              />
              <p className="px-4 py-3 text-sm text-paper">{item.label}</p>
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
