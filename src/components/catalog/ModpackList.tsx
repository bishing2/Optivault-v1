import { useEffect, useState } from "react";
import { Download, Pencil, Trash2, Package, Plus } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { listModpacks, deleteModpack, bumpModpackDownloads } from "../../lib/catalog";
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
    bumpModpackDownloads(pack.id);
    window.open(pack.downloadUrl, "_blank", "noopener");
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

      {packs.map((pack) => (
        <div key={pack.id} className="overflow-hidden rounded-xl border border-border bg-surface">
          {pack.imageUrl && (
            <img src={pack.imageUrl} alt="" className="h-32 w-full object-cover" />
          )}
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
              <Tag>{pack.sizeMB}MB</Tag>
              <Tag>{pack.jarCount} jars</Tag>
              <Tag>{pack.downloadCount} downloads</Tag>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(pack)}
                className="gradient-good flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-black"
              >
                <Download size={13} /> Download
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
