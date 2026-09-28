import { useEffect, useState } from "react";
import { Download, Pencil, Trash2, Package, Plus, Loader2 } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { listModpacks, deleteModpack, bumpModpackDownloads } from "../../lib/catalog";
import { resolveModpack } from "../../lib/modrinth";
import { buildModpackZip } from "../../lib/zipBuilder";
import { ModpackForm } from "./ModpackForm";
import type { PrebuiltModpack } from "../../types";

const CATEGORY_LABEL: Record<PrebuiltModpack["category"], string> = {
  fps: "FPS Boost",
  shaders: "Shaders & Visuals",
  potato: "Potato Devices",
  pvp: "PvP & Combat",
  survival: "Survival & Utility",
};

export function ModpackList() {
  const role = useRoleStore((s) => s.role);
  const canManage = role === "owner" || role === "helper";

  const [packs, setPacks] = useState<PrebuiltModpack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PrebuiltModpack | null>(null);
  const [building, setBuilding] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setPacks(await listModpacks());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this modpack for everyone? This can't be undone.")) return;
    await deleteModpack(id);
    refresh();
  }

  async function handleDownload(pack: PrebuiltModpack) {
    setBuildError(null);
    setBuilding(pack.id);
    try {
      const { resolved, incompatible } = await resolveModpack(pack.modSlugs, pack.mcVersion, pack.loader);
      if (resolved.length === 0) {
        setBuildError("None of this modpack's mods are compatible with its listed MC version/loader anymore.");
        return;
      }
      await buildModpackZip(
        resolved,
        pack.mcVersion,
        pack.loader,
        undefined,
        `${pack.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.zip`,
      );
      if (incompatible.length > 0) {
        setBuildError(`Skipped (no longer available): ${incompatible.join(", ")}`);
      }
      bumpModpackDownloads(pack.id);
    } catch {
      setBuildError("Couldn't build this modpack right now — check your connection and try again.");
    } finally {
      setBuilding(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {canManage && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-accent/30 bg-accent-soft py-2.5 text-xs font-bold text-accent-light"
        >
          <Plus size={14} /> Add Modpack
        </button>
      )}

      {loading && <div className="py-8 text-center text-sm text-text-faint">Loading modpacks…</div>}

      {!loading && packs.length === 0 && (
        <div className="py-10 text-center text-sm text-text-faint">
          No prebuilt modpacks yet. {canManage ? "Add the first one above." : "Check back soon."}
        </div>
      )}

      {buildError && (
        <div className="rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-[11px] text-warn">
          {buildError}
        </div>
      )}

      {packs.map((pack) => (
        <div key={pack.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          {pack.imageUrl && <img src={pack.imageUrl} alt="" className="h-32 w-full object-cover" />}
          <div className="p-3.5">
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-bold text-text">{pack.name}</div>
                <div className="truncate text-[11px] text-text-faint">by {pack.authorName}</div>
              </div>
              <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-text-muted">
                {CATEGORY_LABEL[pack.category]}
              </span>
            </div>

            <p className="mb-2 text-[12px] leading-snug text-text-muted">{pack.description}</p>

            <div className="mb-3 flex flex-wrap gap-1.5 text-[10px] font-semibold text-text-faint">
              <Tag>MC {pack.mcVersion}</Tag>
              <Tag>{pack.loader}</Tag>
              <Tag>{pack.ramMB}MB RAM</Tag>
              <Tag>{pack.modSlugs.length} mods</Tag>
              <Tag>{pack.downloadCount} downloads</Tag>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(pack)}
                disabled={building === pack.id}
                className="gradient-good flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-black disabled:opacity-60"
              >
                {building === pack.id ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Building…
                  </>
                ) : (
                  <>
                    <Download size={13} /> Download
                  </>
                )}
              </button>
              {canManage && (
                <button
                  onClick={() => setEditing(pack)}
                  className="flex items-center justify-center rounded-lg bg-surface-2 px-3 text-text-muted hover:text-text"
                >
                  <Pencil size={14} />
                </button>
              )}
              {role === "owner" && (
                <button
                  onClick={() => handleDelete(pack.id)}
                  className="flex items-center justify-center rounded-lg bg-surface-2 px-3 text-text-muted hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {!loading && packs.length === 0 && !canManage && (
        <div className="flex items-center justify-center py-4 text-text-faint">
          <Package size={28} />
        </div>
      )}

      {showForm && (
        <ModpackForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
      {editing && (
        <ModpackForm
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-surface-2 px-1.5 py-0.5">{children}</span>;
}
