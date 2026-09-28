import { useState } from "react";
import { X, Upload, Search, Plus, Trash2 } from "lucide-react";
import { MC_VERSIONS, LOADERS } from "../../store/useAppStore";
import { useRoleStore } from "../../store/useRoleStore";
import { createModpack, updateModpack } from "../../lib/catalog";
import { searchModrinth } from "../../lib/modrinth";
import type { CatalogCategory, Loader, ModrinthSearchHit, PrebuiltModpack } from "../../types";

const CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: "fps", label: "FPS Boost" },
  { id: "shaders", label: "Shaders & Visuals" },
  { id: "potato", label: "Potato Devices" },
  { id: "pvp", label: "PvP & Combat" },
  { id: "survival", label: "Survival & Utility" },
];

interface Props {
  existing?: PrebuiltModpack;
  onClose: () => void;
  onSaved: () => void;
}

export function ModpackForm({ existing, onClose, onSaved }: Props) {
  const uid = useRoleStore((s) => s.uid);
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [mcVersion, setMcVersion] = useState(existing?.mcVersion ?? MC_VERSIONS[0]);
  const [loader, setLoader] = useState<Loader>(existing?.loader ?? "fabric");
  const [category, setCategory] = useState<CatalogCategory>(existing?.category ?? "fps");
  const [ramMB, setRamMB] = useState(existing?.ramMB ?? 3500);
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [selected, setSelected] = useState<{ slug: string; name: string }[]>(
    existing?.modSlugs.map((slug) => ({ slug, name: slug })) ?? [],
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ModrinthSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setResults(await searchModrinth(query.trim(), mcVersion, loader));
    setSearching(false);
  }

  function toggleMod(slug: string, modName: string) {
    setSelected((prev) =>
      prev.some((m) => m.slug === slug) ? prev.filter((m) => m.slug !== slug) : [...prev, { slug, name: modName }],
    );
  }

  async function submit() {
    if (!uid) return;
    if (!name.trim()) return setError("Name is required.");
    if (selected.length === 0) return setError("Add at least one mod from Modrinth.");

    setSaving(true);
    setError(null);
    try {
      const modSlugs = selected.map((m) => m.slug);
      if (existing) {
        await updateModpack(existing.id, {
          name: name.trim(),
          description: description.trim(),
          mcVersion,
          loader,
          category,
          ramMB,
          imageUrl: imageUrl.trim() || null,
          modSlugs,
        });
      } else {
        await createModpack({
          name: name.trim(),
          authorName: "You",
          description: description.trim(),
          imageUrl: imageUrl.trim() || null,
          mcVersion,
          loader,
          category,
          ramMB,
          modSlugs,
          createdBy: uid,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong saving this modpack.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full flex-col rounded-t-2xl border-t border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="font-display text-[15px] font-bold text-text">
            {existing ? "Edit Modpack" : "Add Modpack"}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-faint hover:text-text">
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="MC Version">
              <select value={mcVersion} onChange={(e) => setMcVersion(e.target.value)} className={inputClass}>
                {MC_VERSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Loader">
              <select value={loader} onChange={(e) => setLoader(e.target.value as Loader)} className={inputClass}>
                {LOADERS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as CatalogCategory)} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="RAM (MB)">
              <input
                type="number"
                value={ramMB}
                onChange={(e) => setRamMB(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Cover image URL (optional)">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>

          <Field label={`Mods (${selected.length} selected — built fresh from Modrinth on every download)`}>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Search Modrinth mods…"
                className={inputClass}
              />
              <button
                onClick={runSearch}
                className="shrink-0 rounded-lg bg-accent-soft px-3 text-accent-light"
              >
                <Search size={15} />
              </button>
            </div>
          </Field>

          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((m) => (
                <span
                  key={m.slug}
                  className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent-light"
                >
                  {m.name}
                  <button onClick={() => toggleMod(m.slug, m.name)}>
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {searching && <div className="text-center text-[12px] text-text-faint">Searching…</div>}
          {!searching && results.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {results.map((hit) => {
                const added = selected.some((m) => m.slug === hit.slug);
                return (
                  <button
                    key={hit.project_id}
                    onClick={() => toggleMod(hit.slug, hit.title)}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[12px] ${
                      added ? "border-accent/40 bg-accent-soft text-accent-light" : "border-border bg-surface-2 text-text"
                    }`}
                  >
                    <span className="truncate font-semibold">{hit.title}</span>
                    {added ? <Trash2 size={13} /> : <Plus size={13} />}
                  </button>
                );
              })}
            </div>
          )}

          {error && <div className="text-[12px] font-semibold text-danger">{error}</div>}
        </div>

        <div className="border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            onClick={submit}
            disabled={saving}
            className="gradient-good glow-good flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black disabled:opacity-50"
          >
            <Upload size={16} /> {saving ? "Saving…" : existing ? "Save Changes" : "Publish Modpack"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-text-muted">{label}</span>
      {children}
    </label>
  );
}
