package com.bishing.optivault;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FolderStoragePlugin.class);
        super.onCreate(savedInstanceState);
        // Android's WebView doesn't reliably report env(safe-area-inset-*) on its own —
        // the safe-area plugin patches it, but needs edge-to-edge enabled to have
        // real inset values to report.
        EdgeToEdge.enable(this);
    }
}
