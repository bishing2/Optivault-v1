import { useEffect, useState } from "react";
import { Download, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { listTexturePacks, deleteTexturePack, bumpTexturePackDownloads } from "../../lib/catalog";
import { getBestVersion } from "../../lib/modrinth";
import { downloadModrinthFile } from "../../lib/zipBuilder";
import { useAppStore } from "../../store/useAppStore";
import { TexturePackForm } from "./TexturePackForm";
import type { TexturePack } from "../../types";

export function TexturePackList() {
  const role = useRoleStore((s) => s.role);
  const canManage = role === "owner" || role === "helper";
  const mcVersion = useAppStore((s) => s.mcVersion);

  const [packs, setPacks] = useState<TexturePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TexturePack | null>(null);
  const [building, setBuilding] = useState<string | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setPacks(await listTexturePacks());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this texture pack for everyone? This can't be undone.")) return;
    await deleteTexturePack(id);
    refresh();
  }

  async function handleDownload(pack: TexturePack) {
    setBuildError(null);
    setBuilding(pack.id);
    try {
      const version = await getBestVersion(pack.modrinthSlug, mcVersion);
      const file = version?.files.find((f) => f.primary) ?? version?.files[0];
      if (!file) {
        setBuildError("This texture pack has no version compatible with your selected MC version.");
        return;
      }
      await downloadModrinthFile(file.url, file.filename);
      bumpTexturePackDownloads(pack.id);
    } catch {
      setBuildError("Couldn't fetch this texture pack right now — check your connection and try again.");
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
          Add Texture Pack
        </button>
      )}

      {loading && <div className="py-8 text-center text-sm text-text-faint">Loading texture packs…</div>}

      {!loading && packs.length === 0 && (
        <div className="py-10 text-center text-sm text-text-faint">
          No texture packs yet. {canManage ? "Add the first one above." : "Check back soon."}
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
              <span className="shrink-0 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent-light">
                {pack.resolution}
              </span>
            </div>

            <p className="mb-2 text-[12px] leading-snug text-text-muted">{pack.description}</p>

            <div className="mb-3 flex flex-wrap gap-1.5 text-[10px] font-semibold text-text-faint">
              {pack.fpsBoostLabel && <Tag>{pack.fpsBoostLabel}</Tag>}
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
                    <Loader2 size={13} className="animate-spin" /> Fetching…
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

      {showForm && (
        <TexturePackForm
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            refresh();
          }}
        />
      )}
      {editing && (
        <TexturePackForm
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
