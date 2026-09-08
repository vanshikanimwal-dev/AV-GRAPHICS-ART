import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductVisual from "../components/ProductVisual";
import Seo from "../components/Seo";
import { formatPrice, getProduct, relatedProducts } from "../data/products";
import { site } from "../data/site";

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);
  const [angle, setAngle] = useState(0);
  const [lit, setLit] = useState(true);

  if (!product) return <Navigate to="/products" replace />;

  const angles = ["Front", "Angle", "Detail", "Install"];

  return (
    <>
      <Seo
        title={`${product.name} in ${site.city} | ${site.name}`}
        description={`${product.short} Custom ${product.category.toLowerCase()} from ${site.name}, starting at ${formatPrice(product.price)}.`}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="aspect-[16/11]">
              <ProductVisual
                signText={product.signText}
                accent={product.accent}
                variant={product.variant}
                lit={lit}
                className="h-full"
                label={`${product.name} ${angles[angle].toLowerCase()} ${lit ? "lit" : "unlit"} — replace with real product photo`}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {angles.map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(i)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  angle === i ? "bg-magenta" : "border border-white/15 text-mute"
                }`}
              >
                {a} placeholder
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLit((v) => !v)}
              className="rounded-full border border-amber/40 px-3 py-1.5 text-xs text-amber"
            >
              {lit ? "Show unlit" : "Show lit"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl text-paper">{product.name}</h1>
          <p className="mt-4 text-mute leading-relaxed">{product.description}</p>
          <p className="mt-6 font-display text-2xl text-amber">From {formatPrice(product.price)}</p>
          <p className="mt-2 text-sm text-mute">Estimated turnaround: {product.turnaround}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-ink-2 p-4">
              <dt className="text-xs uppercase tracking-wider text-mute">Sizes</dt>
              <dd className="mt-2 text-sm text-paper">{product.sizes.join(" · ")}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-ink-2 p-4">
              <dt className="text-xs uppercase tracking-wider text-mute">Materials</dt>
              <dd className="mt-2 text-sm text-paper">{product.materials.join(" · ")}</dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-ink-2 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-wider text-mute">Colors</dt>
              <dd className="mt-2 text-sm text-paper">{product.colors.join(" · ")}</dd>
            </div>
          </dl>

          <Link
            to="/quote"
            className="btn-glow mt-8 inline-flex rounded-full bg-magenta px-6 py-3 font-semibold"
          >
            Request Custom Version
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl text-paper">Related pieces</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts(product.id).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
