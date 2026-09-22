import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, "data");

async function ensureDir() {
  await mkdir(dataDir, { recursive: true });
}

function fileFor(name) {
  return path.join(dataDir, `${name}.json`);
}

async function readList(name) {
  await ensureDir();
  try {
    const raw = await readFile(fileFor(name), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeList(name, items) {
  await ensureDir();
  await writeFile(fileFor(name), `${JSON.stringify(items, null, 2)}\n`, "utf8");
  return items;
}

export function getDataDir() {
  return dataDir;
}

export async function listCollection(name) {
  return readList(name);
}

export async function saveCollection(name, items) {
  return writeList(name, items);
}

export async function listLeads() {
  return readList("leads");
}

export async function addLead(lead) {
  const leads = await listLeads();
  leads.unshift(lead);
  await writeList("leads", leads);
  return lead;
}

export async function updateLead(id, patch) {
  const leads = await listLeads();
  const index = leads.findIndex((item) => item.id === id);
  if (index < 0) return null;
  leads[index] = { ...leads[index], ...patch, id, updatedAt: new Date().toISOString() };
  await writeList("leads", leads);
  return leads[index];
}

export async function upsertItem(name, item) {
  const items = await readList(name);
  const index = items.findIndex((row) => row.id === item.id);
  const next = { ...item, updatedAt: new Date().toISOString() };
  if (index < 0) items.unshift(next);
  else items[index] = { ...items[index], ...next };
  await writeList(name, items);
  return next;
}

export async function removeItem(name, id) {
  const items = await readList(name);
  const next = items.filter((row) => row.id !== id);
  if (next.length === items.length) return false;
  await writeList(name, next);
  return true;
}
