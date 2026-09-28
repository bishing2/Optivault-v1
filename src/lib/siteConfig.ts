import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

export async function getSiteLogoUrl(): Promise<string | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "siteConfig", "logo"));
    return snap.exists() ? ((snap.data().url as string) ?? null) : null;
  } catch {
    return null;
  }
}

export async function setSiteLogo(file: File): Promise<string> {
  if (!storage || !db) throw new Error("Firebase isn't configured.");
  const fileRef = ref(storage, `branding/logo-${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  await setDoc(doc(db, "siteConfig", "logo"), { url, updatedAt: Date.now() });
  return url;
}
