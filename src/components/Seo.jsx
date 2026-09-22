import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site, workTypesCopy } from "../data/site";

function upsertMeta(attr, key, value) {
  if (value == null || value === "") return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  image,
  noindex = false,
  type = "website",
  product,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const liveOrigin = site.url || window.location.origin;
    const origin = ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? window.location.origin
      : liveOrigin;
    const url = `${origin}${pathname === "/" ? "/" : pathname}`;
    const rawImage = image || "/logo.png";
    const absoluteImage = rawImage.startsWith("http") ? rawImage : `${origin}${rawImage.split("?")[0]}`;

    document.title = title;
    document.documentElement.lang = "en";

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    upsertMeta("name", "author", site.owner);
    upsertMeta("name", "geo.region", "IN-DL");
    upsertMeta("name", "geo.placename", site.city);
    upsertMeta(
      "name",
      "keywords",
      "AV Graphics Art, crystal board Delhi, ACP board, sparkle board, glow sign board, LED board, acrylic plates, plastic letter, steel letter, moving display, name plate, standee, digital prints, Anand Prakash Nimwal"
    );

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type === "product" ? "product" : "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", absoluteImage);
    upsertMeta("property", "og:locale", "en_IN");
    upsertMeta("property", "og:site_name", site.name);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", absoluteImage);

    upsertLink("canonical", url);

    const localBusiness = {
      "@type": "ProfessionalService",
      "@id": `${origin}/#studio`,
      name: site.name,
      image: `${origin}/logo.png`,
      url: origin,
      email: site.email,
      telephone: site.phones[0].tel,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: "IN",
      },
      founder: { "@type": "Person", name: site.owner },
      sameAs: [site.instagramUrl, site.facebookUrl],
      areaServed: site.city,
      description:
        `Custom ${workTypesCopy} in Delhi.`,
    };

    const graph = [localBusiness];

    if (product) {
      const node = {
        "@type": "Product",
        name: product.name,
        description,
        image: absoluteImage,
        brand: { "@type": "Brand", name: site.name },
        url,
      };
      graph.push(node);
    }

    let script = document.getElementById("ld-json");
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-json";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [title, description, image, noindex, type, pathname, product?.id, product?.name]);

  return null;
}
