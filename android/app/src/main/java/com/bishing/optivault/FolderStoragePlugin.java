package com.bishing.optivault;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Base64;
import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Lets the user pick a persistent folder (Android Storage Access Framework) and
 * write or download files directly into it, instead of going through the share
 * sheet. Downloads happen with plain Java networking (not a browser fetch), so
 * they are not subject to CORS — unlike a WebView fetch() against GitHub's
 * release CDN, which has no CORS headers and fails.
 */
@CapacitorPlugin(name = "FolderStorage")
public class FolderStoragePlugin extends Plugin {

    private static final String PREFS = "optivault_folder_storage";

    @PluginMethod
    public void pickFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(
            Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
        );
        startActivityForResult(call, intent, "pickFolderResult");
    }

    @ActivityCallback
    private void pickFolderResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            call.reject("Folder selection cancelled.");
            return;
        }
        Uri treeUri = result.getData().getData();
        if (treeUri == null) {
            call.reject("No folder selected.");
            return;
        }

        int takeFlags = Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
        try {
            getContext().getContentResolver().takePersistableUriPermission(treeUri, takeFlags);
        } catch (SecurityException e) {
            call.reject("Couldn't get lasting access to that folder: " + e.getMessage());
            return;
        }

        DocumentFile dir = DocumentFile.fromTreeUri(getContext(), treeUri);
        String displayName = dir != null && dir.getName() != null ? dir.getName() : treeUri.getLastPathSegment();

        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        prefs.edit().putString("uri", treeUri.toString()).putString("name", displayName).apply();

        JSObject ret = new JSObject();
        ret.put("uri", treeUri.toString());
        ret.put("name", displayName);
        call.resolve(ret);
    }

    @PluginMethod
    public void getSavedFolder(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        JSObject ret = new JSObject();
        ret.put("uri", prefs.getString("uri", null));
        ret.put("name", prefs.getString("name", null));
        call.resolve(ret);
    }

    @PluginMethod
    public void clearFolder(PluginCall call) {
        getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().apply();
        call.resolve();
    }

    /** Writes already-in-memory bytes (base64) into the chosen folder — for client-built zips. */
    @PluginMethod
    public void writeFile(PluginCall call) {
        String folderUriStr = call.getString("folderUri");
        String filename = call.getString("filename");
        String data = call.getString("data");
        String mimeType = call.getString("mimeType", "application/octet-stream");

        if (folderUriStr == null || filename == null || data == null) {
            call.reject("folderUri, filename and data are required.");
            return;
        }

        new Thread(() -> {
            try {
                DocumentFile file = createFileInFolder(folderUriStr, filename, mimeType, call);
                if (file == null) return;

                try (OutputStream out = getContext().getContentResolver().openOutputStream(file.getUri())) {
                    if (out == null) {
                        call.reject("Couldn't open the file for writing.");
                        return;
                    }
                    byte[] bytes = Base64.decode(data, Base64.DEFAULT);
                    out.write(bytes);
                }

                JSObject ret = new JSObject();
                ret.put("uri", file.getUri().toString());
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Write failed: " + e.getMessage(), e);
            }
        }).start();
    }

    /** Downloads a URL with plain Java networking (no CORS) straight into the chosen folder. */
    @PluginMethod
    public void downloadToFolder(PluginCall call) {
        String urlStr = call.getString("url");
        String folderUriStr = call.getString("folderUri");
        String filename = call.getString("filename");
        String mimeType = call.getString("mimeType", "application/octet-stream");

        if (urlStr == null || folderUriStr == null || filename == null) {
            call.reject("url, folderUri and filename are required.");
            return;
        }

        new Thread(() -> {
            HttpURLConnection conn = null;
            try {
                DocumentFile file = createFileInFolder(folderUriStr, filename, mimeType, call);
                if (file == null) return;

                URL url = new URL(urlStr);
                conn = (HttpURLConnection) url.openConnection();
                conn.setInstanceFollowRedirects(true);
                conn.setConnectTimeout(20000);
                conn.setReadTimeout(30000);
                conn.connect();

                int code = conn.getResponseCode();
                if (code < 200 || code >= 300) {
                    call.reject("Download failed (HTTP " + code + ").");
                    return;
                }

                try (
                    InputStream in = conn.getInputStream();
                    OutputStream out = getContext().getContentResolver().openOutputStream(file.getUri())
                ) {
                    if (out == null) {
                        call.reject("Couldn't open the file for writing.");
                        return;
                    }
                    byte[] buf = new byte[16384];
                    int n;
                    while ((n = in.read(buf)) != -1) {
                        out.write(buf, 0, n);
                    }
                }

                JSObject ret = new JSObject();
                ret.put("uri", file.getUri().toString());
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Download failed: " + e.getMessage(), e);
            } finally {
                if (conn != null) conn.disconnect();
            }
        }).start();
    }

    /** Resolves the folder, deletes any same-name file, and creates a fresh one. Rejects the call itself on failure. */
    private DocumentFile createFileInFolder(String folderUriStr, String filename, String mimeType, PluginCall call) {
        Uri treeUri = Uri.parse(folderUriStr);
        DocumentFile dir = DocumentFile.fromTreeUri(getContext(), treeUri);
        if (dir == null || !dir.canWrite()) {
            call.reject("Can't write to the selected folder anymore. Pick it again in Packs Hub.");
            return null;
        }

        DocumentFile existing = dir.findFile(filename);
        if (existing != null) existing.delete();

        DocumentFile file = dir.createFile(mimeType, filename);
        if (file == null) {
            call.reject("Couldn't create the file in the selected folder.");
            return null;
        }
        return file;
    }
}
