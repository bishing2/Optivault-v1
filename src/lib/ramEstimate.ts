import type { CuratedMod, ModCategory } from "../types";

const CATEGORY_RAM_MB: Record<ModCategory, number> = {
  fps: 24,
  shaders: 55,
  survival: 18,
  stability: 12,
  pvp: 16,
  controls: 14,
};

export function estimateCuratedModRam(mod: CuratedMod): number {
  return CATEGORY_RAM_MB[mod.category] ?? 20;
}

export const DEFAULT_MODRINTH_MOD_RAM_MB = 20;
