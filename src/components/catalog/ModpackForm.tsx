import { useState } from "react";
import JSZip from "jszip";
import { X, Upload } from "lucide-react";
import { MC_VERSIONS, LOADERS } from "../../store/useAppStore";
import { useRoleStore } from "../../store/useRoleStore";
import { createModpack, updateModpack } from "../../lib/catalog";
import { uploadFile } from "../../lib/upload";
import type { CatalogCategory, Loader, PrebuiltModpack } from "../../types";

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
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!uid) return;
    if (!name.trim()) return setError("Name is required.");
    if (!existing && !zipFile) return setError("A modpack .zip file is required.");

    setSaving(true);
    setError(null);
    try {
      let downloadUrl = existing?.downloadUrl ?? "";
      let sizeMB = existing?.sizeMB ?? 0;
      let jarCount = existing?.jarCount ?? 0;

      if (zipFile) {
        setProgress("Reading zip…");
        sizeMB = Math.round((zipFile.size / (1024 * 1024)) * 10) / 10;
        try {
          const zip = await JSZip.loadAsync(zipFile);
          jarCount = Object.keys(zip.files).filter((n) => n.toLowerCase().endsWith(".jar")).length;
        } catch {
          jarCount = existing?.jarCount ?? 0;
        }

        setProgress("Uploading…");
        downloadUrl = await uploadFile(zipFile);
      }

      setProgress("Saving…");
      if (existing) {
        await updateModpack(existing.id, {
          name: name.trim(),
          description: description.trim(),
          mcVersion,
          loader,
          category,
          ramMB,
          sizeMB,
          jarCount,
          imageUrl: imageUrl.trim() || null,
          downloadUrl,
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
          sizeMB,
          jarCount,
          downloadUrl,
          createdBy: uid,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong saving this modpack.");
    } finally {
      setSaving(false);
      setProgress(null);
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
          <Field label={existing ? "Replace .zip (optional)" : "Modpack .zip"}>
            <FileButton file={zipFile} placeholder={existing ? "Choose new .zip" : "Choose .zip file"} onChange={setZipFile} />
          </Field>

          {error && <div className="text-[12px] font-semibold text-danger">{error}</div>}
        </div>

        <div className="border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            onClick={submit}
            disabled={saving}
            className="gradient-good glow-good flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-black disabled:opacity-50"
          >
            <Upload size={16} /> {progress ?? (existing ? "Save Changes" : "Publish Modpack")}
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

function FileButton({
  file,
  placeholder,
  onChange,
}: {
  file: File | null;
  placeholder: string;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-border-light bg-surface-2 px-3 py-2 text-sm text-text-muted">
      <span className="truncate">
        {file ? `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)` : placeholder}
      </span>
      <input type="file" accept=".zip" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </label>
  );
}
