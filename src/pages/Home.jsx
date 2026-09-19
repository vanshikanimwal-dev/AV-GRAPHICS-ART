import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";
import ServicesPreview from "../components/ServicesPreview";
import TestimonialCarousel from "../components/TestimonialCarousel";
import Seo from "../components/Seo";
import ScrollReveal from "../components/ScrollReveal";
import AboutDesignerStory from "../components/AboutDesignerStory";
import HowItWorksStory from "../components/HowItWorksStory";
import GalleryStory from "../components/GalleryStory";
import { products } from "../data/products";
import { site } from "../data/site";

export default function Home() {
  return (
    <>
      <Seo
        title={`LED Sign Boards, Neon Flex & Branding in ${site.city} | ${site.name}`}
        description={`Custom LED sign boards, neon flex signs, 3D letters, flex printing, vehicle branding and signage AMC in ${site.city}, designed by ${site.owner}.`}
      />
      <Hero />
      <AboutDesignerStory />
      <HowItWorksStory />

      <section className="site-wrap page-section">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-magenta">Featured</p>
              <h2 className="mt-2 font-display text-[clamp(1.2rem,3.8vw,2.25rem)] text-paper">Best-selling glow</h2>
            </div>
            <Link to="/products" className="text-sm text-blue hover:underline">
              Full catalog
            </Link>
          </div>
        </ScrollReveal>
        <ProductGrid
          products={products.slice(0, 6)}
          featuredIds={["aurora-shopfront", "neon-quote-plate", "neon-logo-wall"]}
          parallax
        />
      </section>

      <ServicesPreview />

      <section className="site-wrap page-section">
        <ScrollReveal y={40}>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">Clients</p>
          <h2 className="mt-2 mb-5 font-display text-[clamp(1.2rem,3.8vw,2.25rem)] text-paper sm:mb-8">Words after the lights went on</h2>
          <TestimonialCarousel />
        </ScrollReveal>
      </section>

      <GalleryStory />

      <section className="site-wrap page-section">
        <ScrollReveal className="rounded-3xl border border-magenta/30 bg-ink-2 px-4 py-8 text-center sm:px-8 sm:py-12">
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">The story ends here</p>
          <h2 className="mt-3 font-display text-[clamp(1.3rem,4.2vw,2.5rem)] text-paper">Ready for a sign that glows?</h2>
          <p className="mx-auto mt-4 max-w-xl text-mute">
            Commission a custom LED board, neon flex sign, print, or branded interior, designed personally by {site.owner}.
          </p>
          <Link
            to="/quote"
            className="btn-glow btn-glow-cta mt-8 inline-flex rounded-full bg-magenta px-8 py-3 font-semibold"
          >
            Get a Custom Quote
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
