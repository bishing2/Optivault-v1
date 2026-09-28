import { useState } from "react";
import { X, Trash2, Package, Cpu, Download, AlertTriangle, Loader2 } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { resolveModpack } from "../../lib/modrinth";
import { buildModpackZip, type BuildProgress } from "../../lib/zipBuilder";
import { ramLabel } from "../../lib/jvmArgs";

interface Props {
  onClose: () => void;
}

type BuildState =
  | { phase: "idle" }
  | { phase: "resolving" }
  | { phase: "downloading"; progress: BuildProgress }
  | { phase: "done"; incompatible: string[]; dependencyCount: number }
  | { phase: "error"; message: string };

export function QueueSheet({ onClose }: Props) {
  const modQueue = useAppStore((s) => s.modQueue);
  const removeMod = useAppStore((s) => s.removeMod);
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);
  const ramMB = useAppStore((s) => s.ramMB);
  const javaVersion = useAppStore((s) => s.javaVersion);
  const estimatedRamUsedMB = useAppStore((s) => s.estimatedRamUsedMB());

  const [build, setBuild] = useState<BuildState>({ phase: "idle" });

  const ramPct = Math.min(100, Math.round((estimatedRamUsedMB / Math.max(ramMB, 1)) * 100));

  async function handleBuild() {
    setBuild({ phase: "resolving" });
    try {
      const slugs = modQueue.map((m) => m.slug);
      const { resolved, incompatible } = await resolveModpack(slugs, mcVersion, loader);

      if (resolved.length === 0) {
        setBuild({
          phase: "error",
          message: "None of the queued mods have a version compatible with this Minecraft version + loader.",
        });
        return;
      }

      await buildModpackZip(resolved, mcVersion, loader, (progress) =>
        setBuild({ phase: "downloading", progress }),
      );

      const dependencyCount = resolved.filter((r) => r.isDependency).length;
      setBuild({ phase: "done", incompatible, dependencyCount });
    } catch (err) {
      setBuild({
        phase: "error",
        message: err instanceof Error ? err.message : "Something went wrong building the zip.",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div
        className="flex max-h-[85vh] flex-col rounded-t-2xl border-t border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent-light">
              <Package size={17} />
            </div>
            <div>
              <div className="font-display flex items-center gap-1.5 text-[15px] font-bold text-text">
                Active Modpack
                <span className="gradient-brand rounded-full px-2 py-0.5 text-[10px] font-bold text-black">
                  {modQueue.length} Mods
                </span>
              </div>
              <div className="text-[11px] text-text-faint">
                MC {mcVersion} · {loader}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-faint hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-3 rounded-lg border border-border bg-surface-2 p-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-text-muted">
              <span className="flex items-center gap-1.5">
                <Cpu size={13} /> Est. RAM Footprint
              </span>
              <span>
                {estimatedRamUsedMB} MB / {ramLabel(ramMB)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface">
              <div
                className={`h-full rounded-full ${ramPct > 90 ? "gradient-danger" : ramPct > 70 ? "gradient-warn" : "gradient-brand"}`}
                style={{ width: `${ramPct}%` }}
              />
            </div>
            <div className="mt-2 flex gap-2">
              <span className="rounded bg-surface px-2 py-1 text-[10px] font-bold text-text-muted">
                Java {javaVersion}
              </span>
            </div>
          </div>

          {modQueue.length === 0 ? (
            <div className="py-10 text-center text-sm text-text-faint">
              No mods queued yet. Head to the browser and add some.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {modQueue.map((mod) => (
                <div
                  key={mod.id}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2"
                >
                  {mod.iconUrl ? (
                    <img src={mod.iconUrl} alt="" className="h-8 w-8 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-extrabold text-white"
                      style={{ backgroundColor: mod.iconColor ?? "#7c6fee" }}
                    >
                      {mod.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-bold text-text">{mod.name}</div>
                    <div className="truncate text-[10px] text-text-faint">{mod.author}</div>
                  </div>
                  <button
                    onClick={() => removeMod(mod.id)}
                    className="shrink-0 rounded-md p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {build.phase === "error" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-[11px] text-danger">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {build.message}
            </div>
          )}

          {build.phase === "done" && (
            <div className="mt-3 flex flex-col gap-1.5 rounded-lg border border-good/40 bg-good-soft px-3 py-2 text-[11px] text-good">
              <span>
                Zip downloaded — {build.dependencyCount > 0 && `${build.dependencyCount} dependencies auto-added. `}
                Ready to import into PojavLauncher.
              </span>
              {build.incompatible.length > 0 && (
                <span className="text-warn">
                  Skipped (no version for MC {mcVersion} / {loader}): {build.incompatible.join(", ")}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            onClick={handleBuild}
            disabled={modQueue.length === 0 || build.phase === "resolving" || build.phase === "downloading"}
            className="gradient-good glow-good flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black disabled:opacity-40 disabled:shadow-none"
          >
            {build.phase === "resolving" && (
              <>
                <Loader2 size={16} className="animate-spin" /> Resolving dependencies…
              </>
            )}
            {build.phase === "downloading" && (
              <>
                <Loader2 size={16} className="animate-spin" />
                Fetching {build.progress.currentName} ({build.progress.current}/{build.progress.total})
              </>
            )}
            {(build.phase === "idle" || build.phase === "done" || build.phase === "error") && (
              <>
                <Download size={16} /> Build &amp; Download ZIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
