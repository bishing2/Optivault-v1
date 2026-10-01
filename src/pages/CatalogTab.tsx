import { useState } from "react";
import { Box, Palette } from "lucide-react";
import { useRoleStore } from "../store/useRoleStore";
import { useSiteConfigStore } from "../store/useSiteConfigStore";
import { AccessCodeBar } from "../components/catalog/AccessCodeBar";
import { OwnerLogoControl } from "../components/catalog/OwnerLogoControl";
import { DownloadFolderControl } from "../components/catalog/DownloadFolderControl";
import { ModpackList } from "../components/catalog/ModpackList";
import { TexturePackList } from "../components/catalog/TexturePackList";
import { apiEnabled } from "../lib/api";

export function CatalogTab() {
  const [section, setSection] = useState<"modpacks" | "textures">("modpacks");
  const ready = useRoleStore((s) => s.ready);
  const role = useRoleStore((s) => s.role);
  const setLogoUrl = useSiteConfigStore((s) => s.setLogoUrl);

  if (!apiEnabled) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-warn/30 bg-warn-soft p-4 text-[12px] text-warn">
          The backend isn't configured for this build yet — the community catalog can't load.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <AccessCodeBar />
      {!ready && <div className="text-center text-[11px] text-text-faint">Connecting…</div>}
      {role === "owner" && <OwnerLogoControl onChanged={setLogoUrl} />}
      <DownloadFolderControl />

      <div className="flex gap-2 rounded-xl border border-border bg-surface p-1.5">
        <button
          onClick={() => setSection("modpacks")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            section === "modpacks" ? "gradient-brand text-black" : "text-text-muted"
          }`}
        >
          <Box size={14} /> Prebuilt Modpacks
        </button>
        <button
          onClick={() => setSection("textures")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-colors ${
            section === "textures" ? "gradient-brand text-black" : "text-text-muted"
          }`}
        >
          <Palette size={14} /> Texture Packs
        </button>
      </div>

      {section === "modpacks" ? <ModpackList /> : <TexturePackList />}
    </div>
  );
}
