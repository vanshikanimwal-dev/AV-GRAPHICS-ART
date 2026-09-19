import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { site } from "../data/site";

export default function NotFound() {
  return (
    <>
      <Seo title={`Page not found | ${site.name}`} description="This page does not exist." />
      <section className="site-wrap max-w-3xl py-24 text-center">
        <h1 className="font-display text-4xl text-paper">This sign is unlit</h1>
        <p className="mt-4 text-mute">The page you asked for is not on the board.</p>
        <Link to="/" className="btn-glow mt-8 inline-flex rounded-full bg-magenta px-6 py-3 font-semibold">
          Back home
        </Link>
      </section>
    </>
  );
}
