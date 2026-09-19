import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { formatPrice, quotePath } from "../data/products";
import { usePrefersReducedMotion } from "../hooks/useMotionPrefs";

export default function ProductCard({
  product,
  featured = false,
  index = 0,
  parallax = false,
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced || !parallax ? [0, 0] : [-18, 18]);

  return (
    <motion.article
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      animate={
        inView
          ? reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y: 28 }
      }
      transition={{
        duration: reduced ? 0.28 : 0.55,
        delay: reduced ? 0 : Math.min(index, 8) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group min-w-0 overflow-hidden rounded-2xl border border-white/8 bg-ink-2 transition duration-300 hover:-translate-y-1 hover:border-magenta/50 ${
        featured && !reduced ? "animate-pulse-glow" : ""
      }`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[16/11] overflow-hidden">
          <motion.div className="absolute inset-[-12%] h-[124%] w-full" style={{ y: imageY }}>
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
          </motion.div>
        </div>
        <div className="space-y-2 p-5 pb-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-magenta">
            {product.group || product.category}
          </p>
          <h3 className="font-display text-base text-paper">{product.name}</h3>
          <p className="text-sm leading-relaxed text-mute">{product.short}</p>
          {product.price ? (
            <p className="pt-1 text-sm text-paper">
              From <span className="text-amber">{formatPrice(product.price)}</span>
            </p>
          ) : null}
        </div>
      </Link>
      <div className="flex items-center justify-between gap-3 px-5 pb-5">
        <Link
          to={`/products/${product.id}`}
          className="text-xs uppercase tracking-wider text-blue hover:underline"
        >
          {product.price ? "View details" : "View Service"}
        </Link>
        <Link
          to={quotePath(product)}
          className="rounded-full border border-magenta/50 px-3 py-1.5 text-xs uppercase tracking-wider text-magenta transition hover:bg-magenta/10"
        >
          Get Quote
        </Link>
      </div>
    </motion.article>
  );
}
