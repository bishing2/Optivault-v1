import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth, ensureSignedIn, firebaseEnabled } from "../lib/firebase";
import { sha256Hex, generateAccessCode } from "../lib/hash";
import type { AccessCodeDoc, RoleDoc, UserRole } from "../types";

interface RoleState {
  ready: boolean;
  uid: string | null;
  role: UserRole | "guest";
  error: string | null;

  init: () => Promise<void>;
  redeemCode: (plainCode: string) => Promise<{ ok: boolean; message: string }>;
  generateHelperCode: (label?: string) => Promise<{ ok: boolean; code?: string; message: string }>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  ready: false,
  uid: null,
  role: "guest",
  error: null,

  init: async () => {
    if (!firebaseEnabled || !db) {
      set({ ready: true, error: "Firebase isn't configured yet." });
      return;
    }
    const user = await ensureSignedIn();
    if (!user) {
      set({ ready: true, error: "Couldn't sign in anonymously." });
      return;
    }
    try {
      const roleSnap = await getDoc(doc(db, "roles", user.uid));
      const role = roleSnap.exists() ? (roleSnap.data() as RoleDoc).role : "guest";
      set({ ready: true, uid: user.uid, role });
    } catch {
      set({ ready: true, uid: user.uid, role: "guest", error: "Couldn't reach the catalog backend." });
    }
  },

  redeemCode: async (plainCode: string) => {
    if (!db) return { ok: false, message: "Firebase isn't configured." };
    const uid = get().uid;
    if (!uid) return { ok: false, message: "Not signed in yet — try again in a moment." };

    const codeHash = await sha256Hex(plainCode);
    const codeSnap = await getDoc(doc(db, "accessCodes", codeHash));
    if (!codeSnap.exists()) {
      return { ok: false, message: "That code isn't valid." };
    }
    const { role } = codeSnap.data() as AccessCodeDoc;

    try {
      await setDoc(doc(db, "roles", uid), {
        role,
        codeHash,
        grantedAt: Date.now(),
      } satisfies RoleDoc);
      set({ role });
      return { ok: true, message: `Code accepted — you're now a ${role}.` };
    } catch {
      return {
        ok: false,
        message: "This device already has a role. Ask an owner to change it.",
      };
    }
  },

  generateHelperCode: async (label) => {
    if (!db) return { ok: false, message: "Firebase isn't configured." };
    const uid = get().uid;
    if (!uid || get().role !== "owner") {
      return { ok: false, message: "Only the owner can create helper codes." };
    }

    const plainCode = generateAccessCode();
    const codeHash = await sha256Hex(plainCode);

    try {
      await setDoc(doc(db, "accessCodes", codeHash), {
        role: "helper",
        createdBy: uid,
        createdAt: Date.now(),
        ...(label ? { label } : {}),
      } satisfies AccessCodeDoc);
      return { ok: true, code: plainCode, message: "Share this code once — it won't be shown again." };
    } catch {
      return { ok: false, message: "Couldn't create the code. Check your connection and try again." };
    }
  },
}));

export function currentAuthUid(): string | null {
  return auth?.currentUser?.uid ?? null;
}
