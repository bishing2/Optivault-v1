import { create } from "zustand";
import { apiFetch, apiEnabled, currentDeviceId } from "../lib/api";
import type { UserRole } from "../types";

interface RoleState {
  ready: boolean;
  uid: string | null;
  role: UserRole | "guest";
  error: string | null;

  init: () => Promise<void>;
  redeemCode: (plainCode: string) => Promise<{ ok: boolean; message: string }>;
  generateHelperCode: () => Promise<{ ok: boolean; code?: string; message: string }>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  ready: false,
  uid: null,
  role: "guest",
  error: null,

  init: async () => {
    if (!apiEnabled) {
      set({ ready: true, error: "Backend isn't configured yet." });
      return;
    }
    try {
      const uid = await currentDeviceId();
      const res = await apiFetch<{ deviceId: string; role: UserRole | "guest" }>("/api/me");
      set({ ready: true, uid, role: res.role });
    } catch {
      set({ ready: true, role: "guest", error: "Couldn't reach the catalog backend." });
    }
  },

  redeemCode: async (plainCode: string) => {
    try {
      const res = await apiFetch<{ ok: boolean; role?: UserRole; message: string }>("/api/redeem", {
        method: "POST",
        body: JSON.stringify({ code: plainCode }),
      });
      if (res.ok && res.role) set({ role: res.role });
      return { ok: res.ok, message: res.message };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Couldn't redeem this code." };
    }
  },

  generateHelperCode: async () => {
    if (get().role !== "owner") {
      return { ok: false, message: "Only the owner can create helper codes." };
    }
    try {
      const res = await apiFetch<{ ok: boolean; code: string }>("/api/codes", { method: "POST", body: "{}" });
      return { ok: true, code: res.code, message: "Share this code once — it won't be shown again." };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Couldn't create the code." };
    }
  },
}));
