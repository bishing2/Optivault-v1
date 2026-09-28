import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { setSiteLogoUrl } from "../../lib/siteConfig";
import { ImageField } from "./ImageField";

interface Props {
  onChanged: (url: string) => void;
}

export function OwnerLogoControl({ onChanged }: Props) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!url.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await setSiteLogoUrl(url.trim());
      onChanged(url.trim());
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the logo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-muted">
        <ImageIcon size={14} /> Change App Logo
      </div>
      <ImageField label="Logo image" value={url} onChange={setUrl} />
      <button
        onClick={submit}
        disabled={busy || !url.trim()}
        className="gradient-brand mt-2 w-full rounded-lg py-2 text-xs font-bold text-black disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save Logo"}
      </button>
      {error && <div className="mt-2 text-[11px] font-semibold text-danger">{error}</div>}
    </div>
  );
}
