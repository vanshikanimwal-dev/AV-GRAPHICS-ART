import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { formatPrice } from "../data/products";

export default function ProductCard({ product, featured = false }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-white/8 bg-ink-2 transition duration-300 hover:-translate-y-1 hover:border-magenta/50 ${
        featured ? "animate-pulse-glow" : ""
      }`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden">
          <div className="absolute inset-0 transition duration-500 group-hover:opacity-0">
            <ProductVisual
              signText={product.signText}
              accent={product.accent}
              variant={product.variant}
              lit={false}
              className="h-full"
              label={`${product.name} unlit state — replace with real product photo`}
            />
          </div>
          <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <ProductVisual
              signText={product.signText}
              accent={product.accent}
              variant={product.variant}
              lit
              className="h-full"
              label={`${product.name} lit state — replace with real product photo`}
            />
          </div>
        </div>
        <div className="space-y-2 p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">{product.category}</p>
          <h3 className="font-display text-base text-paper">{product.name}</h3>
          <p className="text-sm leading-relaxed text-mute">{product.short}</p>
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-paper">
              From <span className="text-amber">{formatPrice(product.price)}</span>
            </p>
            <span className="text-xs uppercase tracking-wider text-blue">View details →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
