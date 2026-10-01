import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

let permissionChecked = false;
let granted = false;

async function ensurePermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (permissionChecked) return granted;
  permissionChecked = true;
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === "granted") {
      granted = true;
    } else {
      const requested = await LocalNotifications.requestPermissions();
      granted = requested.display === "granted";
    }
  } catch {
    granted = false;
  }
  return granted;
}

/** Fires a local "download complete" notification. Silently no-ops on web or if permission is denied. */
export async function notifyDownloadComplete(filename: string, folderName: string): Promise<void> {
  try {
    if (!(await ensurePermission())) return;
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Math.floor(Date.now() % 2147483647),
          title: "Download complete",
          body: `${filename} saved to "${folderName}"`,
        },
      ],
    });
  } catch {
    // Notifications are a nicety, never block the download itself on failure.
  }
}
