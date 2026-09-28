import { useState } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadFile } from "../../lib/upload";

const inputClass =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageField({ label, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-text-muted">{label}</span>
      {value && <img src={value} alt="" className="h-24 w-full rounded-lg border border-border object-cover" />}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className={inputClass}
      />
      <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-light bg-surface-2 px-3 py-2 text-xs font-semibold text-text-muted">
        {uploading ? (
          <>
            <Loader2 size={13} className="animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <ImageIcon size={13} /> Or upload an image
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {error && <span className="text-[11px] font-semibold text-danger">{error}</span>}
    </label>
  );
}
