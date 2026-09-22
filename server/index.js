import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  addLead,
  getDataDir,
  listCollection,
  listLeads,
  removeItem,
  updateLead,
  upsertItem,
} from "./store.js";
import { notifyStudio } from "./mail.js";
import {
  adminEmail,
  clearSessionCookie,
  createToken,
  passwordMatches,
  requireAdmin,
  sessionFrom,
  setSessionCookie,
} from "./auth.js";

dotenv.config();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.join(getDataDir(), "uploads");
mkdirSync(uploadsDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 8787);

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

const loginHits = new Map();
function loginLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (loginHits.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  if (recent.length >= 8) {
    return res.status(429).json({ error: "Too many sign-in attempts. Wait a few minutes." });
  }
  recent.push(now);
  loginHits.set(ip, recent);
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

app.use(cors({ origin: true, credentials: true }));
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(path.join(root, "uploads")));

function clean(value, max = 400) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function money(value) {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function stamp(base = {}) {
  return {
    ...base,
    id: base.id || crypto.randomUUID(),
    createdAt: base.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
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

    const lead = stamp({
      type: "quote",
      status: "new",
      name,
      contact,
      productType: clean(req.body.productType, 80),
      size: clean(req.body.size, 80),
      colors: clean(req.body.colors, 120),
      textLogo: clean(req.body.textLogo, 200),
      budget: clean(req.body.budget, 80),
      message: clean(req.body.message, 2000),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      notes: [],
    });

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

    const lead = stamp({
      type: "contact",
      status: "new",
      name,
      contact,
      message,
      image: null,
      notes: [],
    });

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

app.get("/api/admin/me", (req, res) => {
  const session = sessionFrom(req);
  if (!session) return res.status(401).json({ error: "Not signed in." });
  res.json({ email: session.email, role: "owner" });
});

app.post("/api/admin/login", loginLimit, (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: "Set ADMIN_PASSWORD on the server before signing in." });
  }
  const email = clean(req.body.email, 120).toLowerCase();
  const password = String(req.body.password || "");
  if (email !== adminEmail() || !passwordMatches(password)) {
    return res.status(401).json({ error: "Only the studio owner can sign in here." });
  }
  setSessionCookie(res, createToken(email));
  res.json({ ok: true, email, role: "owner" });
});

app.post("/api/admin/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/admin/overview", requireAdmin, async (_req, res) => {
  const [leads, orders, workers, tasks] = await Promise.all([
    listLeads(),
    listCollection("orders"),
    listCollection("workers"),
    listCollection("tasks"),
  ]);
  const openJobs = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  res.json({
    enquiries: leads.length,
    newEnquiries: leads.filter((l) => l.status === "new").length,
    jobs: orders.length,
    openJobs: openJobs.length,
    balanceDue: orders.reduce((sum, o) => sum + money(o.balance), 0),
    workers: workers.filter((w) => w.status !== "inactive").length,
    openTasks: tasks.filter((t) => !t.done).length,
  });
});

app.get("/api/leads", requireAdmin, async (_req, res) => {
  const leads = await listLeads();
  res.json({ leads });
});

app.patch("/api/admin/leads/:id", requireAdmin, async (req, res) => {
  const current = (await listLeads()).find((item) => item.id === req.params.id);
  if (!current) return res.status(404).json({ error: "Enquiry not found." });
  const patch = {};
  if (req.body.status) patch.status = clean(req.body.status, 40);
  if (req.body.note) {
    patch.notes = [
      ...(current.notes || []),
      { id: crypto.randomUUID(), text: clean(req.body.note, 800), at: new Date().toISOString() },
    ];
  }
  const lead = await updateLead(req.params.id, patch);
  res.json({ lead });
});

function orderFromBody(body, existing = {}) {
  const total = money(body.total ?? existing.total);
  const advance = money(body.advance ?? existing.advance);
  const services = Array.isArray(body.services)
    ? body.services.map((item) => clean(item, 60)).filter(Boolean)
    : existing.services || [];
  return stamp({
    ...existing,
    type: "job",
    orderNo: clean(body.orderNo ?? existing.orderNo, 40) || `AV-${Date.now().toString().slice(-8)}`,
    date: clean(body.date ?? existing.date, 40),
    customerName: clean(body.customerName ?? existing.customerName, 80),
    company: clean(body.company ?? existing.company, 120),
    mobile: clean(body.mobile ?? existing.mobile, 40),
    productService: clean(body.productService ?? existing.productService, 120),
    size: clean(body.size ?? existing.size, 80),
    quantity: clean(body.quantity ?? existing.quantity, 40),
    material: clean(body.material ?? existing.material, 120),
    designColour: clean(body.designColour ?? existing.designColour, 120),
    installation: clean(body.installation ?? existing.installation, 12) || "no",
    deliveryDate: clean(body.deliveryDate ?? existing.deliveryDate, 40),
    services,
    total,
    advance,
    balance: Math.max(0, Math.round((total - advance) * 100) / 100),
    paymentMode: clean(body.paymentMode ?? existing.paymentMode, 20),
    paymentDate: clean(body.paymentDate ?? existing.paymentDate, 40),
    workerId: clean(body.workerId ?? existing.workerId, 80),
    status: clean(body.status ?? existing.status, 40) || "pending",
    notes: clean(body.notes ?? existing.notes, 2000),
    leadId: clean(body.leadId ?? existing.leadId, 80),
  });
}

