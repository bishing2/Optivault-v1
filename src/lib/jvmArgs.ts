import type { DeviceTier, ResolvedDevice } from "../types";

const PAUSE_MILLIS: Record<DeviceTier, number> = {
  flagship: 40,
  "upper-mid": 50,
  mid: 70,
  budget: 100,
  entry: 130,
};

const PROCESSOR_COUNT: Record<DeviceTier, number> = {
  flagship: 6,
  "upper-mid": 5,
  mid: 4,
  budget: 3,
  entry: 2,
};

const TIER_LABEL: Record<DeviceTier, string> = {
  flagship: "Ultra-Low Latency Flagship G1GC",
  "upper-mid": "Balanced Performance G1GC",
  mid: "Mid-Range Stability G1GC",
  budget: "Budget Memory-Safe G1GC",
  entry: "Entry-Level Minimal G1GC",
};

function regionSize(ramMB: number): string {
  if (ramMB < 3000) return "8M";
  if (ramMB < 8000) return "16M";
  return "32M";
}

export function tierLabel(device: ResolvedDevice): string {
  return `${TIER_LABEL[device.tier]} (${device.ramGB}GB ${device.name.split(" / ")[0]})`;
}

export function buildJvmArgs(device: ResolvedDevice, ramMB: number): string {
  const pause = PAUSE_MILLIS[device.tier];
  const cores = PROCESSOR_COUNT[device.tier];
  const region = regionSize(ramMB);

  const flags = [
    "-XX:+UseG1GC",
    `-XX:G1HeapRegionSize=${region}`,
    "-XX:G1NewSizePercent=35",
    "-XX:G1MaxNewSizePercent=45",
    "-XX:G1ReservePercent=20",
    "-XX:G1HeapWastePercent=5",
    "-XX:G1MixedGCCountTarget=8",
    "-XX:InitiatingHeapOccupancyPercent=15",
    "-XX:G1MixedGCLiveThresholdPercent=90",
    "-XX:G1RSetUpdatingPauseTimePercent=5",
    `-XX:MaxGCPauseMillis=${pause}`,
    "-XX:+UnlockExperimentalVMOptions",
    "-XX:+DisableExplicitGC",
    "-XX:+AlwaysPreTouch",
    "-XX:+ParallelRefProcEnabled",
    "-XX:+PerfDisableSharedMem",
    "-XX:SurvivorRatio=32",
    "-XX:MaxTenuringThreshold=1",
    `-XX:ActiveProcessorCount=${cores}`,
    "-XX:+UseStringDeduplication",
  ];

  return flags.join(" ");
}

export function ramLabel(ramMB: number): string {
  return `${ramMB} MB (~${(ramMB / 1024).toFixed(1)} GB)`;
}
