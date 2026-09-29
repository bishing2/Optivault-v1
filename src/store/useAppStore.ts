import { create } from "zustand";
import type { Loader, QueuedMod, ResolvedDevice } from "../types";
import { DEVICES } from "../data/devices";
import { ramBoundsFor } from "../lib/ramBounds";

export const MC_VERSIONS = [
  "1.21.4",
  "1.21.3",
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.4",
  "1.20.2",
  "1.20.1",
  "1.19.4",
  "1.19.2",
  "1.18.2",
  "1.17.1",
  "1.16.5",
  "1.15.2",
  "1.14.4",
  "1.12.2",
  "1.8.9",
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
  selectedRamGB: number;
  device: ResolvedDevice;
  ramMB: number;
  modQueue: QueuedMod[];
  javaVersion: number;

  setMcVersion: (v: string) => void;
  setLoader: (l: Loader) => void;
  selectDevice: (id: string) => void;
  selectRamVariant: (ramGB: number) => void;
  setRamMB: (mb: number) => void;

  addMod: (mod: QueuedMod) => void;
  removeMod: (id: string) => void;
  isQueued: (id: string) => boolean;
  clearQueue: () => void;

  selectedDevice: () => ResolvedDevice;
  estimatedRamUsedMB: () => number;
}

const DEFAULT_DEVICE = DEVICES[0];
const DEFAULT_RAM_GB = DEFAULT_DEVICE.ramVariantsGB[DEFAULT_DEVICE.ramVariantsGB.length - 1];

/** Resolves a catalog entry + chosen RAM variant into the full tuned device shape. */
function resolveDevice(deviceId: string, ramGB: number): ResolvedDevice {
  const device = DEVICES.find((dv) => dv.id === deviceId) ?? DEFAULT_DEVICE;
  const variant = device.ramVariantsGB.includes(ramGB)
    ? ramGB
    : device.ramVariantsGB[device.ramVariantsGB.length - 1];
  const bounds = ramBoundsFor(device.tier, variant);
  return { ...device, ramGB: variant, ...bounds };
}

export const useAppStore = create<AppState>((set, get) => ({
  mcVersion: "1.21.4",
  loader: "fabric",
  selectedDeviceId: DEFAULT_DEVICE.id,
  selectedRamGB: DEFAULT_RAM_GB,
  device: resolveDevice(DEFAULT_DEVICE.id, DEFAULT_RAM_GB),
  ramMB: ramBoundsFor(DEFAULT_DEVICE.tier, DEFAULT_RAM_GB).recommendedRamMB,
  modQueue: [],
  javaVersion: 21,

  setMcVersion: (v) => set({ mcVersion: v }),
  setLoader: (l) => set({ loader: l }),

  selectDevice: (id) => {
    const device = DEVICES.find((dv) => dv.id === id);
    if (!device) return;
    const ramGB = device.ramVariantsGB[device.ramVariantsGB.length - 1];
    const resolved = resolveDevice(id, ramGB);
    set({ selectedDeviceId: id, selectedRamGB: ramGB, device: resolved, ramMB: resolved.recommendedRamMB });
  },

  selectRamVariant: (ramGB) => {
    const { selectedDeviceId } = get();
    const device = DEVICES.find((dv) => dv.id === selectedDeviceId);
    if (!device || !device.ramVariantsGB.includes(ramGB)) return;
    const resolved = resolveDevice(selectedDeviceId, ramGB);
    set({ selectedRamGB: ramGB, device: resolved, ramMB: resolved.recommendedRamMB });
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

  selectedDevice: () => get().device,

  estimatedRamUsedMB: () =>
    get().modQueue.reduce((sum, m) => sum + m.estimatedRamMB, 0),
}));
