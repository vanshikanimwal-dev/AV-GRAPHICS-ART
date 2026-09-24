const RENDER_ORIGIN = "https://av-graphics-art.onrender.com";

export function apiOrigin() {
  const fromEnv = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "";
  if (host.endsWith("onrender.com")) return "";
  return RENDER_ORIGIN;
}

export function apiUrl(path) {
  return `${apiOrigin()}${path}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function failMessage(res, data) {
  if (data.error) return data.error;
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return "The studio server is waking up. Wait a few seconds and send again, or use WhatsApp.";
  }
  if (!res.ok) return "Request failed.";
  return "Request failed.";
}

async function request(path, options = {}, { retries = 2 } = {}) {
  const url = apiUrl(path);
  let res;
  let data = {};
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    res = await fetch(url, options);
    data = await parseBody(res);
    if (res.ok) return data;
    const transient = res.status === 502 || res.status === 503 || res.status === 504;
    if (!transient || attempt === retries) break;
    await sleep(1800 * (attempt + 1));
  }
  throw new Error(failMessage(res, data));
}

export function wakeApi() {
  fetch(apiUrl("/api/health"), { method: "GET", cache: "no-store" }).catch(() => {});
}

export async function postJson(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function postForm(path, formData) {
  return request(path, {
    method: "POST",
    body: formData,
  });
}

export async function adminFetch(path, { method = "GET", body } = {}) {
  return request(
    path,
    {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    },
    { retries: method === "GET" ? 1 : 0 }
  );
}
