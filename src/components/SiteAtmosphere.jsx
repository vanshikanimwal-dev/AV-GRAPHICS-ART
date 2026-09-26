export default function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-wash" />
      <div className="atm-grid" />
      <div className="atm-photos">
        <img src="/work/workshop-ceiling.jpg" alt="" className="atm-photo atm-photo-1" />
        <img src="/work/halo-letters-gold.jpg" alt="" className="atm-photo atm-photo-2" />
        <img src="/work/neon-flex-display.jpg" alt="" className="atm-photo atm-photo-3" />
        <img src="/work/workshop-nameplates.jpg" alt="" className="atm-photo atm-photo-4" />
      </div>
      <div className="atm-orbs">
        <span className="atm-orb atm-orb-pink" />
        <span className="atm-orb atm-orb-cyan" />
        <span className="atm-orb atm-orb-amber" />
        <span className="atm-orb atm-orb-pink-2" />
      </div>
      <div className="atm-beam" />
      <div className="atm-sparks" />
      <span className="atm-strip atm-strip-left" />
      <span className="atm-strip atm-strip-right" />
      <div className="atm-vignette" />
    </div>
  );
}
