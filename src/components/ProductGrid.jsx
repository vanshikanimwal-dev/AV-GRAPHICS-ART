import ProductCard from "./ProductCard";

export default function ProductGrid({ products, featuredIds = [] }) {
  if (!products.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-ink-2 p-10 text-center text-mute">
        No pieces match those filters yet. Try another size, price, or category.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          featured={featuredIds.includes(product.id)}
        />
      ))}
    </div>
  );
}
