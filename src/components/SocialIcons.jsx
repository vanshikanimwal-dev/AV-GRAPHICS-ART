import { mailUrl, site, whatsappUrl } from "../data/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="social-glyph" fill="currentColor" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 2.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8zm0 2A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.35 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="social-glyph" fill="currentColor" aria-hidden="true">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.2C12.4 3 11 4.5 11 6.7v1.8H9v2.7h2V21h3.5v-9.8h2.3l.4-2.7h-2.7z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "social-glyph" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="social-glyph" fill="currentColor" aria-hidden="true">
      <path d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9A2.5 2.5 0 0 1 19.5 19h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5zm.2 2.15v.22l6.7 4.36c.37.24.83.24 1.2 0l6.7-4.36v-.22H4.7zm15.1 1.73-6.18 4.02a3.1 3.1 0 0 1-3.24 0L4.2 8.88V16.5c0 .17.13.3.3.3h15c.17 0 .3-.13.3-.3V8.88z" />
    </svg>
  );
}

export default function SocialIcons({ className = "" }) {
  return (
    <div className={`social-row ${className}`}>
      <a
        href={site.instagramUrl}
        target="_blank"
        rel="noreferrer"
        className="social-btn social-ig"
        aria-label="Instagram"
      >
        <InstagramIcon />
      </a>
      <a
        href={site.facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="social-btn social-fb"
        aria-label="Facebook"
      >
        <FacebookIcon />
      </a>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="social-btn social-wa"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <a
        href={mailUrl()}
        target="_blank"
        rel="noreferrer"
        className="social-btn social-mail"
        aria-label={`Email ${site.email}`}
      >
        <MailIcon />
      </a>
    </div>
  );
}

export { WhatsAppIcon };
