import { useState } from "react";
import { categories, site, whatsappUrl } from "../data/site";

const empty = {
  name: "",
  contact: "",
  productType: categories[0],
  size: "",
  colors: "",
  textLogo: "",
  budget: "₹3,000 – ₹7,000",
  message: "",
};

export default function QuoteForm() {
  const [form, setForm] = useState(empty);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [sent, setSent] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    const text = [
      `Quote request from ${form.name}`,
      `Contact: ${form.contact}`,
      `Type: ${form.productType}`,
      `Size: ${form.size || "to discuss"}`,
      `Colors: ${form.colors || "to discuss"}`,
      `Text/logo: ${form.textLogo || "to discuss"}`,
      `Budget: ${form.budget}`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappUrl(text), "_blank", "noreferrer");
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-paper outline-none ring-magenta/40 placeholder:text-mute/60 focus:ring-2";

  if (sent) {
    return (
      <div className="rounded-3xl border border-magenta/40 bg-ink-2 p-8 text-center">
        <p className="font-display text-xl text-paper">Request ready</p>
        <p className="mt-3 text-sm text-mute">
          WhatsApp should open with your details. If it did not, use the chat button beside this form.
        </p>
        <button
          type="button"
          className="mt-6 rounded-full border border-white/15 px-4 py-2 text-sm"
          onClick={() => {
            setSent(false);
            setForm(empty);
            setFileName("");
            setPreview("");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-ink-2 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-mute">Name</span>
          <input name="name" required value={form.name} onChange={update} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-mute">Phone / Email</span>
          <input name="contact" required value={form.contact} onChange={update} className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Product type</span>
        <select name="productType" value={form.productType} onChange={update} className={field}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-mute">Size</span>
          <input name="size" value={form.size} onChange={update} placeholder="e.g. 24 × 12 in" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-mute">Preferred colors</span>
          <input name="colors" value={form.colors} onChange={update} placeholder="Magenta, white…" className={field} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Text / logo to include</span>
        <input name="textLogo" value={form.textLogo} onChange={update} className={field} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Budget range</span>
        <select name="budget" value={form.budget} onChange={update} className={field}>
          <option>Under ₹3,000</option>
          <option>₹3,000 – ₹7,000</option>
          <option>₹7,000 – ₹15,000</option>
          <option>₹15,000+</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Reference image</span>
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="w-full text-sm text-mute file:mr-3 file:rounded-full file:border-0 file:bg-magenta file:px-4 file:py-2 file:text-white"
        />
        {fileName && <p className="mt-2 text-xs text-mute">{fileName}</p>}
        {preview && (
          <img src={preview} alt="Reference upload preview" className="mt-3 h-28 rounded-xl object-cover" />
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Message</span>
        <textarea name="message" rows={4} value={form.message} onChange={update} className={field} />
      </label>
      <p className="text-xs leading-relaxed text-mute">
        Every piece is designed personally by {site.owner}. This form prepares a WhatsApp brief — no payment is taken here.
      </p>
      <button type="submit" className="btn-glow w-full rounded-full bg-magenta py-3 font-semibold">
        Send quote request
      </button>
    </form>
  );
}
