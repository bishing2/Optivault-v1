import { useState } from "react";
import { Radar, Smartphone } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { detectHardwareProfile, closestDeviceForTier } from "../../lib/detectDevice";
import { RENDERER_LABEL } from "../../data/devices";

const DISMISSED_KEY = "ov_autodetect_dismissed";

export function AutoDetectBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === "1");
  const selectDevice = useAppStore((s) => s.selectDevice);

  const profile = detectHardwareProfile();
  const match = profile ? closestDeviceForTier(profile.tier) : null;

  if (dismissed || !profile || !match) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="rounded-2xl border border-dashed border-accent/45 bg-accent-soft p-3.5">
      <div className="mb-2 flex items-center gap-1.5">
        <Radar size={14} className="text-accent-light" />
        <div className="text-[11px] font-bold tracking-wide text-accent-light">AUTO-DETECTED</div>
      </div>
      <p className="mb-2.5 text-[13px] leading-relaxed text-text">
        Your phone's hardware looks like a <b>{profile.tier.replace("-", " ")}-tier</b> device ({profile.cores} cores
        {profile.ramGB ? `, ${profile.ramGB}GB+ RAM` : ""} detected). Closest preset match:
      </p>
      <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5">
        <Smartphone size={18} className="shrink-0 text-accent-light" />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-text">{match.name}</div>
          <div className="truncate text-[11px] text-text-muted">
            {match.chipset} · {RENDERER_LABEL[match.renderer]}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            selectDevice(match.id);
            dismiss();
          }}
          className="gradient-good flex-1 rounded-lg py-2 text-xs font-bold text-black"
        >
          Use This Device
        </button>
        <button
          onClick={dismiss}
          className="flex-1 rounded-lg border border-border-light text-xs font-bold text-text-muted"
        >
          Search Manually
        </button>
      </div>
    </div>
  );
}

/** Lets the user re-trigger the banner from a small icon control elsewhere. */
export function clearAutoDetectDismissal() {
  localStorage.removeItem(DISMISSED_KEY);
}
