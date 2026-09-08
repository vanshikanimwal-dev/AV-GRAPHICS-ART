import { useMemo, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { categories, site } from "../data/site";

const sizes = ["All sizes", "Compact", "Standard", "Statement"];
const prices = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹3,000", min: 0, max: 2999 },
  { label: "₹3,000 – ₹7,000", min: 3000, max: 7000 },
  { label: "₹7,000+", min: 7000, max: Infinity },
];

function sizeBand(product) {
  const max = Math.max(
    ...product.sizes.map((s) => {
      const nums = s.match(/\d+/g)?.map(Number) || [0];
      return Math.max(...nums);
    })
  );
  if (max <= 16) return "Compact";
  if (max <= 28) return "Standard";
  return "Statement";
}

export default function Products() {
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All sizes");
  const [price, setPrice] = useState(prices[0].label);
  const [sort, setSort] = useState("popularity");

  const filtered = useMemo(() => {
    const band = prices.find((p) => p.label === price) || prices[0];
    return products
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => size === "All sizes" || sizeBand(p) === size)
      .filter((p) => p.price >= band.min && p.price <= band.max)
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        return b.popularity - a.popularity;
      });
  }, [category, size, price, sort]);

  return (
    <>
      <Seo
        title={`Custom LED Boards & Neon Plates in ${site.city} | ${site.name}`}
        description={`Browse LED light boards, nameplates, and neon plates from ${site.name} in ${site.city}. Starting prices, sizes, and custom options.`}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.24em] text-magenta">Catalog</p>
        <h1 className="mt-2 font-display text-4xl text-paper">Products</h1>
        <p className="mt-3 max-w-2xl text-mute">
          Sample inventory across three categories. Swap these cards for live stock when photographs are ready.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm ${
                category === c ? "bg-magenta text-white" : "border border-white/15 text-mute"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <label className="text-sm text-mute">
            Size
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-paper"
            >
              {sizes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-mute">
            Price range
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-paper"
            >
              {prices.map((p) => (
                <option key={p.label}>{p.label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-mute">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-paper"
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-10">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </>
  );
}
