import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import type { PrebuiltModpack, TexturePack } from "../types";

export async function listModpacks(): Promise<PrebuiltModpack[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(query(collection(db, "modpacks"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PrebuiltModpack);
  } catch {
    return [];
  }
}

export async function listTexturePacks(): Promise<TexturePack[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(query(collection(db, "texturePacks"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TexturePack);
  } catch {
    return [];
  }
}

export async function uploadCatalogFile(kind: "modpacks" | "texturepacks", file: File): Promise<string> {
  if (!storage) throw new Error("Storage isn't configured.");
  const path = `${kind}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

export async function createModpack(
  data: Omit<PrebuiltModpack, "id" | "downloadCount" | "createdAt" | "updatedAt">,
): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await addDoc(collection(db, "modpacks"), {
    ...data,
    downloadCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateModpack(id: string, patch: Partial<PrebuiltModpack>): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await updateDoc(doc(db, "modpacks", id), { ...patch, updatedAt: Date.now() });
}

export async function deleteModpack(id: string): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await deleteDoc(doc(db, "modpacks", id));
}

export async function bumpModpackDownloads(id: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "modpacks", id), { downloadCount: increment(1) }).catch(() => {});
}

export async function createTexturePack(
  data: Omit<TexturePack, "id" | "downloadCount" | "createdAt" | "updatedAt">,
): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await addDoc(collection(db, "texturePacks"), {
    ...data,
    downloadCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateTexturePack(id: string, patch: Partial<TexturePack>): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await updateDoc(doc(db, "texturePacks", id), { ...patch, updatedAt: Date.now() });
}

export async function deleteTexturePack(id: string): Promise<void> {
  if (!db) throw new Error("Firestore isn't configured.");
  await deleteDoc(doc(db, "texturePacks", id));
}

export async function bumpTexturePackDownloads(id: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "texturePacks", id), { downloadCount: increment(1) }).catch(() => {});
}

