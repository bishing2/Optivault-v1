import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getSiteLogoUrl(): Promise<string | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "siteConfig", "logo"));
    return snap.exists() ? ((snap.data().url as string) ?? null) : null;
  } catch {
    return null;
  }
}

export async function setSiteLogoUrl(url: string): Promise<void> {
  if (!db) throw new Error("Firebase isn't configured.");
  await setDoc(doc(db, "siteConfig", "logo"), { url, updatedAt: Date.now() });
}
