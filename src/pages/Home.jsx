import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import ProductVisual from "../components/ProductVisual";
import TestimonialCarousel from "../components/TestimonialCarousel";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { gallery } from "../data/gallery";
import { site } from "../data/site";

const steps = [
  { n: "01", title: "Consult", copy: "Share the space, the words, and the feeling you want after dark." },
  { n: "02", title: "Design", copy: "Anand draws the lettering, color, and scale before anything is cut." },
  { n: "03", title: "Approve", copy: "You review the artwork. We refine until the glow is right." },
  { n: "04", title: "Delivered", copy: "Fabricated, packed, and installed or shipped across Delhi." },
];

export default function Home() {
  return (
    <>
      <Seo
        title={`Custom LED Nameplates in ${site.city} | ${site.name}`}
        description={`Handcrafted LED light boards, nameplates, and neon plates in ${site.city}, designed personally by ${site.owner}.`}
      />
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-white/8 bg-ink-2/80 p-6 sm:p-8 lg:grid-cols-[200px_1fr]">
          <img
            src="/logo.png"
            alt={`${site.owner} — AV Graphics Art monogram, designer portrait placeholder`}
            className="mx-auto h-44 w-44 rounded-2xl object-cover ring-1 ring-magenta/30"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue">About the designer</p>
            <h2 className="mt-2 font-display text-2xl text-paper">{site.owner}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
              A graphic designer based in {site.city}, {site.owner} treats every board as a piece of type —
              not a template. Lettering, spacing, and glow are composed by hand before fabrication.
            </p>
            <Link to="/about" className="mt-4 inline-block text-sm text-magenta hover:underline">
              Read the studio story →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-magenta">Featured</p>
            <h2 className="mt-2 font-display text-3xl text-paper">Best-selling glow</h2>
          </div>
          <Link to="/products" className="text-sm text-blue hover:underline">
            Full catalog
          </Link>
        </div>
        <ProductGrid
          products={products.slice(0, 6)}
          featuredIds={["aurora-shopfront", "neon-quote-plate", "neon-logo-wall"]}
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-amber">How it works</p>
        <h2 className="mt-2 font-display text-3xl text-paper">Consult → Design → Approve → Delivered</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
              <p className="font-display text-magenta">{step.n}</p>
              <h3 className="mt-2 font-display text-lg text-paper">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">Clients</p>
        <h2 className="mt-2 mb-8 font-display text-3xl text-paper">Words after the lights went on</h2>
        <TestimonialCarousel />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue">Instagram</p>
            <h2 className="mt-2 font-display text-3xl text-paper">Past work</h2>
          </div>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="text-sm text-magenta">
            {site.instagram}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {gallery.slice(0, 6).map((item) => (
            <Link key={item.id} to="/gallery" className="overflow-hidden rounded-xl border border-white/8">
              <ProductVisual
                signText={item.signText}
                accent={item.accent}
                variant={item.variant}
                className="aspect-square"
                label={`${item.title} — replace with real product photo`}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
