import Dexie, { type Table } from "dexie";
import type { CVDocument } from "./types";

class CVDatabase extends Dexie {
  documents!: Table<CVDocument, string>;

  constructor() {
    super("cv-builder-id-v1");
    this.version(1).stores({
      documents: "id, updatedAt, name, templateId, type",
    });
  }
}

let instance: CVDatabase | null = null;

export function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!instance) instance = new CVDatabase();
  return instance;
}

export async function listCVs() {
  const all = await getDb().documents.toArray();
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCV(id: string) {
  return getDb().documents.get(id);
}

export async function saveCV(doc: CVDocument) {
  const next = { ...doc, updatedAt: new Date().toISOString() };
  await getDb().documents.put(next);
  return next;
}

export async function deleteCV(id: string) {
  await getDb().documents.delete(id);
}

export async function duplicateCV(doc: CVDocument): Promise<CVDocument> {
  const now = new Date().toISOString();
  const copy: CVDocument = {
    ...structuredClone(doc),
    id: crypto.randomUUID(),
    name: `${doc.name} (copy)`,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().documents.put(copy);
  return copy;
}
