import { useEffect, useMemo, useState } from "react";
import { Download, Pencil, Trash2, ArrowUpDown, ChevronDown } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { listTexturePacks, deleteTexturePack, bumpTexturePackDownloads } from "../../lib/catalog";
import { downloadToDevice } from "../../lib/download";
import { tapHaptic } from "../../lib/haptics";
import { TexturePackForm } from "./TexturePackForm";
import { SkeletonCardGrid } from "./SkeletonCard";
import { PullToRefresh } from "../common/PullToRefresh";
import type { TexturePack } from "../../types";

type SortKey = "newest" | "downloads" | "smallest";
const SORT_LABEL: Record<SortKey, string> = { newest: "Newest", downloads: "Most Downloaded", smallest: "Smallest" };

export function TexturePackList() {
  const role = useRoleStore((s) => s.role);
  const canManage = role === "owner" || role === "helper";

  const [packs, setPacks] = useState<TexturePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TexturePack | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [resFilter, setResFilter] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");

  async function refresh() {
    setLoading(true);
    setPacks(await listTexturePacks());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const resolutions = useMemo(() => ["All", ...Array.from(new Set(packs.map((p) => p.resolution)))], [packs]);

  const visible = useMemo(() => {
    let list = packs;
    if (resFilter !== "All") list = list.filter((p) => p.resolution === resFilter);
    const sorted = [...list];
    if (sort === "downloads") sorted.sort((a, b) => b.downloadCount - a.downloadCount);
    else if (sort === "smallest") sorted.sort((a, b) => a.sizeMB - b.sizeMB);
    else sorted.sort((a, b) => b.createdAt - a.createdAt);
    return sorted;
  }, [packs, resFilter, sort]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this texture pack for everyone? This can't be undone.")) return;
    await deleteTexturePack(id);
    refresh();
  }

  async function handleDownload(pack: TexturePack) {
    tapHaptic();
    setDownloadError(null);
    try {
      await downloadToDevice(pack.downloadUrl, `${pack.name}.zip`);
      bumpTexturePackDownloads(pack.id);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download failed.");
    }
  }

  return (
    <PullToRefresh onRefresh={refresh}>
    <div className="flex flex-col gap-3">
      {canManage && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-accent/30 bg-accent-soft py-2.5 text-xs font-bold text-accent-light"
        >
          Add Texture Pack
        </button>
      )}

      {!loading && packs.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <FilterPill label={resFilter}>
            <select
              value={resFilter}
              onChange={(e) => setResFilter(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {resolutions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FilterPill>
          <FilterPill label={SORT_LABEL[sort]} icon={<ArrowUpDown size={11} />}>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABEL[k]}
                </option>
              ))}
            </select>
          </FilterPill>
        </div>
      )}

      {loading && <SkeletonCardGrid />}

      {!loading && packs.length === 0 && (
        <div className="py-10 text-center text-sm text-text-faint">
          No texture packs yet. {canManage ? "Add the first one above." : "Check back soon."}
        </div>
      )}

      {downloadError && (
        <div className="rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-[11px] text-warn">
          {downloadError}
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {visible.map((pack) => (
            <div key={pack.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              {pack.imageUrl ? (
                <img src={pack.imageUrl} alt="" className="h-20 w-full object-cover" />
              ) : (
                <div className="gradient-good h-20 w-full opacity-70" />
              )}
              <div className="p-2.5">
                <div className="mb-1 truncate text-[12px] font-bold leading-tight text-text">{pack.name}</div>
                <div className="mb-1.5 truncate text-[10px] font-semibold text-text-faint">by {pack.authorName}</div>
                <div className="mb-2 flex flex-wrap gap-1 text-[9px] font-bold text-text-faint">
                  <Tag>{pack.resolution}</Tag>
                  {pack.fpsBoostLabel && <Tag>{pack.fpsBoostLabel}</Tag>}
                  <Tag>{pack.sizeMB}MB</Tag>
                  <Tag>{pack.downloadCount}&#8595;</Tag>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleDownload(pack)}
                    className="gradient-good flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-[10.5px] font-bold text-black"
                  >
                    <Download size={11} /> Get
                  </button>
                  {canManage && (
                    <button
                      onClick={() => setEditing(pack)}
                      className="flex items-center justify-center rounded-lg bg-surface-2 px-2 text-text-muted"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                  {role === "owner" && (
                    <button
                      onClick={() => handleDelete(pack.id)}
                      className="flex items-center justify-center rounded-lg bg-surface-2 px-2 text-text-muted"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </PullToRefresh>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-surface-2 px-1 py-0.5">{children}</span>;
}

function FilterPill({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative flex shrink-0 items-center gap-1 rounded-full border border-border-light bg-surface px-2.5 py-1.5 text-[11px] font-bold">
      {icon}
      {label}
      <ChevronDown size={10} className="text-text-faint" />
      {children}
    </div>
  );
}
