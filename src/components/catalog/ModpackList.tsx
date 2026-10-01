import { useEffect, useMemo, useState } from "react";
import { Download, Pencil, Trash2, Package, Plus, ArrowUpDown, ChevronDown } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { listModpacks, deleteModpack, bumpModpackDownloads } from "../../lib/catalog";
import { downloadToDevice } from "../../lib/download";
import { tapHaptic } from "../../lib/haptics";
import { ModpackForm } from "./ModpackForm";
import { SkeletonCardGrid } from "./SkeletonCard";
import { PullToRefresh } from "../common/PullToRefresh";
import type { PrebuiltModpack } from "../../types";

const CATEGORY_LABEL: Record<PrebuiltModpack["category"], string> = {
  fps: "FPS Boost",
  shaders: "Shaders & Visuals",
  potato: "Potato Devices",
  pvp: "PvP & Combat",
  survival: "Survival & Utility",
};

type SortKey = "newest" | "downloads" | "smallest";
const SORT_LABEL: Record<SortKey, string> = { newest: "Newest", downloads: "Most Downloaded", smallest: "Smallest" };

export function ModpackList() {
  const role = useRoleStore((s) => s.role);
  const canManage = role === "owner" || role === "helper";

  const [packs, setPacks] = useState<PrebuiltModpack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PrebuiltModpack | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [versionFilter, setVersionFilter] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");

  async function refresh() {
    setLoading(true);
    setPacks(await listModpacks());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const versions = useMemo(() => ["All", ...Array.from(new Set(packs.map((p) => p.mcVersion)))], [packs]);

  const visible = useMemo(() => {
    let list = packs;
    if (versionFilter !== "All") list = list.filter((p) => p.mcVersion === versionFilter);
    const sorted = [...list];
    if (sort === "downloads") sorted.sort((a, b) => b.downloadCount - a.downloadCount);
    else if (sort === "smallest") sorted.sort((a, b) => a.sizeMB - b.sizeMB);
    else sorted.sort((a, b) => b.createdAt - a.createdAt);
    return sorted;
  }, [packs, versionFilter, sort]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this modpack for everyone? This can't be undone.")) return;
    await deleteModpack(id);
    refresh();
  }

  async function handleDownload(pack: PrebuiltModpack) {
    tapHaptic();
    setDownloadError(null);
    try {
      await downloadToDevice(pack.downloadUrl, `${pack.name}.zip`);
      bumpModpackDownloads(pack.id);
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
          <Plus size={14} /> Add Modpack
        </button>
      )}

      {!loading && packs.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <FilterPill label={`${versionFilter === "All" ? "All Versions" : versionFilter}`}>
            <select
              value={versionFilter}
              onChange={(e) => setVersionFilter(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {versions.map((v) => (
                <option key={v} value={v}>
                  {v}
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
          No prebuilt modpacks yet. {canManage ? "Add the first one above." : "Check back soon."}
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
                <div className="gradient-brand h-20 w-full opacity-70" />
              )}
              <div className="p-2.5">
                <div className="mb-1 truncate text-[12px] font-bold leading-tight text-text">{pack.name}</div>
                <div className="mb-1.5 truncate text-[10px] font-semibold text-text-faint">
                  {CATEGORY_LABEL[pack.category]}
                </div>
                <div className="mb-2 flex flex-wrap gap-1 text-[9px] font-bold text-text-faint">
                  <Tag>{pack.mcVersion}</Tag>
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
