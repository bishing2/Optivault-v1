import { Capacitor } from "@capacitor/core";
import FolderStorage, { ensureDownloadFolder } from "./folderStorage";
import { notifyDownloadComplete } from "./notify";

/**
 * Downloads a remote file (a Packs Hub modpack/texture pack) straight to the
 * user's chosen folder, with a completion notification. Falls back to a plain
 * navigation — which still triggers Android's own download manager via
 * Content-Disposition — on web, or if no folder is configured/picked.
 */
export async function downloadToDevice(url: string, filename: string, mimeType = "application/zip"): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    window.open(url, "_blank", "noopener");
    return;
  }

  const folder = await ensureDownloadFolder();
  if (!folder) {
    window.open(url, "_blank", "noopener");
    return;
  }

  await FolderStorage.downloadToFolder({ url, folderUri: folder.uri, filename, mimeType });
  await notifyDownloadComplete(filename, folder.name);
}
