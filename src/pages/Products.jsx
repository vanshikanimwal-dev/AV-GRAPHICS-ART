import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import ScrollReveal from "../components/ScrollReveal";
import Seo from "../components/Seo";
import { products } from "../data/products";
import { categories, categoriesByGroup, serviceGroups, site, workTypesCopy } from "../data/site";

const sizes = ["All sizes", "Compact", "Standard", "Statement"];

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
  const [sort, setSort] = useState("popularity");

  const typeChips = group === "All" ? categories : categoriesByGroup[group] || categories;

  const filtered = useMemo(() => {
    return products
      .filter((p) => group === "All" || p.group === group)
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => size === "All sizes" || sizeBand(p) === size)
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        return b.popularity - a.popularity;
      });
  }, [group, category, size, sort]);

  return (
    <>
      <Seo
        title={
          isServices
            ? `Signage Services in ${site.city} | ${site.name}`
            : `Custom Boards, Letters & Name Plates in ${site.city} | ${site.name}`
        }
        description={`${workTypesCopy} from ${site.name} in ${site.city}.`}
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
            Crystal, ACP, sparkle, glow and LED boards, acrylic plates, plastic and steel letters,
            name plates, moving displays, standees and digital prints. Every piece is quoted to size
            and finish.
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

          <div className="chip-row mt-4">
            {["All", ...typeChips].map((c) => (
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

          <div className="split-form mt-6">
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
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-ink-2 px-3 py-2 text-base text-paper sm:text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="name">Name A–Z</option>
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
