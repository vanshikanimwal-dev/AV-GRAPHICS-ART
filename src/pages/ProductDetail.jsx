import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductVisual from "../components/ProductVisual";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { getProduct, quotePath, relatedProducts } from "../data/products";
import { site } from "../data/site";

export default function ProductDetail() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const product = getProduct(id);
  const [lit, setLit] = useState(true);

  const catalogPath = pathname.startsWith("/services") ? "/services" : "/products";

  if (!product) return <Navigate to={catalogPath} replace />;

  const seoDescription = `${product.short} Custom ${product.category.toLowerCase()} from ${site.name} in ${site.city}. Quoted to size and finish.`;

  return (
    <>
      <Seo
        title={`${product.name} in ${site.city} | ${site.name}`}
        description={seoDescription}
        image={product.image}
        type="product"
        product={product}
      />
      <section className="two-col site-wrap page-section">
        <ScrollReveal>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="relative aspect-[16/10] max-h-[38svh] overflow-hidden sm:aspect-[16/11] sm:max-h-none">
              <ProductVisual
                signText={product.signText}
                accent={product.accent}
                variant={product.variant}
                image={product.image}
                lit={product.image ? true : lit}
                className="absolute inset-0 h-full w-full"
                label={`${product.name} ${product.image ? "photo" : lit ? "lit preview" : "unlit preview"}`}
              />
            </div>
          </div>
          {!product.image ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLit((v) => !v)}
              className="rounded-full border border-amber/40 px-3 py-1.5 text-xs text-amber"
            >
              {lit ? "Show unlit" : "Show lit"}
            </button>
          </div>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">
            {product.group} · {product.category}
          </p>
          <h1 className="page-title mt-2 break-words font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-mute sm:mt-4 sm:text-base">{product.description}</p>
          {product.highlight ? (
            <p className="mt-4 rounded-2xl border border-magenta/30 bg-magenta/5 px-4 py-3 text-sm text-paper">
              {product.highlight}
            </p>
          ) : null}
          <p className="mt-6 text-sm text-mute">
            Every board is quoted to size, material and finish. Share a brief for a custom quote.
          </p>
          {product.turnaround ? (
            <p className="mt-2 text-sm text-mute">Estimated turnaround: {product.turnaround}</p>
          ) : null}

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.offers?.length ? (
              <div className="rounded-2xl border border-white/8 bg-ink-2 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-mute">What we offer</dt>
                <dd className="mt-2 text-sm text-paper">{product.offers.join(" · ")}</dd>
              </div>
            ) : null}
            {product.useCases?.length ? (
              <div className="rounded-2xl border border-white/8 bg-ink-2 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-mute">Suitable for</dt>
                <dd className="mt-2 text-sm text-paper">{product.useCases.join(" · ")}</dd>
              </div>
            ) : null}
            {product.sizes?.length ? (
              <div className="rounded-2xl border border-white/8 bg-ink-2 p-4">
                <dt className="text-xs uppercase tracking-wider text-mute">Sizes</dt>
                <dd className="mt-2 text-sm text-paper">{product.sizes.join(" · ")}</dd>
              </div>
            ) : null}
            {product.materials?.length ? (
              <div className="rounded-2xl border border-white/8 bg-ink-2 p-4">
                <dt className="text-xs uppercase tracking-wider text-mute">Materials / options</dt>
                <dd className="mt-2 text-sm text-paper">{product.materials.join(" · ")}</dd>
              </div>
            ) : null}
            {product.colors?.length ? (
              <div className="rounded-2xl border border-white/8 bg-ink-2 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-mute">Colors</dt>
                <dd className="mt-2 text-sm text-paper">{product.colors.join(" · ")}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to={quotePath(product)}
              className="btn-glow inline-flex min-h-12 items-center justify-center rounded-full bg-magenta px-6 py-3 font-semibold"
            >
              Get a Quote
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-paper"
            >
              Contact
            </Link>
            <Link to={catalogPath} className="inline-flex min-h-12 items-center text-sm text-blue hover:underline">
              ← Back to {pathname.startsWith("/services") ? "Services" : "Products"}
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="site-wrap pb-12 sm:pb-16">
        <ScrollReveal>
          <h2 className="font-display text-xl text-paper sm:text-2xl">Related pieces</h2>
        </ScrollReveal>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts(product.id).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
