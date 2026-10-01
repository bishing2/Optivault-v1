import { useState } from "react";
import { Check, Copy, Sliders, Terminal, Lightbulb, Zap } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { RENDERER_LABEL } from "../../data/devices";
import { buildJvmArgs, ramLabel, tierLabel } from "../../lib/jvmArgs";
import { tapHaptic } from "../../lib/haptics";

export function JvmArgsPanel() {
  const device = useAppStore((s) => s.selectedDevice());
  const ramMB = useAppStore((s) => s.ramMB);
  const setRamMB = useAppStore((s) => s.setRamMB);
  const selectRamVariant = useAppStore((s) => s.selectRamVariant);
  const [copied, setCopied] = useState(false);

  if (!device) return null;

  const args = buildJvmArgs(device, ramMB);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(args);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4">
        <div className="bg-accent pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-[0.08] blur-2xl" />
        <div className="relative mb-3 flex flex-wrap items-center gap-2">
          <span className="gradient-brand flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-black">
            <Zap size={12} /> Device Presets & JVM Tuning
          </span>
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-text-muted">
            Selected: {device.name.split(" / ")[0]}
          </span>
        </div>
        <h2 className="font-display relative text-xl font-bold text-text">
          Hardware Calibration &amp; JVM Arguments
        </h2>
        <p className="relative mt-1 text-[13px] leading-relaxed text-text-muted">
          Auto-tuned memory allocation, renderer, and G1GC flags for your device.
        </p>
      </div>

      <div className="glass-contour rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="font-display text-[15px] font-bold text-text">{device.name}</div>
            <div className="text-[11px] text-text-muted">{device.chipset}</div>
            <div className="text-[11px] text-text-faint">
              GPU: <span className="font-semibold text-text-muted">{device.gpu}</span>
            </div>
          </div>
          <span className="shrink-0 rounded bg-surface-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text-faint">
            Tier: {device.tier}
          </span>
        </div>

        {device.ramVariantsGB.length > 1 ? (
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] font-semibold text-text-muted">
              Which RAM variant do you have?
            </div>
            <div className="flex flex-wrap gap-1.5">
              {device.ramVariantsGB.map((gb) => (
                <button
                  key={gb}
                  onClick={() => {
                    tapHaptic();
                    selectRamVariant(gb);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                    gb === device.ramGB
                      ? "gradient-good border-transparent text-black"
                      : "border-border bg-surface-2 text-text-muted hover:border-border-light"
                  }`}
                >
                  {gb} GB
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-3 text-[11px] text-text-faint">
            Total RAM: <span className="font-semibold text-text-muted">{device.ramGB} GB</span>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-accent/25 bg-accent-soft px-3 py-2 text-[11px] font-semibold text-accent-light">
          <span>Recommended Renderer</span>
          <span>{RENDERER_LABEL[device.renderer]}</span>
        </div>
      </div>

      <div className="glass-contour rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-bold text-text">
            <Sliders size={15} className="text-accent-light" /> Pojav Allocated RAM
          </span>
          <span className="rounded-md border border-border-light bg-surface-2 px-2 py-1 text-xs font-bold text-text">
            {ramLabel(ramMB)}
          </span>
        </div>
        <input
          type="range"
          min={device.minRamMB}
          max={device.maxRamMB}
          step={100}
          value={ramMB}
          onChange={(e) => setRamMB(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="mt-1 flex justify-between text-[10px] text-text-faint">
          <span>{ramLabel(device.minRamMB)} Min</span>
          <span className="font-semibold text-accent-light">Rec: {device.recommendedRamMB} MB</span>
          <span>{ramLabel(device.maxRamMB)} Max</span>
        </div>
      </div>

      <div className="glass-contour rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-text">
            <Terminal size={14} className="text-accent-light" /> JVM Arguments
          </span>
          <button
            onClick={copy}
            className="gradient-brand glow-accent flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-black active:opacity-80"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mb-2 text-[10px] text-text-faint">{tierLabel(device)}</div>
        <pre className="no-scrollbar overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-accent-light">
          {args}
        </pre>
      </div>

      <div className="glass-contour rounded-2xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-text">
          <Lightbulb size={14} className="text-warn" /> PojavLauncher Calibration Settings
        </div>
        <ul className="flex flex-col gap-1.5 text-[12px] text-text-muted">
          <li>
            <span className="font-semibold text-text">Renderer:</span> Set to{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 text-accent-light">{RENDERER_LABEL[device.renderer]}</code>{" "}
            in Video &amp; Render settings.
          </li>
          <li>
            <span className="font-semibold text-text">Resolution Scaler:</span> Set to{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 text-accent-light">{device.resolutionScaler}%</code> to
            balance sharpness against thermals.
          </li>
          <li>
            <span className="font-semibold text-text">Sustained Performance:</span> Turn{" "}
            <span className="font-semibold text-text">{device.sustainedPerformance ? "ON" : "OFF"}</span>{" "}
            <em>"Sustained Performance Mode"</em> in Pojav settings.
          </li>
          <li className="pt-1 text-text-faint">
            Where to paste: Open PojavLauncher → Settings → Java Tweaks → paste into <em>JVM Arguments</em>.
          </li>
        </ul>
      </div>
    </div>
  );
}
