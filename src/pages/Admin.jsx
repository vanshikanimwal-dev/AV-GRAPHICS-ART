import { useEffect, useMemo, useState } from "react";
import Seo from "../components/Seo";
import { adminFetch } from "../lib/api";
import { site } from "../data/site";

const TABS = ["Overview", "Enquiries", "Jobs", "Money", "Workers", "Tasks", "Expenses"];
const SERVICES = [
  "LED Board",
  "Glow Sign Board",
  "ACP Board",
  "Crystal Board",
  "Sparkle Board",
  "Acrylic Plate",
  "Neon Plate",
  "Plastic Letter",
  "Steel Letter",
  "Moving Display",
  "Name Plate",
  "Standee",
  "Digital Print",
  "Custom Graphics",
];
const LEAD_STATUSES = ["new", "contacted", "quoted", "won", "closed"];
const JOB_STATUSES = ["pending", "in-progress", "ready", "delivered", "cancelled"];
const PAYMENT_MODES = ["CASH", "UPI", "BANK", "OTHER"];
const WORKER_ROLES = ["Designer", "Fabricator", "Installer", "Helper"];
const EXPENSE_CATEGORIES = [
  "Acrylic",
  "LED modules",
  "ACP sheet",
  "Wages",
  "Rent",
  "Transport",
  "Electricity",
  "Print",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

const emptyJob = () => ({
  customerName: "",
  company: "",
  mobile: "",
  orderNo: "",
  date: today(),
  productService: "",
  size: "",
  quantity: "1",
  material: "",
  designColour: "",
  installation: "no",
  deliveryDate: "",
  siteAddress: "",
  services: [],
  total: "",
  advance: "",
  cost: "",
  gst: "",
  paymentMode: "CASH",
  paymentDate: "",
  workerId: "",
  status: "pending",
  notes: "",
  leadId: "",
});

const emptyExpense = () => ({
  date: today(),
  category: "Other",
  amount: "",
  vendor: "",
  notes: "",
  jobId: "",
});

const field =
  "w-full max-w-full rounded-xl border border-white/10 bg-ink px-3 py-2.5 text-base text-paper outline-none ring-magenta/40 placeholder:text-mute/60 focus:ring-2 sm:text-sm";

const inr = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(n) || 0);

const when = (value) => (value ? new Date(value).toLocaleString("en-IN") : "");

