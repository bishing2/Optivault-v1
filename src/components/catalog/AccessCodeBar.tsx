import { useState } from "react";
import { KeyRound, Shield, ShieldCheck, Check, Copy } from "lucide-react";
import { useRoleStore } from "../../store/useRoleStore";

export function AccessCodeBar() {
  const role = useRoleStore((s) => s.role);
  const redeemCode = useRoleStore((s) => s.redeemCode);
  const generateHelperCode = useRoleStore((s) => s.generateHelperCode);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submitCode() {
    if (!code.trim()) return;
    setBusy(true);
    const res = await redeemCode(code.trim());
    setMessage({ ok: res.ok, text: res.message });
    setBusy(false);
    if (res.ok) setCode("");
  }

  async function createHelperCode() {
    setBusy(true);
    const res = await generateHelperCode();
    setBusy(false);
    if (res.ok && res.code) {
      setNewCode(res.code);
    } else {
      setMessage({ ok: false, text: res.message });
    }
  }

  const roleLabel = role === "owner" ? "Owner" : role === "helper" ? "Helper" : "Guest Mode";

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-text-muted">
            {role === "guest" ? <Shield size={15} /> : <ShieldCheck size={15} className="text-accent-light" />}
          </div>
          <div>
            <div className="text-[13px] font-bold text-text">{roleLabel}</div>
            <div className="text-[11px] text-text-faint">
              {role === "guest"
                ? "Enter an access code to unlock upload permissions."
                : "You can upload and edit catalog listings."}
            </div>
          </div>
        </div>
        {role !== "guest" && (
          <span className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-light">
            {roleLabel}
          </span>
        )}
      </div>

      {role === "guest" && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <KeyRound size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCode()}
              placeholder="Enter access code"
              className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-8 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
            />
          </div>
          <button
            onClick={submitCode}
            disabled={busy}
            className="gradient-brand rounded-lg px-4 text-xs font-bold text-black disabled:opacity-50"
          >
            Unlock
          </button>
        </div>
      )}

      {role === "owner" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={createHelperCode}
            disabled={busy}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent-soft py-2 text-xs font-bold text-accent-light disabled:opacity-50"
          >
            <KeyRound size={13} /> Generate Helper Code
          </button>
          {newCode && (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-accent/30 bg-surface-2 px-3 py-2">
              <code className="font-mono text-[13px] font-bold text-accent-light">{newCode}</code>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(newCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-text-muted hover:text-text"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className={`mt-2 text-[11px] font-semibold ${message.ok ? "text-accent-light" : "text-danger"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
