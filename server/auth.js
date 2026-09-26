import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

export const COOKIE_NAME = "avga_session";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function adminEmail() {
  return String(process.env.ADMIN_EMAIL || "avgraphicsart16@gmail.com")
    .trim()
    .toLowerCase();
}

function secret() {
  return String(process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "");
}

function hmac(value) {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(value).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createToken(email) {
  const body = Buffer.from(JSON.stringify({ email, exp: Date.now() + WEEK_MS })).toString("base64url");
  return `${body}.${hmac(body)}`;
}

export function readToken(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = hmac(body);
  if (!expected || !safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!data?.email || Number(data.exp) < Date.now()) return null;
    if (String(data.email).toLowerCase() !== adminEmail()) return null;
    return data;
  } catch {
    return null;
  }
}

export function passwordMatches(password) {
  const expected = String(process.env.ADMIN_PASSWORD || "").trim();
  if (!expected || !password) return false;
  const salt = secret() || "avga";
  const left = scryptSync(String(password), salt, 32);
  const right = scryptSync(expected, salt, 32);
  return timingSafeEqual(left, right);
}

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    const index = trimmed.indexOf("=");
    if (index < 0) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    try {
      out[key] = decodeURIComponent(value);
    } catch {
      out[key] = value;
    }
  });
  return out;
}

export function sessionFrom(req) {
  const cookieSession = readToken(parseCookies(req)[COOKIE_NAME]);
  if (cookieSession) return cookieSession;
  const header = String(req.get("authorization") || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? readToken(match[1].trim()) : null;
}

function cookieSecure() {
  return (
    Boolean(process.env.RENDER) ||
    process.env.COOKIE_SECURE === "true" ||
    String(process.env.SITE_URL || "").startsWith("https://")
  );
}

function cookieFlags(req) {
  let sameSite = "Lax";
  const origin = String(req?.headers?.origin || "");
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      if (host !== "localhost" && host !== "127.0.0.1" && !host.endsWith("onrender.com")) {
        sameSite = "None";
      }
    } catch {
      sameSite = "Lax";
    }
  }
  const secure = cookieSecure() || sameSite === "None";
  return `HttpOnly; Path=/; Max-Age=${Math.floor(WEEK_MS / 1000)}; SameSite=${sameSite}${secure ? "; Secure" : ""}`;
}

export function setSessionCookie(res, token, req) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieFlags(req)}`);
}

export function clearSessionCookie(res, req) {
  const secure = cookieSecure();
  let sameSite = "Lax";
  const origin = String(req?.headers?.origin || "");
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      if (host !== "localhost" && host !== "127.0.0.1" && !host.endsWith("onrender.com")) {
        sameSite = "None";
      }
    } catch {
      sameSite = "Lax";
    }
  }
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure || sameSite === "None" ? "; Secure" : ""}`
  );
}

export function requireAdmin(req, res, next) {
  const session = sessionFrom(req);
  if (session) {
    req.admin = session;
    return next();
  }

  const key = req.get("x-admin-key") || req.query.key;
  const expectedKey = process.env.ADMIN_KEY || "";
  if (key && expectedKey && key === expectedKey) {
    req.admin = { email: adminEmail(), via: "key" };
    return next();
  }

  return res.status(401).json({ error: "Sign in as the studio owner to continue." });
}
