export const products = [
  {
    id: "aurora-shopfront",
    name: "Aurora Shopfront Board",
    category: "LED Light Boards",
    short: "Full-width LED fascia for storefronts, cafés, and studios.",
    description:
      "A hand-designed LED light board built for storefront presence after dark. Custom lettering, logo lockups, and colorways are drawn by Anand Prakash Nimwal before fabrication.",
    price: 7499,
    popularity: 98,
    sizes: ["24 × 8 in", "36 × 12 in", "48 × 16 in"],
    materials: ["Acrylic face", "LED modules", "Aluminum frame"],
    colors: ["Magenta", "Electric blue", "Warm white"],
    turnaround: "7–10 days",
    signText: "OPEN LATE",
    accent: "#ff2d6a",
    variant: "board",
  },
  {
    id: "studio-name-board",
    name: "Studio Name Board",
    category: "LED Light Boards",
    short: "Compact LED identity board for studios, clinics, and offices.",
    description:
      "A refined LED name board with balanced lettering and a soft halo glow. Ideal for indoor reception walls and outdoor porch lighting.",
    price: 4999,
    popularity: 91,
    sizes: ["18 × 8 in", "24 × 10 in", "30 × 12 in"],
    materials: ["3D acrylic", "Diffused LED strip", "PVC backing"],
    colors: ["Neon pink", "Ice blue", "Amber"],
    turnaround: "5–8 days",
    signText: "STUDIO",
    accent: "#3de0ff",
    variant: "board",
  },
  {
    id: "home-glow-board",
    name: "Home Glow Board",
    category: "LED Light Boards",
    short: "House-name LED board with a warm, residential glow.",
    description:
      "A residential LED board designed around your family name or house title. Lit and unlit states are composed so the piece still reads as art during the day.",
    price: 3499,
    popularity: 86,
    sizes: ["16 × 6 in", "20 × 8 in", "28 × 10 in"],
    materials: ["Frosted acrylic", "Warm LED", "Weather-sealed frame"],
    colors: ["Warm white", "Amber", "Soft pink"],
    turnaround: "5–7 days",
    signText: "NIVAS",
    accent: "#ffb020",
    variant: "board",
  },
  {
    id: "acrylic-door-plate",
    name: "Acrylic Door Nameplate",
    category: "Nameplates",
    short: "Crisp modern nameplate for apartments and studio doors.",
    description:
      "Laser-cut acrylic with layered lettering and optional edge lighting. A quieter piece for homes that still carries the AV glow language.",
    price: 1499,
    popularity: 88,
    sizes: ["8 × 3 in", "10 × 4 in", "12 × 5 in"],
    materials: ["Clear acrylic", "Vinyl inlay", "Stainless studs"],
    colors: ["Black + white", "Magenta + black", "Gold + black"],
    turnaround: "3–5 days",
    signText: "NIMWAL",
    accent: "#f4f1ea",
    variant: "nameplate",
  },
  {
    id: "brass-classic",
    name: "Brass Classic Nameplate",
    category: "Nameplates",
    short: "Hand-finished brass plate with custom serif or geometric type.",
    description:
      "A heritage-leaning nameplate in brushed brass, designed so the typography feels custom rather than catalogue. Optional dark-wood backing.",
    price: 2499,
    popularity: 77,
    sizes: ["10 × 4 in", "12 × 5 in", "14 × 6 in"],
    materials: ["Brushed brass", "Teak backing", "Antique studs"],
    colors: ["Brass", "Blackened brass", "Two-tone"],
    turnaround: "6–9 days",
    signText: "HOUSE 12",
    accent: "#ffb020",
    variant: "nameplate",
  },
  {
    id: "led-house-number",
    name: "LED House Number Plate",
    category: "Nameplates",
    short: "Backlit house numbers that read clearly from the street.",
    description:
      "High-contrast numerals with a halo edge. Designed for gates, porches, and apartment corridors where visibility after dark matters.",
    price: 2199,
    popularity: 84,
    sizes: ["10 × 10 in", "12 × 12 in", "16 × 8 in"],
    materials: ["Acrylic numerals", "LED halo", "Matte black base"],
    colors: ["White", "Blue", "Magenta"],
    turnaround: "4–6 days",
    signText: "204",
    accent: "#3de0ff",
    variant: "nameplate",
  },
  {
    id: "neon-quote-plate",
    name: "Neon Quote Plate",
    category: "Neon Plates",
    short: "A line of custom lettering in flexible neon for walls and bars.",
    description:
      "A neon-style quote plate, scripted and spaced by hand. Choose a short line, a couple name, or a brand slogan — each piece is drawn before it is bent.",
    price: 5999,
    popularity: 94,
    sizes: ["18 × 10 in", "24 × 12 in", "32 × 14 in"],
    materials: ["LED neon flex", "Clear acrylic", "Silent adapter"],
    colors: ["Hot pink", "Ice blue", "Warm amber"],
    turnaround: "8–12 days",
    signText: "GLOW",
    accent: "#ff2d6a",
    variant: "neon",
  },
  {
    id: "neon-logo-wall",
    name: "Neon Logo Wall Sign",
    category: "Neon Plates",
    short: "Brand-mark neon for studios, boutiques, and photo corners.",
    description:
      "Your logo translated into neon-flex linework. Built for content walls and reception pieces that need to photograph as well as they light a room.",
    price: 8499,
    popularity: 96,
    sizes: ["20 × 20 in", "28 × 16 in", "36 × 20 in"],
    materials: ["LED neon flex", "Cut acrylic", "Wall standoffs"],
    colors: ["Magenta + white", "Blue + amber", "Custom dual-tone"],
    turnaround: "10–14 days",
    signText: "AV",
    accent: "#ff5c8a",
    variant: "neon",
  },
];

export const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const getProduct = (id) => products.find((p) => p.id === id);

export const relatedProducts = (id, n = 3) => {
  const current = getProduct(id);
  if (!current) return products.slice(0, n);
  return products
    .filter((p) => p.id !== id)
    .sort((a, b) => {
      const same = (b.category === current.category) - (a.category === current.category);
      return same || b.popularity - a.popularity;
    })
    .slice(0, n);
};
