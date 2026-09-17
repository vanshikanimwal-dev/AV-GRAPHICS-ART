import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "leads.json");

async function ensure() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, "[]\n", "utf8");
  }
}

export async function listLeads() {
  await ensure();
  const raw = await readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addLead(lead) {
  const leads = await listLeads();
  leads.unshift(lead);
  await writeFile(dataFile, `${JSON.stringify(leads, null, 2)}\n`, "utf8");
  return lead;
}
