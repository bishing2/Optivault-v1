import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { setSiteLogo } from "../../lib/siteConfig";

interface Props {
  onChanged: (url: string) => void;
}

export function OwnerLogoControl({ onChanged }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await setSiteLogo(file);
      onChanged(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-surface py-2.5 text-xs font-bold text-text-muted hover:text-text">
      <ImageIcon size={14} /> {busy ? "Uploading…" : "Change App Logo"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={busy}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
