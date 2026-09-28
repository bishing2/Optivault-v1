import { useState } from "react";
import { Check, Copy, Sliders, Terminal, Lightbulb, Zap } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { RENDERER_LABEL } from "../../data/devices";
import { buildJvmArgs, ramLabel, tierLabel } from "../../lib/jvmArgs";

export function JvmArgsPanel() {
  const device = useAppStore((s) => s.selectedDevice());
  const ramMB = useAppStore((s) => s.ramMB);
  const setRamMB = useAppStore((s) => s.setRamMB);
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
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-light">
            <Zap size={12} /> Device Presets & JVM Tuning
          </span>
          <span className="rounded-full bg-good/15 px-2.5 py-1 text-[11px] font-bold text-good">
            Selected: {device.name.split(" / ")[0]}
          </span>
        </div>
        <h2 className="text-lg font-extrabold text-text">Hardware Calibration & JVM Arguments</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
          Auto-tuned memory allocation, renderer, and G1GC flags for your device.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-text">{device.name}</div>
            <div className="text-[11px] text-text-muted">{device.chipset}</div>
            <div className="text-[11px] text-text-faint">
              GPU: <span className="font-semibold text-text-muted">{device.gpu}</span> · Total RAM:{" "}
              <span className="font-semibold text-text-muted">{device.ramGB} GB</span>
            </div>
          </div>
          <span className="shrink-0 rounded bg-surface-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text-faint">
            Tier: {device.tier}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-good/30 bg-good-soft px-3 py-2 text-[11px] font-semibold text-good">
          <span>Recommended Renderer</span>
          <span>{RENDERER_LABEL[device.renderer]}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-bold text-text">
            <Sliders size={15} /> Pojav Allocated RAM
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
          <span>{ramLabel(device.minRamMB)} (Min)</span>
          <span className="text-good">Recommended: {device.recommendedRamMB} MB</span>
          <span>{ramLabel(device.maxRamMB)} (Safe Max)</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-text">
            <Terminal size={14} /> JVM Arguments
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white active:opacity-80"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mb-2 text-[10px] text-text-faint">{tierLabel(device)}</div>
        <pre className="no-scrollbar overflow-x-auto rounded-lg border border-border bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-good">
          {args}
        </pre>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
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
