import { saveAs } from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Saves a blob to the device. Plain browser Blob-URL downloads (file-saver)
 * silently no-op inside a Capacitor Android WebView, so on native platforms
 * this writes the file to app cache and hands it to the OS share sheet
 * instead, where the user picks "Save to Downloads" / Files / etc.
 */
export async function saveBlob(blob: Blob, filename: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    saveAs(blob, filename);
    return;
  }

  const base64 = await blobToBase64(blob);
  const written = await Filesystem.writeFile({
    path: filename,
    data: base64,
    directory: Directory.Cache,
  });

  await Share.share({
    title: filename,
    url: written.uri,
    dialogTitle: `Save ${filename}`,
  });
}
