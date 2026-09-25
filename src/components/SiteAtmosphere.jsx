export default function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="atm-wash" />
      <div className="atm-grid" />
      <div className="atm-photos">
        <img src="/work/workshop-j101.jpg" alt="" className="atm-photo atm-photo-1" />
        <img src="/work/mahamaya-property.jpg" alt="" className="atm-photo atm-photo-2" />
        <img src="/work/steel-lux-nails.jpg" alt="" className="atm-photo atm-photo-3" />
        <img src="/work/standee-sai.jpg" alt="" className="atm-photo atm-photo-4" />
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
