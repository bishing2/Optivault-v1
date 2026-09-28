import { create } from "zustand";
import type { DevicePreset, Loader, QueuedMod } from "../types";
import { DEVICES } from "../data/devices";

export const MC_VERSIONS = [
  "1.21.4",
  "1.21.1",
  "1.20.4",
  "1.20.1",
  "1.19.4",
  "1.18.2",
  "1.16.5",
];

export const LOADERS: { id: Loader; label: string }[] = [
  { id: "fabric", label: "Fabric" },
  { id: "forge", label: "Forge" },
  { id: "neoforge", label: "NeoForge" },
  { id: "quilt", label: "Quilt" },
];

interface AppState {
  mcVersion: string;
  loader: Loader;
  selectedDeviceId: string;
  ramMB: number;
  modQueue: QueuedMod[];
  javaVersion: number;

  setMcVersion: (v: string) => void;
  setLoader: (l: Loader) => void;
  selectDevice: (id: string) => void;
  setRamMB: (mb: number) => void;

  addMod: (mod: QueuedMod) => void;
  removeMod: (id: string) => void;
  isQueued: (id: string) => boolean;
  clearQueue: () => void;

  selectedDevice: () => DevicePreset | null;
  estimatedRamUsedMB: () => number;
}

const DEFAULT_DEVICE = DEVICES[0];

export const useAppStore = create<AppState>((set, get) => ({
  mcVersion: "1.21.4",
  loader: "fabric",
  selectedDeviceId: DEFAULT_DEVICE.id,
  ramMB: DEFAULT_DEVICE.recommendedRamMB,
  modQueue: [],
  javaVersion: 21,

  setMcVersion: (v) => set({ mcVersion: v }),
  setLoader: (l) => set({ loader: l }),

  selectDevice: (id) => {
    const device = DEVICES.find((dv) => dv.id === id);
    if (!device) return;
    set({ selectedDeviceId: id, ramMB: device.recommendedRamMB });
  },

  setRamMB: (mb) => set({ ramMB: mb }),

  addMod: (mod) =>
    set((state) => {
      if (state.modQueue.some((m) => m.id === mod.id)) return state;
      return { modQueue: [...state.modQueue, mod] };
    }),

  removeMod: (id) =>
    set((state) => ({ modQueue: state.modQueue.filter((m) => m.id !== id) })),

  isQueued: (id) => get().modQueue.some((m) => m.id === id),

  clearQueue: () => set({ modQueue: [] }),

  selectedDevice: () =>
    DEVICES.find((dv) => dv.id === get().selectedDeviceId) ?? null,

  estimatedRamUsedMB: () =>
    get().modQueue.reduce((sum, m) => sum + m.estimatedRamMB, 0),
}));
