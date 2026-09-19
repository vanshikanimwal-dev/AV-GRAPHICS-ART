import { whatsappUrl } from "../data/site";
import { WhatsAppIcon } from "./SocialIcons";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      className="wa-fab"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="wa-fab-glyph" />
    </a>
  );
}
