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
import GlowMarquee from "../components/GlowMarquee";
import StudioPulse from "../components/StudioPulse";
import { getProduct } from "../data/products";
import { site, workTypesCopy } from "../data/site";

const featured = ["studio-name-board", "steel-letter", "standee", "aurora-shopfront", "office-branding", "backlit-signboards"]
  .map(getProduct)
  .filter(Boolean);

export default function Home() {
  return (
    <>
      <Seo
        title={`LED Boards, Glow Signs & Name Plates in ${site.city} | ${site.name}`}
        description={`Custom ${workTypesCopy} in ${site.city}, designed by ${site.owner}.`}
      />
      <Hero />
      <GlowMarquee />
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
          products={featured}
          featuredIds={["studio-name-board", "steel-letter", "standee"]}
          parallax
        />
      </section>

      <StudioPulse />
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
        <ScrollReveal className="cta-glow rounded-3xl border border-magenta/30 bg-ink-2 px-4 py-10 text-center sm:px-8 sm:py-14">
          <img src="/work/workshop-j101.jpg" alt="" />
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">The workshop is open</p>
          <h2 className="mt-3 font-display text-[clamp(1.3rem,4.2vw,2.5rem)] text-paper">Ready for a sign that glows?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mute sm:text-base">
            Walk into J-101, Geeta Colony, or send a photo of the wall. {site.owner} will quote the
            board, letters, or plate to the size of your space.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/quote"
              className="btn-glow btn-glow-cta inline-flex rounded-full bg-magenta px-8 py-3 font-semibold"
            >
              Get a Custom Quote
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-paper"
            >
              Visit the studio
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
