import { apiFetch } from "./api";
import type { PrebuiltModpack, TexturePack } from "../types";

export async function listModpacks(): Promise<PrebuiltModpack[]> {
  try {
    return await apiFetch<PrebuiltModpack[]>("/api/modpacks");
  } catch {
    return [];
  }
}

export async function listTexturePacks(): Promise<TexturePack[]> {
  try {
    return await apiFetch<TexturePack[]>("/api/texturepacks");
  } catch {
    return [];
  }
}

export async function createModpack(
  data: Omit<PrebuiltModpack, "id" | "downloadCount" | "createdAt" | "updatedAt">,
): Promise<void> {
  await apiFetch("/api/modpacks", { method: "POST", body: JSON.stringify(data) });
}

export async function updateModpack(id: string, patch: Partial<PrebuiltModpack>): Promise<void> {
  await apiFetch(`/api/modpacks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteModpack(id: string): Promise<void> {
  await apiFetch(`/api/modpacks/${id}`, { method: "DELETE" });
}

export async function bumpModpackDownloads(id: string): Promise<void> {
  await apiFetch(`/api/modpacks/${id}/download`, { method: "POST" }).catch(() => {});
}

export async function createTexturePack(
  data: Omit<TexturePack, "id" | "downloadCount" | "createdAt" | "updatedAt">,
): Promise<void> {
  await apiFetch("/api/texturepacks", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTexturePack(id: string, patch: Partial<TexturePack>): Promise<void> {
  await apiFetch(`/api/texturepacks/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteTexturePack(id: string): Promise<void> {
  await apiFetch(`/api/texturepacks/${id}`, { method: "DELETE" });
}

export async function bumpTexturePackDownloads(id: string): Promise<void> {
  await apiFetch(`/api/texturepacks/${id}/download`, { method: "POST" }).catch(() => {});
}
