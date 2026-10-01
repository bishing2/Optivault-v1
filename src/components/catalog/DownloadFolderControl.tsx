import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { FolderOpen, Check } from "lucide-react";
import FolderStorage from "../../lib/folderStorage";

export function DownloadFolderControl() {
  const [folder, setFolder] = useState<{ uri: string; name: string } | null | undefined>(undefined);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    FolderStorage.getSavedFolder().then((saved) => {
      setFolder(saved.uri && saved.name ? { uri: saved.uri, name: saved.name } : null);
    });
  }, []);

  if (!Capacitor.isNativePlatform() || folder === undefined) return null;

  async function pick() {
    try {
      const picked = await FolderStorage.pickFolder();
      setFolder(picked);
    } catch {
      // user cancelled — leave as-is
    }
  }

  return (
    <button
      onClick={pick}
      className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-left"
    >
      {folder ? <Check size={14} className="shrink-0 text-accent-light" /> : <FolderOpen size={14} className="shrink-0 text-text-faint" />}
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-text">Download Folder</div>
        <div className="truncate text-[10.5px] text-text-muted">
          {folder ? `Saving to "${folder.name}"` : "Not set — downloads will ask once"}
        </div>
      </div>
      <span className="shrink-0 text-[10.5px] font-bold text-accent-light">{folder ? "Change" : "Choose"}</span>
    </button>
  );
}
