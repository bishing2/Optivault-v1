import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check } from "lucide-react";
import { CHIPSETS, type ChipsetProfile } from "../../data/devices";
import { useAppStore } from "../../store/useAppStore";
import { ramBoundsFor } from "../../lib/ramBounds";
import { tapHaptic } from "../../lib/haptics";
import type { ResolvedDevice } from "../../types";

const RAM_OPTIONS = [4, 6, 8, 12, 16];

interface Props {
  onClose: () => void;
}

export function ManualDeviceSheet({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [chipsetKey, setChipsetKey] = useState<string | null>(null);
  const [ramGB, setRamGB] = useState<number | null>(null);
  const selectCustomDevice = useAppStore((s) => s.selectCustomDevice);

  const entries = useMemo(() => Object.entries(CHIPSETS) as [string, ChipsetProfile][], []);
  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter(([, c]) => c.label.toLowerCase().includes(q));
  }, [entries, query]);

  const chosen = chipsetKey ? CHIPSETS[chipsetKey as keyof typeof CHIPSETS] : null;

  function confirm() {
    if (!chosen || !ramGB) return;
    tapHaptic();
    const bounds = ramBoundsFor(chosen.tier, ramGB);
    const device: ResolvedDevice = {
      id: "custom",
      name: `Custom (${chosen.label})`,
      brand: "Custom",
      chipset: chosen.label,
      gpu: chosen.gpu,
      tier: chosen.tier,
      renderer: chosen.renderer,
      resolutionScaler: chosen.resolutionScaler,
      sustainedPerformance: chosen.sustainedPerformance,
      ramVariantsGB: [ramGB],
      ramGB,
      ...bounds,
    };
    selectCustomDevice(device);
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="glass-strong glass-contour flex max-h-[85vh] w-full flex-col rounded-t-2xl border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-display text-[15px] font-bold text-text">Phone Not Listed?</div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-faint hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-1.5 text-[11px] font-semibold text-text-muted">1. Find your chipset</div>
          <div className="relative mb-3">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chipset (e.g. Snapdragon 8 Gen 3)..."
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
            />
          </div>

          <div className="mb-4 flex max-h-56 flex-col gap-1.5 overflow-y-auto">
            {filtered.map(([key, c]) => (
              <button
                key={key}
                onClick={() => setChipsetKey(key)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  chipsetKey === key ? "glow-good border-good/60 bg-good-soft" : "border-border bg-surface-2"
                }`}
              >
                <div>
                  <div className="text-[13px] font-bold text-text">{c.label}</div>
                  <div className="text-[10.5px] text-text-muted">
                    {c.gpu} · {c.tier}
                  </div>
                </div>
                {chipsetKey === key && <Check size={15} className="shrink-0 text-good" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-6 text-center text-sm text-text-faint">No chipsets match your search.</div>
            )}
          </div>

          {chosen && (
            <>
              <div className="mb-1.5 text-[11px] font-semibold text-text-muted">2. How much RAM does your phone have?</div>
              <div className="flex flex-wrap gap-2">
                {RAM_OPTIONS.map((gb) => (
                  <button
                    key={gb}
                    onClick={() => setRamGB(gb)}
                    className={`rounded-lg border px-4 py-2 text-xs font-bold transition-colors ${
                      ramGB === gb
                        ? "gradient-good border-transparent text-black"
                        : "border-border bg-surface-2 text-text-muted"
                    }`}
                  >
                    {gb} GB
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            onClick={confirm}
            disabled={!chosen || !ramGB}
            className="gradient-good w-full rounded-xl py-3 text-sm font-bold text-black disabled:opacity-40"
          >
            Use This Setup
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
