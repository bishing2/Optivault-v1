import type { DeviceTier } from "../types";

/**
 * How much of a phone's total RAM is safe/sensible to hand to PojavLauncher.
 * Lower-tier phones run a lighter OS/background footprint proportionally, so
 * they can spare a bigger *percentage* of total RAM even though the absolute
 * numbers are smaller.
 */
const TIER_FACTORS: Record<DeviceTier, { recommended: number; max: number; minFloor: number }> = {
  flagship: { recommended: 0.4, max: 0.8, minFloor: 1500 },
  "upper-mid": { recommended: 0.44, max: 0.78, minFloor: 1200 },
  mid: { recommended: 0.46, max: 0.75, minFloor: 1200 },
  budget: { recommended: 0.5, max: 0.7, minFloor: 1000 },
  entry: { recommended: 0.55, max: 0.65, minFloor: 800 },
};

function roundTo100(mb: number): number {
  return Math.round(mb / 100) * 100;
}

export function ramBoundsFor(tier: DeviceTier, ramGB: number) {
  const totalMB = ramGB * 1024;
  const factors = TIER_FACTORS[tier];
  const recommendedRamMB = roundTo100(totalMB * factors.recommended);
  const maxRamMB = roundTo100(totalMB * factors.max);
  const minRamMB = Math.min(factors.minFloor, recommendedRamMB - 200);
  return { recommendedRamMB, minRamMB, maxRamMB };
}
