import { useState } from "react";
import { X, Upload, Search, Check } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { createTexturePack, updateTexturePack } from "../../lib/catalog";
import { searchModrinthResourcePacks } from "../../lib/modrinth";
import { useAppStore } from "../../store/useAppStore";
import type { ModrinthSearchHit, TexturePack } from "../../types";

const RESOLUTIONS: TexturePack["resolution"][] = ["8x", "16x", "32x", "64x"];

interface Props {
  existing?: TexturePack;
  onClose: () => void;
  onSaved: () => void;
}

export function TexturePackForm({ existing, onClose, onSaved }: Props) {
  const uid = useRoleStore((s) => s.uid);
  const mcVersion = useAppStore((s) => s.mcVersion);
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [resolution, setResolution] = useState<TexturePack["resolution"]>(existing?.resolution ?? "16x");
  const [fpsBoostLabel, setFpsBoostLabel] = useState(existing?.fpsBoostLabel ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [picked, setPicked] = useState<{ slug: string; name: string } | null>(
    existing ? { slug: existing.modrinthSlug, name: existing.modrinthSlug } : null,
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ModrinthSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setResults(await searchModrinthResourcePacks(query.trim(), mcVersion));
    setSearching(false);
  }

  async function submit() {
    if (!uid) return;
    if (!name.trim()) return setError("Name is required.");
    if (!picked) return setError("Pick a resource pack from Modrinth.");

    setSaving(true);
    setError(null);
    try {
      if (existing) {
        await updateTexturePack(existing.id, {
          name: name.trim(),
          description: description.trim(),
          resolution,
          fpsBoostLabel: fpsBoostLabel.trim() || undefined,
          imageUrl: imageUrl.trim() || null,
          modrinthSlug: picked.slug,
        });
      } else {
        await createTexturePack({
          name: name.trim(),
          authorName: "You",
          description: description.trim(),
          imageUrl: imageUrl.trim() || null,
          resolution,
          fpsBoostLabel: fpsBoostLabel.trim() || undefined,
          modrinthSlug: picked.slug,
          createdBy: uid,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong saving this texture pack.");
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
            {existing ? "Edit Texture Pack" : "Add Texture Pack"}
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
            <Field label="Resolution">
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as TexturePack["resolution"])}
                className={inputClass}
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="FPS boost label (optional)">
              <input
                value={fpsBoostLabel}
                onChange={(e) => setFpsBoostLabel(e.target.value)}
                placeholder="+20% FPS"
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

          <Field label={`Modrinth resource pack (MC ${mcVersion}) — built fresh from Modrinth on every download`}>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Search Modrinth resource packs…"
                className={inputClass}
              />
              <button onClick={runSearch} className="shrink-0 rounded-lg bg-accent-soft px-3 text-accent-light">
                <Search size={15} />
              </button>
            </div>
          </Field>

          {picked && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-[12px] font-semibold text-accent-light">
              <Check size={13} /> Selected: {picked.name}
            </div>
          )}

          {searching && <div className="text-center text-[12px] text-text-faint">Searching…</div>}
          {!searching && results.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {results.map((hit) => (
                <button
                  key={hit.project_id}
                  onClick={() => setPicked({ slug: hit.slug, name: hit.title })}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[12px] ${
                    picked?.slug === hit.slug
                      ? "border-accent/40 bg-accent-soft text-accent-light"
                      : "border-border bg-surface-2 text-text"
                  }`}
                >
                  <span className="truncate font-semibold">{hit.title}</span>
                  {picked?.slug === hit.slug && <Check size={13} />}
                </button>
              ))}
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
            <Upload size={16} /> {saving ? "Saving…" : existing ? "Save Changes" : "Publish Texture Pack"}
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
