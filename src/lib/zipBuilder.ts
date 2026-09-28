import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Loader } from "../types";
import type { ResolvedModEntry } from "./modrinth";

export interface BuildProgress {
  current: number;
  total: number;
  currentName: string;
}

export async function buildModpackZip(
  entries: ResolvedModEntry[],
  mcVersion: string,
  loader: Loader,
  onProgress?: (p: BuildProgress) => void,
): Promise<void> {
  const zip = new JSZip();
  const mods = zip.folder("mods")!;

  let done = 0;
  for (const entry of entries) {
    const file = entry.version.files.find((f) => f.primary) ?? entry.version.files[0];
    if (!file) {
      done++;
      continue;
    }
    onProgress?.({ current: done, total: entries.length, currentName: entry.slug });

    const res = await fetch(file.url);
    const blob = await res.blob();
    mods.file(file.filename, blob);

    done++;
    onProgress?.({ current: done, total: entries.length, currentName: entry.slug });
  }

  const manifest = [
    `OptiVault Modpack`,
    `Minecraft: ${mcVersion}`,
    `Loader: ${loader}`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `Mods (${entries.length}):`,
    ...entries.map(
      (e) => `- ${e.slug} @ ${e.version.version_number}${e.isDependency ? " (dependency)" : ""}`,
    ),
  ].join("\n");
  zip.file("optivault-modpack-info.txt", manifest);

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `optivault-modpack-${mcVersion}-${loader}.zip`);
}
