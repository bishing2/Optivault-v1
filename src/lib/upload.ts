import { ensureDevice } from "./api";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

/** Uploads a file to the backend (which proxies it to a GitHub release), returning its direct download URL. */
export async function uploadFile(file: File): Promise<string> {
  if (!API_BASE) throw new Error("Backend isn't configured.");
  const device = await ensureDevice();
  if (!device) throw new Error("Not signed in yet — try again in a moment.");

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    headers: {
      "X-Device-Id": device.id,
      "X-Device-Token": device.token,
      "X-Filename": file.name,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Upload failed (${res.status})`);
  }
  return (data as { url: string }).url;
}
