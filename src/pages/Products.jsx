import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { categories, serviceGroups, site } from "../data/site";

const sizes = ["All sizes", "Compact", "Standard", "Statement"];
const prices = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹3,000", min: 0, max: 2999 },
  { label: "₹3,000 – ₹7,000", min: 3000, max: 7000 },
  { label: "₹7,000+", min: 7000, max: Infinity },
];

function sizeBand(product) {
  if (!product.sizes?.length) return null;
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
  const { pathname } = useLocation();
  const isServices = pathname.startsWith("/services");
  const [group, setGroup] = useState("All");
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All sizes");
  const [price, setPrice] = useState(prices[0].label);
  const [sort, setSort] = useState("popularity");

  const showLegacyFilters = group === "All" || group === "Signage & Boards";

  const filtered = useMemo(() => {
    const band = prices.find((p) => p.label === price) || prices[0];
    return products
      .filter((p) => group === "All" || p.group === group)
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => size === "All sizes" || sizeBand(p) === size)
      .filter((p) => {
        if (price === "Any price") return true;
        if (typeof p.price !== "number") return false;
        return p.price >= band.min && p.price <= band.max;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
        if (sort === "price-desc") return (b.price ?? -1) - (a.price ?? -1);
        return b.popularity - a.popularity;
      });
  }, [group, category, size, price, sort]);

  return (
    <>
      <Seo
        title={
          isServices
            ? `Signage, Printing & Branding Services in ${site.city} | ${site.name}`
            : `Custom LED Boards, Neon Flex & Signage in ${site.city} | ${site.name}`
        }
        description={`LED sign boards, neon flex signs, 3D letter signs, backlit boards, flex printing, vehicle branding, wedding name boards, laser engraving and signage AMC from ${site.name} in ${site.city}.`}
      />
      <section className="site-wrap page-section">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.24em] text-magenta">
            {isServices ? "Services" : "Catalog"}
          </p>
          <h1 className="page-title mt-2 font-display text-[clamp(1.4rem,4.6vw,2.75rem)] text-paper">
            {isServices ? "Services" : "Products"}
          </h1>
          <p className="page-copy mt-3 text-sm text-mute sm:text-base">
            Signage and boards, printing and branding, events, and fabrication, plus the original LED
            boards, nameplates, and neon plates.
          </p>

          <div className="chip-row mt-8">
            {["All", ...serviceGroups].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setGroup(c);
                  setCategory("All");
                }}
                className={`shrink-0 rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm ${
                  group === c ? "bg-magenta text-white" : "border border-white/15 text-mute"
                }`}
              >
                {c === "All" ? "ALL" : c}
              </button>
            ))}
          </div>

          {showLegacyFilters ? (
            <div className="chip-row mt-4">
              {["All", ...categories].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                    category === c ? "bg-white/15 text-paper" : "border border-white/10 text-mute"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : null}

          <div className="filters-3 mt-6">
            <label className="text-sm text-mute">
              Size
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-base text-paper sm:text-sm"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-base text-paper sm:text-sm"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-base text-paper sm:text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </ScrollReveal>

        <div className="mt-10">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </>
  );
}
