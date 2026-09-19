import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { addLead, listLeads } from "./store.js";
import { notifyStudio } from "./mail.js";

dotenv.config();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.join(root, "uploads");
mkdirSync(uploadsDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 8787);
const adminKey = process.env.ADMIN_KEY || "change-me";

const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (recent.length >= 12) {
    return res.status(429).json({ error: "Too many requests. Try again in a few minutes." });
  }
  recent.push(now);
  hits.set(ip, recent);
  next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }
    cb(null, true);
  },
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

function requireAdmin(req, res, next) {
  const key = req.get("x-admin-key") || req.query.key;
  if (!key || key !== adminKey) {
    return res.status(401).json({ error: "Admin key required." });
  }
  next();
}

function clean(value, max = 400) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/quotes", rateLimit, upload.single("image"), async (req, res) => {
  try {
    const name = clean(req.body.name, 80);
    const contact = clean(req.body.contact, 120);
    if (!name || !contact) {
      return res.status(400).json({ error: "Name and phone/email are required." });
    }

    const lead = {
      id: crypto.randomUUID(),
      type: "quote",
      status: "new",
      createdAt: new Date().toISOString(),
      name,
      contact,
      productType: clean(req.body.productType, 80),
      size: clean(req.body.size, 80),
      colors: clean(req.body.colors, 120),
      textLogo: clean(req.body.textLogo, 200),
      budget: clean(req.body.budget, 80),
      message: clean(req.body.message, 2000),
      image: req.file ? `/uploads/${req.file.filename}` : null,
    };

    await addLead(lead);
    await notifyStudio({
      subject: `New quote request from ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Contact: ${lead.contact}`,
        `Type: ${lead.productType || "-"}`,
        `Size: ${lead.size || "-"}`,
        `Colors: ${lead.colors || "-"}`,
        `Text/logo: ${lead.textLogo || "-"}`,
        `Budget: ${lead.budget || "-"}`,
        `Message: ${lead.message || "-"}`,
        `Image: ${lead.image || "none"}`,
      ].join("\n"),
    });

    res.status(201).json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Could not save quote." });
  }
});

app.post("/api/contact", rateLimit, async (req, res) => {
  try {
    const name = clean(req.body.name, 80);
    const contact = clean(req.body.contact, 120);
    const message = clean(req.body.message, 2000);
    if (!name || !contact || !message) {
      return res.status(400).json({ error: "Name, phone/email, and message are required." });
    }

    const lead = {
      id: crypto.randomUUID(),
      type: "contact",
      status: "new",
      createdAt: new Date().toISOString(),
      name,
      contact,
      message,
      image: null,
    };

    await addLead(lead);
    await notifyStudio({
      subject: `New contact message from ${lead.name}`,
      text: [`Name: ${lead.name}`, `Contact: ${lead.contact}`, `Message: ${lead.message}`].join("\n"),
    });

    res.status(201).json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Could not send message." });
  }
});

app.get("/api/leads", requireAdmin, async (_req, res) => {
  const leads = await listLeads();
  res.json({ leads });
});

const distDir = path.join(root, "dist");
app.use(express.static(distDir));
app.get(/^(?!\/api\/|\/uploads\/).*/, (req, res, next) => {
  res.sendFile(path.join(distDir, "index.html"), (err) => {
    if (err) next();
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Request failed." });
});

app.listen(port, () => {
  console.log(`AV Graphics Art API on http://127.0.0.1:${port}`);
});
