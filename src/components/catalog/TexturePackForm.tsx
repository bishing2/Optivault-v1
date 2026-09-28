import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";
import { createTexturePack, updateTexturePack, uploadCatalogFile } from "../../lib/catalog";
import type { TexturePack } from "../../types";

const RESOLUTIONS: TexturePack["resolution"][] = ["8x", "16x", "32x", "64x"];

interface Props {
  existing?: TexturePack;
  onClose: () => void;
  onSaved: () => void;
}

export function TexturePackForm({ existing, onClose, onSaved }: Props) {
  const uid = useRoleStore((s) => s.uid);
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [resolution, setResolution] = useState<TexturePack["resolution"]>(existing?.resolution ?? "16x");
  const [fpsBoostLabel, setFpsBoostLabel] = useState(existing?.fpsBoostLabel ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!uid) return;
    if (!name.trim()) return setError("Name is required.");
    if (!existing && !zipFile) return setError("A texture pack file is required.");

    setSaving(true);
    setError(null);
    try {
      let imageUrl = existing?.imageUrl ?? null;
      if (imageFile) imageUrl = await uploadCatalogFile("texturepacks", imageFile);

      let downloadUrl = existing?.downloadUrl ?? "";
      let sizeMB = existing?.sizeMB ?? 0;
      if (zipFile) {
        downloadUrl = await uploadCatalogFile("texturepacks", zipFile);
        sizeMB = Math.round((zipFile.size / (1024 * 1024)) * 10) / 10;
      }

      if (existing) {
        await updateTexturePack(existing.id, {
          name: name.trim(),
          description: description.trim(),
          resolution,
          fpsBoostLabel: fpsBoostLabel.trim() || undefined,
          imageUrl,
          downloadUrl,
          sizeMB,
        });
      } else {
        await createTexturePack({
          name: name.trim(),
          authorName: "You",
          description: description.trim(),
          imageUrl,
          resolution,
          fpsBoostLabel: fpsBoostLabel.trim() || undefined,
          sizeMB,
          downloadUrl,
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
          <Field label="Cover image (optional)">
            <FileButton
              accept="image/*"
              file={imageFile}
              placeholder={existing?.imageUrl ? "Replace image" : "Choose image"}
              onChange={setImageFile}
            />
          </Field>
          <Field label={existing ? "Replace .zip (optional)" : "Texture pack .zip"}>
            <FileButton accept=".zip" file={zipFile} placeholder="Choose .zip file" onChange={setZipFile} />
          </Field>

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

function FileButton({
  accept,
  file,
  placeholder,
  onChange,
}: {
  accept: string;
  file: File | null;
  placeholder: string;
  onChange: (f: File | null) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-border-light bg-surface-2 px-3 py-2 text-sm text-text-muted">
      <span className="truncate">{file ? file.name : placeholder}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
