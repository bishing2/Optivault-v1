import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";

export function DeviceIdNote() {
  const uid = useRoleStore((s) => s.uid);
  const [copied, setCopied] = useState(false);
  if (!uid) return null;

  return (
    <details className="rounded-xl border border-border bg-surface p-3 text-[11px] text-text-faint">
      <summary className="cursor-pointer select-none font-semibold text-text-muted">
        First time setting up? Bootstrap the owner account
      </summary>
      <p className="mt-2 leading-relaxed">
        Copy your device ID below and add it as a document in Firestore: collection <code className="rounded bg-surface-2 px-1 text-accent-light">roles</code>,
        document ID = your device ID, field <code className="rounded bg-surface-2 px-1 text-accent-light">role</code> = <code className="rounded bg-surface-2 px-1 text-accent-light">"owner"</code>.
      </p>
      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
        <code className="truncate font-mono text-[11px] text-text">{uid}</code>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(uid);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="flex shrink-0 items-center gap-1 text-text-muted hover:text-text"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
    </details>
  );
}
