import { apiFetch } from "./api";

export async function getSiteLogoUrl(): Promise<string | null> {
  try {
    const res = await apiFetch<{ url: string | null }>("/api/site-config/logo");
    return res.url;
  } catch {
    return null;
  }
}

export async function setSiteLogoUrl(url: string): Promise<void> {
  await apiFetch("/api/site-config/logo", { method: "PUT", body: JSON.stringify({ url }) });
}
