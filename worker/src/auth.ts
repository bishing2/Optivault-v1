export interface Env {
  DB: D1Database;
  AUTH_SECRET: string;
  OWNER_SETUP_CODE: string;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.trim()));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function issueDeviceToken(env: Env, deviceId: string): Promise<string> {
  return hmacHex(env.AUTH_SECRET, deviceId);
}

/** Verifies the X-Device-Id / X-Device-Token headers, returning the device id if valid. */
export async function verifyDevice(request: Request, env: Env): Promise<string | null> {
  const deviceId = request.headers.get("X-Device-Id");
  const token = request.headers.get("X-Device-Token");
  if (!deviceId || !token) return null;
  const expected = await hmacHex(env.AUTH_SECRET, deviceId);
  return expected === token ? deviceId : null;
}

export async function getRole(env: Env, deviceId: string | null): Promise<"owner" | "helper" | "guest"> {
  if (!deviceId) return "guest";
  const row = await env.DB.prepare("SELECT role FROM roles WHERE device_id = ?1").bind(deviceId).first<{
    role: string;
  }>();
  return (row?.role as "owner" | "helper" | undefined) ?? "guest";
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function generateAccessCode(length = 12): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}
