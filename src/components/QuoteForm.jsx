import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, site, whatsappUrl } from "../data/site";
import { serviceNames } from "../data/products";
import { postForm } from "../lib/api";

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
  const [params] = useSearchParams();
  const requested = params.get("service") || "";
  const [form, setForm] = useState(() => ({
    ...empty,
    productType: serviceNames.includes(requested) ? requested : empty.productType,
  }));
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!requested) return;
    setForm((f) => ({
      ...f,
      productType: serviceNames.includes(requested) ? requested : requested,
    }));
  }, [requested]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e) => {
    const next = e.target.files?.[0];
    if (!next) return;
    setFile(next);
    setFileName(next.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(next);
  };

  const typeOptions = [...new Set([...categories, ...serviceNames, requested].filter(Boolean))];

  const whatsappText = [
    `Quote request from ${form.name}`,
    `Contact: ${form.contact}`,
    `Service: ${form.productType}`,
    `Size: ${form.size || "to discuss"}`,
    `Colors: ${form.colors || "to discuss"}`,
    `Text/logo: ${form.textLogo || "to discuss"}`,
    `Budget: ${form.budget}`,
    form.message,
  ]
    .filter(Boolean)
    .join("\n");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (file) data.append("image", file);
      await postForm("/api/quotes", data);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not save the quote. Try WhatsApp if this keeps happening.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full max-w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-paper outline-none ring-magenta/40 placeholder:text-mute/60 focus:ring-2";

  if (sent) {
    return (
      <div className="rounded-3xl border border-magenta/40 bg-ink-2 p-8 text-center">
        <p className="font-display text-xl text-paper">Brief saved</p>
        <p className="mt-3 text-sm text-mute">
          {site.owner} has your request. Continue on WhatsApp if you want a faster reply.
        </p>
        <a
          href={whatsappUrl(whatsappText)}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-[#25D366] px-5 py-3 font-semibold text-ink"
        >
          Continue on WhatsApp
        </a>
        <button
          type="button"
          className="mt-4 block w-full text-sm text-mute"
          onClick={() => {
            setSent(false);
            setForm({
              ...empty,
              productType: serviceNames.includes(requested) ? requested : empty.productType,
            });
            setFile(null);
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
    <form onSubmit={onSubmit} className="min-w-0 space-y-4 rounded-3xl border border-white/10 bg-ink-2 p-5 sm:p-8">
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
        <span className="mb-1.5 block text-mute">Service required</span>
        <select name="productType" value={form.productType} onChange={update} className={field}>
          {typeOptions.map((c) => (
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
        <span className="mb-1.5 block text-mute">Message / requirements</span>
        <textarea name="message" rows={4} value={form.message} onChange={update} className={field} />
      </label>
      <p className="text-xs leading-relaxed text-mute">
        Every piece is designed personally by {site.owner}. Your brief is saved for the studio — no payment is taken here.
      </p>
      {error && <p className="text-sm text-magenta">{error}</p>}
      <button type="submit" disabled={busy} className="btn-glow w-full rounded-full bg-magenta py-3 font-semibold disabled:opacity-60">
        {busy ? "Saving…" : "Send quote request"}
      </button>
    </form>
  );
}
