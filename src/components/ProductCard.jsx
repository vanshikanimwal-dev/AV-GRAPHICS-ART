import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductVisual from "./ProductVisual";
import { quotePath } from "../data/products";
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
        featured && !reduced && !product.image ? "animate-pulse-glow" : ""
      }`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/11]">
          <motion.div className="absolute inset-0 h-full w-full" style={{ y: imageY }}>
            {product.image ? (
              <div className="absolute inset-0 transition duration-500 group-hover:scale-[1.04]">
                <ProductVisual
                  signText={product.signText}
                  accent={product.accent}
                  variant={product.variant}
                  image={product.image}
                  lit
                  className="h-full"
                  label={`${product.name} studio photo`}
                />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 transition duration-500 group-hover:opacity-0">
                  <ProductVisual
                    signText={product.signText}
                    accent={product.accent}
                    variant={product.variant}
                    image={product.image}
                    lit={false}
                    className="h-full"
                    label={`${product.name} unlit state`}
                  />
                </div>
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <ProductVisual
                    signText={product.signText}
                    accent={product.accent}
                    variant={product.variant}
                    image={product.image}
                    lit
                    className="h-full"
                    label={`${product.name} lit state`}
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>
        <div className="space-y-1.5 p-3.5 pb-2 sm:space-y-2 sm:p-5 sm:pb-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-magenta sm:text-[11px] sm:tracking-[0.22em]">
            {product.group || product.category}
          </p>
          <h3 className="font-display text-sm text-paper sm:text-base">{product.name}</h3>
          <p className="text-xs leading-relaxed text-mute sm:text-sm">{product.short}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2 px-3.5 pb-3.5 sm:gap-3 sm:px-5 sm:pb-5">
        <Link
          to={`/products/${product.id}`}
          className="min-w-0 truncate text-xs uppercase tracking-wider text-blue hover:underline"
        >
          View details
        </Link>
        <Link
          to={quotePath(product)}
          className="shrink-0 rounded-full border border-magenta/50 px-3 py-1.5 text-xs uppercase tracking-wider text-magenta transition hover:bg-magenta/10"
        >
          Get Quote
        </Link>
      </div>
    </motion.article>
  );
}