app.get("/api/admin/orders", requireAdmin, async (_req, res) => {
  res.json({ orders: await listCollection("orders") });
});

app.post("/api/admin/orders", requireAdmin, async (req, res) => {
  const customerName = clean(req.body.customerName, 80);
  if (!customerName) return res.status(400).json({ error: "Customer name is required." });
  const order = await upsertItem("orders", orderFromBody(req.body));
  if (order.leadId) await updateLead(order.leadId, { status: "won", orderId: order.id });
  res.status(201).json({ order });
});

app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const orders = await listCollection("orders");
  const existing = orders.find((item) => item.id === req.params.id);
  if (!existing) return res.status(404).json({ error: "Job not found." });
  const order = await upsertItem("orders", orderFromBody(req.body, existing));
  res.json({ order });
});

app.delete("/api/admin/orders/:id", requireAdmin, async (req, res) => {
  const ok = await removeItem("orders", req.params.id);
  if (!ok) return res.status(404).json({ error: "Job not found." });
  res.json({ ok: true });
});

function workerFromBody(body, existing = {}) {
  return stamp({
    ...existing,
    name: clean(body.name ?? existing.name, 80),
    phone: clean(body.phone ?? existing.phone, 40),
    role: clean(body.role ?? existing.role, 60) || "Fabricator",
    status: clean(body.status ?? existing.status, 20) || "active",
    notes: clean(body.notes ?? existing.notes, 800),
  });
}

app.get("/api/admin/workers", requireAdmin, async (_req, res) => {
  res.json({ workers: await listCollection("workers") });
});

app.post("/api/admin/workers", requireAdmin, async (req, res) => {
  const name = clean(req.body.name, 80);
  if (!name) return res.status(400).json({ error: "Worker name is required." });
  const worker = await upsertItem("workers", workerFromBody(req.body));
  res.status(201).json({ worker });
});

app.patch("/api/admin/workers/:id", requireAdmin, async (req, res) => {
  const workers = await listCollection("workers");
  const existing = workers.find((item) => item.id === req.params.id);
  if (!existing) return res.status(404).json({ error: "Worker not found." });
  const worker = await upsertItem("workers", workerFromBody(req.body, existing));
  res.json({ worker });
});

app.delete("/api/admin/workers/:id", requireAdmin, async (req, res) => {
  const ok = await removeItem("workers", req.params.id);
  if (!ok) return res.status(404).json({ error: "Worker not found." });
  res.json({ ok: true });
});

function taskFromBody(body, existing = {}) {
  return stamp({
    ...existing,
    title: clean(body.title ?? existing.title, 160),
    dueDate: clean(body.dueDate ?? existing.dueDate, 40),
    workerId: clean(body.workerId ?? existing.workerId, 80),
    orderId: clean(body.orderId ?? existing.orderId, 80),
    done: Boolean(body.done ?? existing.done),
    notes: clean(body.notes ?? existing.notes, 800),
  });
}

app.get("/api/admin/tasks", requireAdmin, async (_req, res) => {
  res.json({ tasks: await listCollection("tasks") });
});

app.post("/api/admin/tasks", requireAdmin, async (req, res) => {
  const title = clean(req.body.title, 160);
  if (!title) return res.status(400).json({ error: "Task title is required." });
  const task = await upsertItem("tasks", taskFromBody(req.body));
  res.status(201).json({ task });
});

app.patch("/api/admin/tasks/:id", requireAdmin, async (req, res) => {
  const tasks = await listCollection("tasks");
  const existing = tasks.find((item) => item.id === req.params.id);
  if (!existing) return res.status(404).json({ error: "Task not found." });
  const task = await upsertItem("tasks", taskFromBody(req.body, existing));
  res.json({ task });
});

app.delete("/api/admin/tasks/:id", requireAdmin, async (req, res) => {
  const ok = await removeItem("tasks", req.params.id);
  if (!ok) return res.status(404).json({ error: "Task not found." });
  res.json({ ok: true });
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
