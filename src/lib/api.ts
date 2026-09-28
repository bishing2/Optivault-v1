const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

export const apiEnabled = Boolean(API_BASE);

const LS_ID = "ov_device_id";
const LS_TOKEN = "ov_device_token";

interface Device {
  id: string;
  token: string;
}

let devicePromise: Promise<Device | null> | null = null;

async function registerDevice(): Promise<Device | null> {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/api/register`, { method: "POST" });
  if (!res.ok) return null;
  const data = (await res.json()) as { deviceId: string; token: string };
  localStorage.setItem(LS_ID, data.deviceId);
  localStorage.setItem(LS_TOKEN, data.token);
  return { id: data.deviceId, token: data.token };
}

export function ensureDevice(): Promise<Device | null> {
  if (!API_BASE) return Promise.resolve(null);
  if (devicePromise) return devicePromise;

  const id = localStorage.getItem(LS_ID);
  const token = localStorage.getItem(LS_TOKEN);
  devicePromise = id && token ? Promise.resolve({ id, token }) : registerDevice();
  return devicePromise;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new Error("Backend isn't configured.");
  const device = await ensureDevice();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (device) {
    headers["X-Device-Id"] = device.id;
    headers["X-Device-Token"] = device.token;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export async function currentDeviceId(): Promise<string | null> {
  const device = await ensureDevice();
  return device?.id ?? null;
}
