import { useMemo, useState } from "react";
import { Search, Cpu, RotateCw } from "lucide-react";
import { DEVICES, BRANDS, RENDERER_LABEL } from "../../data/devices";
import { useAppStore } from "../../store/useAppStore";
import { AutoDetectBanner, clearAutoDetectDismissal } from "./AutoDetectBanner";
import { tapHaptic } from "../../lib/haptics";

export function DevicePresetPicker() {
  const [brand, setBrand] = useState("All");
  const [query, setQuery] = useState("");
  const [detectNonce, setDetectNonce] = useState(0);
  const selectedDeviceId = useAppStore((s) => s.selectedDeviceId);
  const selectDevice = useAppStore((s) => s.selectDevice);

  const filtered = useMemo(() => {
    return DEVICES.filter((dv) => {
      if (brand !== "All" && dv.brand !== brand) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return dv.name.toLowerCase().includes(q) || dv.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [brand, query]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-black">
          <Cpu size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-[15px] font-bold text-text">Select Your Phone Preset</div>
          <div className="text-[11px] text-text-faint">{DEVICES.length} devices — tap one to calibrate memory, renderer & scaling.</div>
        </div>
        <button
          onClick={() => {
            clearAutoDetectDismissal();
            setDetectNonce((n) => n + 1);
          }}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border-light px-2 py-1.5 text-[10px] font-bold text-text-muted"
        >
          <RotateCw size={11} /> Detect
        </button>
      </div>

      <div className="mb-3">
        <AutoDetectBanner key={detectNonce} />
      </div>

      <div className="relative mb-3">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phone (e.g. S24, Poco, OnePlus)..."
          className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              brand === b
                ? "gradient-brand glow-accent text-black"
                : "bg-surface-2 text-text-muted hover:text-text"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((dv) => {
          const active = dv.id === selectedDeviceId;
          return (
            <button
              key={dv.id}
              onClick={() => {
                tapHaptic();
                selectDevice(dv.id);
              }}
              className={`rounded-xl border p-3 text-left transition-colors ${
                active
                  ? "glow-good border-good/60 bg-good-soft"
                  : "border-border bg-surface-2 hover:border-border-light"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-text">{dv.name}</span>
                {active && (
                  <span className="gradient-good shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-black">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="mb-1.5 text-[11px] text-text-muted">
                {dv.chipset} <span className="text-text-faint">·</span> {dv.gpu}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="rounded bg-surface px-1.5 py-0.5 font-semibold text-text-muted">
                  {dv.ramVariantsGB.join("/")}GB RAM
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-semibold ${
                    dv.renderer === "zink-turnip"
                      ? "bg-good-soft text-good"
                      : "bg-surface text-text-muted"
                  }`}
                >
                  {RENDERER_LABEL[dv.renderer]}
                </span>
                <span className="ml-auto font-semibold uppercase tracking-wide text-text-faint">{dv.tier}</span>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-text-faint">No devices match your search.</div>
        )}
      </div>
    </div>
  );
}
