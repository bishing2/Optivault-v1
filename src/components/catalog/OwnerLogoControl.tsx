import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { setSiteLogoUrl } from "../../lib/siteConfig";

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
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Paste an image URL"
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="gradient-brand rounded-lg px-4 text-xs font-bold text-black disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <div className="mt-2 text-[11px] font-semibold text-danger">{error}</div>}
    </div>
  );
}
