import { registerPlugin } from "@capacitor/core";

export interface FolderInfo {
  uri: string;
  name: string;
}

interface FolderStoragePlugin {
  pickFolder(): Promise<FolderInfo>;
  getSavedFolder(): Promise<{ uri: string | null; name: string | null }>;
  clearFolder(): Promise<void>;
  writeFile(options: { folderUri: string; filename: string; data: string; mimeType?: string }): Promise<{ uri: string }>;
  downloadToFolder(options: {
    url: string;
    folderUri: string;
    filename: string;
    mimeType?: string;
  }): Promise<{ uri: string }>;
}

/** Android-only: picks/persists a folder (SAF) and writes files directly into it. */
const FolderStorage = registerPlugin<FolderStoragePlugin>("FolderStorage");

export default FolderStorage;

/** Returns the saved folder, prompting the native picker once if none is set yet. Null if the user cancels. */
export async function ensureDownloadFolder(): Promise<FolderInfo | null> {
  const saved = await FolderStorage.getSavedFolder();
  if (saved.uri && saved.name) return { uri: saved.uri, name: saved.name };
  try {
    return await FolderStorage.pickFolder();
  } catch {
    return null;
  }
}

