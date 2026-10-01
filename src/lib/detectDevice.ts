import type { DeviceTier } from "../types";
import { DEVICES } from "../data/devices";

export interface DetectedProfile {
  tier: DeviceTier;
  cores: number;
  ramGB: number | null;
}

/**
 * Best-effort hardware tier guess from browser-exposed signals. Chrome clamps
 * `navigator.deviceMemory` at 8GB for fingerprinting privacy, so it's used
 * only as a floor signal — core count carries more weight.
 */
export function detectHardwareProfile(): DetectedProfile | null {
  const cores = navigator.hardwareConcurrency;
  if (!cores) return null;
  const ramGB = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? null;

  let tier: DeviceTier;
  if (cores >= 8 && (ramGB === null || ramGB >= 8)) tier = "flagship";
  else if (cores >= 8 || (cores >= 6 && (ramGB ?? 0) >= 6)) tier = "upper-mid";
  else if (cores >= 6) tier = "mid";
  else if (cores >= 4) tier = "budget";
  else tier = "entry";

  return { tier, cores, ramGB };
}

/** Picks a representative device preset for a detected tier. */
export function closestDeviceForTier(tier: DeviceTier) {
  return DEVICES.find((d) => d.tier === tier) ?? null;
}