export default function Admin() {
  const [email, setEmail] = useState(site.email);
  const [password, setPassword] = useState("");
  const [owner, setOwner] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [overview, setOverview] = useState(null);
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [job, setJob] = useState(emptyJob());
  const [editingJob, setEditingJob] = useState(null);
  const [workerForm, setWorkerForm] = useState({ name: "", phone: "", role: "Fabricator", status: "active", notes: "" });
  const [taskForm, setTaskForm] = useState({ title: "", dueDate: "", workerId: "", notes: "" });
  const [expenseForm, setExpenseForm] = useState(emptyExpense());
  const [paymentForm, setPaymentForm] = useState({ orderId: "", amount: "", mode: "CASH", date: today(), notes: "" });
  const [leadFilter, setLeadFilter] = useState("all");
  const [leadSearch, setLeadSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [noteDrafts, setNoteDrafts] = useState({});

  const load = async () => {
    const [me, stats, leadData, orderData, workerData, taskData, expenseData, paymentData] = await Promise.all([
      adminFetch("/api/admin/me"),
      adminFetch("/api/admin/overview"),
      adminFetch("/api/leads"),
      adminFetch("/api/admin/orders"),
      adminFetch("/api/admin/workers"),
      adminFetch("/api/admin/tasks"),
      adminFetch("/api/admin/expenses"),
      adminFetch("/api/admin/payments"),
    ]);
    setOwner(me);
    setOverview(stats);
    setLeads(leadData.leads || []);
    setOrders(orderData.orders || []);
    setWorkers(workerData.workers || []);
    setTasks(taskData.tasks || []);
    setExpenses(expenseData.expenses || []);
    setPayments(paymentData.payments || []);
  };

  useEffect(() => {
    load().catch(() => setOwner(null));
  }, []);

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminFetch("/api/admin/login", { method: "POST", body: { email, password } });
      setPassword("");
      await load();
    } catch (err) {
      setOwner(null);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onLogout = async () => {
    await adminFetch("/api/admin/logout", { method: "POST" });
    setOwner(null);
    setPassword("");
  };

  const workerName = (id) => workers.find((w) => w.id === id)?.name || "Unassigned";
  const jobLabel = (id) => {
    const order = orders.find((o) => o.id === id);
    return order ? `${order.orderNo} · ${order.customerName}` : "Unlinked";
  };

  const visibleLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    return leads.filter((lead) => {
      const hay = [lead.name, lead.contact, lead.message, lead.productType, lead.source, lead.nextAction]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (leadFilter === "follow-up") {
        return lead.followUpDate && lead.followUpDate <= today() && !["won", "closed"].includes(lead.status);
      }
      if (leadFilter === "all") return true;
      if (leadFilter === "quote" || leadFilter === "contact") return lead.type === leadFilter;
      return lead.status === leadFilter;
    });
  }, [leads, leadFilter, leadSearch]);

  const visibleJobs = useMemo(() => {
    const q = jobSearch.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((order) =>
      [order.customerName, order.mobile, order.orderNo, order.company, order.productService, order.siteAddress]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [orders, jobSearch]);

  const saveJob = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (editingJob) {
        await adminFetch(`/api/admin/orders/${editingJob}`, { method: "PATCH", body: job });
      } else {
        await adminFetch("/api/admin/orders", { method: "POST", body: job });
      }
      setJob(emptyJob());
      setEditingJob(null);
      await load();
      setTab("Jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!owner) {
    return (
      <>
        <Seo title="Studio owner login | AV Graphics Art" description="Private owner console for AV Graphics Art." noindex />
        <section className="admin-page site-wrap">
          <div className="admin-login overflow-hidden">
            <div className="mb-5 grid grid-cols-3 gap-1.5">
              {["/work/workshop-j101.jpg", "/work/mahamaya-property.jpg", "/work/steel-lux-nails.jpg"].map((src) => (
                <img key={src} src={src} alt="" className="h-16 w-full rounded-lg object-cover sm:h-20" />
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.24em] text-magenta">Owner only</p>
            <h1 className="mt-2 font-display text-[clamp(1.4rem,4.6vw,2.25rem)] text-paper">Studio console</h1>
            <p className="mt-3 text-sm text-mute">
              Sign in with {site.email}. Enquiries, jobs, money, workers and expenses stay on this page only.
            </p>
            <form onSubmit={onLogin} className="mt-8 space-y-4">
              <label className="block text-sm">
                <span className="mb-1.5 block text-mute">Email</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-mute">Password</span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
              </label>
              {error && <p className="text-sm text-magenta">{error}</p>}
              <button type="submit" disabled={busy} className="btn-glow w-full rounded-full bg-magenta py-3 font-semibold disabled:opacity-60">
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Studio owner console | AV Graphics Art" description="Private owner console for AV Graphics Art." noindex />
      <section className="admin-page site-wrap">
        <header className="admin-head">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-magenta">Super admin</p>
            <h1 className="mt-1 font-display text-xl text-paper sm:text-3xl">{site.name}</h1>
            <p className="mt-1 text-sm text-mute">{owner.email} · {site.address}</p>
          </div>
          <button type="button" onClick={onLogout} className="rounded-full border border-white/15 px-4 py-2 text-sm text-mute">
            Sign out
          </button>
        </header>

        <div className="chip-row mt-6">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm ${
                tab === item ? "bg-magenta text-white" : "border border-white/15 text-mute"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-magenta">{error}</p>}

        {tab === "Overview" && (
          <div className="mt-8 space-y-6">
            <div className="admin-stats">
              {[
                ["New enquiries", overview?.newEnquiries ?? 0],
                ["Follow-ups due", overview?.followUps ?? 0],
                ["Open jobs", overview?.openJobs ?? 0],
                ["Overdue jobs", overview?.overdueJobs ?? 0],
                ["Billed", inr(overview?.billed)],
                ["Collected", inr(overview?.collected)],
                ["Balance due", inr(overview?.balanceDue)],
                ["This month spend", inr(overview?.monthSpend)],
              ].map(([label, value]) => (
                <article key={label} className="rounded-2xl border border-white/8 bg-ink-2 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-mute">{label}</p>
                  <p className="mt-2 font-display text-2xl text-paper">{value}</p>
                </article>
              ))}
            </div>
            <div className="admin-split">
              <article className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                <h2 className="font-display text-lg text-paper">Latest enquiries</h2>
                <ul className="mt-4 space-y-3">
                  {leads.slice(0, 6).map((lead) => (
                    <li key={lead.id} className="text-sm">
                      <p className="text-paper">{lead.name}</p>
                      <p className="text-mute">{lead.contact} · {lead.type} · {lead.status}{lead.followUpDate ? ` · follow ${lead.followUpDate}` : ""}</p>
                    </li>
                  ))}
                  {leads.length === 0 && <li className="text-sm text-mute">No enquiries yet.</li>}
                </ul>
              </article>
              <article className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                <h2 className="font-display text-lg text-paper">Work in hand</h2>
                <ul className="mt-4 space-y-3">
                  {orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).slice(0, 6).map((order) => (
                    <li key={order.id} className="text-sm">
                      <p className="text-paper">{order.customerName} · {order.orderNo}</p>
                      <p className="text-mute">{order.status} · due {order.deliveryDate || "TBD"} · {inr(order.balance)} due · {workerName(order.workerId)}</p>
                    </li>
                  ))}
                  {orders.length === 0 && <li className="text-sm text-mute">No jobs yet. Convert an enquiry or add a job.</li>}
                </ul>
              </article>
            </div>
            <div className="admin-split">
              <article className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                <h2 className="font-display text-lg text-paper">This month</h2>
                <p className="mt-3 text-sm text-mute">Billed {inr(overview?.monthBilled)} · Spend {inr(overview?.monthSpend)}</p>
                <p className="mt-1 font-display text-xl text-paper">Profit {inr(overview?.monthProfit)}</p>
                <p className="mt-3 text-xs text-mute">{overview?.workers ?? 0} active workers · {overview?.openTasks ?? 0} open tasks</p>
              </article>
              <article className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                <h2 className="font-display text-lg text-paper">Recent payments</h2>
                <ul className="mt-4 space-y-3">
                  {payments.slice(0, 5).map((pay) => (
                    <li key={pay.id} className="text-sm">
                      <p className="text-paper">{inr(pay.amount)} · {pay.mode}</p>
                      <p className="text-mute">{pay.date} · {jobLabel(pay.orderId)}</p>
                    </li>
                  ))}
                  {payments.length === 0 && <li className="text-sm text-mute">No payments recorded yet.</li>}
                </ul>
              </article>
            </div>
          </div>
        )}

        {tab === "Enquiries" && (
          <div className="mt-8">
            <input
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              placeholder="Search name, phone, message…"
              className={`${field} mb-4 max-w-md`}
            />
            <div className="chip-row">
              {["all", "quote", "contact", "follow-up", ...LEAD_STATUSES].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLeadFilter(item)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${
                    leadFilter === item ? "bg-white/15 text-paper" : "border border-white/10 text-mute"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {visibleLeads.length === 0 && <p className="text-mute">No enquiries in this filter.</p>}
              {visibleLeads.map((lead) => (
                <article key={lead.id} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-magenta">{lead.type} · {lead.status}</p>
                    <p className="text-xs text-mute">{when(lead.createdAt)}</p>
                  </div>
                  <h2 className="mt-2 font-display text-lg text-paper">{lead.name}</h2>
                  <p className="text-sm text-blue">{lead.contact}</p>
                  {lead.productType && <p className="mt-2 text-sm text-mute">{lead.productType} · {lead.budget || "budget TBD"}</p>}
                  {lead.size && <p className="text-sm text-mute">Size: {lead.size}</p>}
                  {lead.colors && <p className="text-sm text-mute">Colors: {lead.colors}</p>}
                  {lead.textLogo && <p className="text-sm text-mute">Text/logo: {lead.textLogo}</p>}
                  {lead.message && <p className="mt-2 text-sm text-paper">{lead.message}</p>}
                  {lead.source && <p className="mt-1 text-xs text-mute">Source: {lead.source}</p>}
                  {lead.nextAction && <p className="text-xs text-amber">Next: {lead.nextAction}</p>}
                  {lead.followUpDate && <p className="text-xs text-magenta">Follow up {lead.followUpDate}</p>}
                  {lead.image && (
                    <a href={lead.image} target="_blank" rel="noreferrer" className="mt-3 inline-block">
                      <img src={lead.image} alt={`Reference from ${lead.name}`} className="h-28 rounded-xl object-cover" />
                    </a>
                  )}
                  {lead.notes?.length ? (
                    <ul className="mt-3 space-y-1 text-xs text-mute">
                      {lead.notes.map((note) => (
                        <li key={note.id}>{when(note.at)}: {note.text}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <input
                      type="date"
                      value={lead.followUpDate || ""}
                      className={field}
                      onChange={(e) =>
                        adminFetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: { followUpDate: e.target.value } })
                          .then(load)
                          .catch((err) => setError(err.message))
                      }
                    />
                    <input
                      value={lead.source || ""}
                      placeholder="Source: WhatsApp, walk-in…"
                      className={field}
                      onBlur={(e) =>
                        adminFetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: { source: e.target.value } })
                          .then(load)
                          .catch((err) => setError(err.message))
                      }
                      onChange={(e) =>
                        setLeads((rows) => rows.map((row) => (row.id === lead.id ? { ...row, source: e.target.value } : row)))
                      }
                    />
                    <input
                      value={lead.nextAction || ""}
                      placeholder="Next action"
                      className={`${field} sm:col-span-2`}
                      onBlur={(e) =>
                        adminFetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: { nextAction: e.target.value } })
                          .then(load)
                          .catch((err) => setError(err.message))
                      }
                      onChange={(e) =>
                        setLeads((rows) => rows.map((row) => (row.id === lead.id ? { ...row, nextAction: e.target.value } : row)))
                      }
                    />
                    <div className="flex gap-2 sm:col-span-2">
                      <input
                        value={noteDrafts[lead.id] || ""}
                        placeholder="Add a note"
                        className={field}
                        onChange={(e) => setNoteDrafts((d) => ({ ...d, [lead.id]: e.target.value }))}
                      />
                      <button
                        type="button"
                        className="shrink-0 rounded-full border border-white/15 px-3 py-2 text-xs text-mute"
                        onClick={() => {
                          const note = (noteDrafts[lead.id] || "").trim();
                          if (!note) return;
                          adminFetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: { note } })
                            .then(() => {
                              setNoteDrafts((d) => ({ ...d, [lead.id]: "" }));
                              return load();
                            })
                            .catch((err) => setError(err.message));
                        }}
                      >
                        Note
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {LEAD_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-mute"
                        onClick={() => adminFetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", body: { status } }).then(load).catch((err) => setError(err.message))}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-full bg-magenta px-3 py-1 text-xs font-semibold"
                      onClick={() => {
                        setJob({
                          ...emptyJob(),
                          customerName: lead.name,
                          mobile: lead.contact,
                          productService: lead.productType || "",
                          size: lead.size || "",
                          designColour: lead.colors || "",
                          notes: lead.message || "",
                          leadId: lead.id,
                        });
                        setEditingJob(null);
                        setTab("Jobs");
                      }}
                    >
                      Convert to job
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "Jobs" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <form onSubmit={saveJob} className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2">
              <h2 className="font-display text-xl text-paper">{editingJob ? "Update job" : "New job / receipt"}</h2>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Customer name</span><input required value={job.customerName} onChange={(e) => setJob({ ...job, customerName: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Mobile</span><input value={job.mobile} onChange={(e) => setJob({ ...job, mobile: e.target.value })} className={field} /></label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Company / shop</span><input value={job.company} onChange={(e) => setJob({ ...job, company: e.target.value })} className={field} /></label>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Site / install address</span><input value={job.siteAddress} onChange={(e) => setJob({ ...job, siteAddress: e.target.value })} className={field} /></label>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Order no.</span><input value={job.orderNo} onChange={(e) => setJob({ ...job, orderNo: e.target.value })} placeholder="Auto if blank" className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Date</span><input type="date" value={job.date} onChange={(e) => setJob({ ...job, date: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Product / service</span><input value={job.productService} onChange={(e) => setJob({ ...job, productService: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Size / dimensions</span><input value={job.size} onChange={(e) => setJob({ ...job, size: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Quantity</span><input value={job.quantity} onChange={(e) => setJob({ ...job, quantity: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Material / finish</span><input value={job.material} onChange={(e) => setJob({ ...job, material: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Design / colour</span><input value={job.designColour} onChange={(e) => setJob({ ...job, designColour: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Delivery date</span><input type="date" value={job.deliveryDate} onChange={(e) => setJob({ ...job, deliveryDate: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Installation</span>
                  <select value={job.installation} onChange={(e) => setJob({ ...job, installation: e.target.value })} className={field}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Assign worker</span>
                  <select value={job.workerId} onChange={(e) => setJob({ ...job, workerId: e.target.value })} className={field}>
                    <option value="">Unassigned</option>
                    {workers.filter((w) => w.status !== "inactive").map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <fieldset>
                <legend className="mb-2 text-sm text-mute">Services / products</legend>
                <div className="admin-checks">
                  {SERVICES.map((service) => (
                    <label key={service} className="flex items-center gap-2 text-sm text-paper">
                      <input
                        type="checkbox"
                        checked={job.services.includes(service)}
                        onChange={(e) =>
                          setJob({
                            ...job,
                            services: e.target.checked
                              ? [...job.services, service]
                              : job.services.filter((item) => item !== service),
                          })
                        }
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Total amount</span><input inputMode="decimal" value={job.total} onChange={(e) => setJob({ ...job, total: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Advance paid</span><input inputMode="decimal" value={job.advance} onChange={(e) => setJob({ ...job, advance: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Material cost</span><input inputMode="decimal" value={job.cost} onChange={(e) => setJob({ ...job, cost: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">GST amount</span><input inputMode="decimal" value={job.gst} onChange={(e) => setJob({ ...job, gst: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Payment mode</span>
                  <select value={job.paymentMode} onChange={(e) => setJob({ ...job, paymentMode: e.target.value })} className={field}>
                    {PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}
                  </select>
                </label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Payment date</span><input type="date" value={job.paymentDate} onChange={(e) => setJob({ ...job, paymentDate: e.target.value })} className={field} /></label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Status</span>
                <select value={job.status} onChange={(e) => setJob({ ...job, status: e.target.value })} className={field}>
                  {JOB_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Notes</span><textarea rows={3} value={job.notes} onChange={(e) => setJob({ ...job, notes: e.target.value })} className={field} /></label>
              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={busy} className="btn-glow rounded-full bg-magenta px-5 py-2.5 font-semibold disabled:opacity-60">
                  {busy ? "Saving…" : editingJob ? "Update job" : "Save job"}
                </button>
                {editingJob && (
                  <button type="button" className="rounded-full border border-white/15 px-4 py-2 text-sm text-mute" onClick={() => { setEditingJob(null); setJob(emptyJob()); }}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
            <div className="space-y-4">
              <input
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search jobs by name, phone, order no…"
                className={field}
              />
              {visibleJobs.length === 0 && <p className="text-mute">No jobs saved yet.</p>}
              {visibleJobs.map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-magenta">{order.orderNo} · {order.status}</p>
                    <p className="text-xs text-mute">{order.date || when(order.createdAt)}</p>
                  </div>
                  <h3 className="mt-2 font-display text-lg text-paper">{order.customerName}</h3>
                  <p className="text-sm text-mute">{order.company} {order.mobile}</p>
                  {order.siteAddress && <p className="text-xs text-mute">{order.siteAddress}</p>}
                  <p className="mt-2 text-sm text-paper">{order.productService || order.services?.join(", ") || "Custom work"}</p>
                  <p className="mt-2 text-sm text-amber">Total {inr(order.total)} · Advance {inr(order.advance)} · Due {inr(order.balance)}</p>
                  <p className="mt-1 text-xs text-mute">Cost {inr(order.cost)} · GST {inr(order.gst)} · Profit {inr(order.profit)}</p>
                  <p className="mt-1 text-xs text-mute">Worker: {workerName(order.workerId)} · Install: {order.installation}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-mute"
                      onClick={() => {
                        setEditingJob(order.id);
                        setJob({
                          ...emptyJob(),
                          ...order,
                          total: order.total ?? "",
                          advance: order.advance ?? "",
                          cost: order.cost ?? "",
                          gst: order.gst ?? "",
                          services: order.services || [],
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-magenta/40 px-3 py-1 text-xs text-magenta"
                      onClick={() => adminFetch(`/api/admin/orders/${order.id}`, { method: "DELETE" }).then(load).catch((err) => setError(err.message))}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "Money" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await adminFetch("/api/admin/payments", { method: "POST", body: paymentForm });
                  setPaymentForm({ orderId: "", amount: "", mode: "CASH", date: today(), notes: "" });
                  await load();
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl text-paper">Record a payment</h2>
              <p className="text-sm text-mute">Billed {inr(overview?.billed)} · Collected {inr(overview?.collected)} · Due {inr(overview?.balanceDue)}</p>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Job</span>
                <select required value={paymentForm.orderId} onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })} className={field}>
                  <option value="">Select a job</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>{order.orderNo} · {order.customerName} · due {inr(order.balance)}</option>
                  ))}
                </select>
              </label>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Amount</span><input required inputMode="decimal" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Mode</span>
                  <select value={paymentForm.mode} onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })} className={field}>
                    {PAYMENT_MODES.map((mode) => <option key={mode}>{mode}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Date</span><input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} className={field} /></label>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Notes</span><input value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} className={field} /></label>
              <button type="submit" disabled={busy} className="btn-glow rounded-full bg-magenta px-5 py-2.5 font-semibold disabled:opacity-60">Save payment</button>
            </form>
            <div className="space-y-4">
              {orders.filter((o) => moneyDue(o)).slice(0, 8).map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-magenta">{order.orderNo}</p>
                  <h3 className="mt-2 font-display text-lg text-paper">{order.customerName}</h3>
                  <p className="mt-1 text-sm text-amber">Due {inr(order.balance)} of {inr(order.total)}</p>
                </article>
              ))}
              <h3 className="pt-2 font-display text-lg text-paper">Payment log</h3>
              {payments.length === 0 && <p className="text-mute">No extra payments logged yet.</p>}
              {payments.map((pay) => (
                <article key={pay.id} className="rounded-2xl border border-white/8 bg-ink-2 p-4">
                  <p className="text-paper">{inr(pay.amount)} · {pay.mode}</p>
                  <p className="text-xs text-mute">{pay.date} · {jobLabel(pay.orderId)} {pay.notes ? `· ${pay.notes}` : ""}</p>
                  <button type="button" className="mt-2 text-xs text-magenta" onClick={() => adminFetch(`/api/admin/payments/${pay.id}`, { method: "DELETE" }).then(load).catch((err) => setError(err.message))}>Remove log</button>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "Workers" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                try {
                  const path = workerForm.id ? `/api/admin/workers/${workerForm.id}` : "/api/admin/workers";
                  await adminFetch(path, { method: workerForm.id ? "PATCH" : "POST", body: workerForm });
                  setWorkerForm({ name: "", phone: "", role: "Fabricator", status: "active", notes: "" });
                  await load();
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl text-paper">{workerForm.id ? "Update worker" : "Add worker"}</h2>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Name</span><input required value={workerForm.name} onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })} className={field} /></label>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Phone</span><input value={workerForm.phone} onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })} className={field} /></label>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Role</span>
                  <select value={workerForm.role} onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })} className={field}>
                    {WORKER_ROLES.map((role) => <option key={role}>{role}</option>)}
                  </select>
                </label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Status</span>
                  <select value={workerForm.status} onChange={(e) => setWorkerForm({ ...workerForm, status: e.target.value })} className={field}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Notes</span><textarea rows={3} value={workerForm.notes} onChange={(e) => setWorkerForm({ ...workerForm, notes: e.target.value })} className={field} /></label>
              <button type="submit" disabled={busy} className="btn-glow rounded-full bg-magenta px-5 py-2.5 font-semibold disabled:opacity-60">
                {workerForm.id ? "Update worker" : "Save worker"}
              </button>
            </form>
            <div className="space-y-4">
              {workers.length === 0 && <p className="text-mute">Add the people who fabricate and install your boards.</p>}
              {workers.map((worker) => (
                <article key={worker.id} className="rounded-2xl border border-white/8 bg-ink-2 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-magenta">{worker.role} · {worker.status}</p>
                  <h3 className="mt-2 font-display text-lg text-paper">{worker.name}</h3>
                  <p className="text-sm text-blue">{worker.phone}</p>
                  {worker.notes && <p className="mt-2 text-sm text-mute">{worker.notes}</p>}
                  <p className="mt-2 text-xs text-mute">Jobs: {orders.filter((o) => o.workerId === worker.id).length}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-full border border-white/15 px-3 py-1 text-xs text-mute" onClick={() => setWorkerForm(worker)}>Edit</button>
                    <button type="button" className="rounded-full border border-magenta/40 px-3 py-1 text-xs text-magenta" onClick={() => adminFetch(`/api/admin/workers/${worker.id}`, { method: "DELETE" }).then(load).catch((err) => setError(err.message))}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "Tasks" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await adminFetch("/api/admin/tasks", { method: "POST", body: taskForm });
                  setTaskForm({ title: "", dueDate: "", workerId: "", notes: "" });
                  await load();
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl text-paper">What has to be done</h2>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Task</span><input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className={field} /></label>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Due date</span><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Assign to</span>
                  <select value={taskForm.workerId} onChange={(e) => setTaskForm({ ...taskForm, workerId: e.target.value })} className={field}>
                    <option value="">Unassigned</option>
                    {workers.filter((w) => w.status !== "inactive").map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Notes</span><textarea rows={3} value={taskForm.notes} onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })} className={field} /></label>
              <button type="submit" disabled={busy} className="btn-glow rounded-full bg-magenta px-5 py-2.5 font-semibold disabled:opacity-60">Add task</button>
            </form>
            <div className="space-y-3">
              {tasks.length === 0 && <p className="text-mute">No open work items yet.</p>}
              {tasks.map((task) => (
                <article key={task.id} className={`rounded-2xl border p-4 ${task.done ? "border-white/5 bg-ink-2/50 text-mute" : "border-white/8 bg-ink-2"}`}>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(task.done)}
                      onChange={() => adminFetch(`/api/admin/tasks/${task.id}`, { method: "PATCH", body: { ...task, done: !task.done } }).then(load).catch((err) => setError(err.message))}
                      className="mt-1"
                    />
                    <span>
                      <p className={`font-display text-paper ${task.done ? "line-through opacity-60" : ""}`}>{task.title}</p>
                      <p className="mt-1 text-xs text-mute">Due {task.dueDate || "anytime"} · {workerName(task.workerId)}</p>
                      {task.notes && <p className="mt-1 text-sm text-mute">{task.notes}</p>}
                    </span>
                  </label>
                  <button type="button" className="mt-3 text-xs text-magenta" onClick={() => adminFetch(`/api/admin/tasks/${task.id}`, { method: "DELETE" }).then(load).catch((err) => setError(err.message))}>Remove</button>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "Expenses" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form
              className="form-card space-y-4 rounded-3xl border border-white/10 bg-ink-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await adminFetch("/api/admin/expenses", { method: "POST", body: expenseForm });
                  setExpenseForm(emptyExpense());
                  await load();
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <h2 className="font-display text-xl text-paper">Studio expense</h2>
              <p className="text-sm text-mute">This month {inr(overview?.monthSpend)}</p>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Date</span><input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} className={field} /></label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Amount</span><input required inputMode="decimal" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className={field} /></label>
              </div>
              <div className="split-form">
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Category</span>
                  <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className={field}>
                    {EXPENSE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block text-sm"><span className="mb-1.5 block text-mute">Link to job</span>
                  <select value={expenseForm.jobId} onChange={(e) => setExpenseForm({ ...expenseForm, jobId: e.target.value })} className={field}>
                    <option value="">None</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>{order.orderNo} · {order.customerName}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Vendor</span><input value={expenseForm.vendor} onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} className={field} /></label>
              <label className="block text-sm"><span className="mb-1.5 block text-mute">Notes</span><textarea rows={3} value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} className={field} /></label>
              <button type="submit" disabled={busy} className="btn-glow rounded-full bg-magenta px-5 py-2.5 font-semibold disabled:opacity-60">Save expense</button>
            </form>
            <div className="space-y-3">
              {expenses.length === 0 && <p className="text-mute">Log acrylic, LED, wages, rent and transport here.</p>}
              {expenses.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/8 bg-ink-2 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-magenta">{item.category}</p>
                  <h3 className="mt-1 font-display text-lg text-paper">{inr(item.amount)}</h3>
                  <p className="text-xs text-mute">{item.date} {item.vendor ? `· ${item.vendor}` : ""} {item.jobId ? `· ${jobLabel(item.jobId)}` : ""}</p>
                  {item.notes && <p className="mt-1 text-sm text-mute">{item.notes}</p>}
                  <button type="button" className="mt-2 text-xs text-magenta" onClick={() => adminFetch(`/api/admin/expenses/${item.id}`, { method: "DELETE" }).then(load).catch((err) => setError(err.message))}>Remove</button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function moneyDue(order) {
  return Number(order.balance) > 0 && !["cancelled"].includes(order.status);
}
