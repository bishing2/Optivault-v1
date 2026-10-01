import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";
import { useMcVersionsStore } from "../../store/useMcVersionsStore";

interface Props {
  value: string;
  onChange: (v: string) => void;
  variant?: "compact" | "field";
}

export function VersionPicker({ value, onChange, variant = "compact" }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const groups = useMcVersionsStore((s) => s.groups);
  const loading = useMcVersionsStore((s) => s.loading);
  const error = useMcVersionsStore((s) => s.error);
  const fetchIfNeeded = useMcVersionsStore((s) => s.fetchIfNeeded);

  useEffect(() => {
    if (!open) return;
    fetchIfNeeded();
    const currentGroup = groups.find((g) => g.versions.includes(value));
    setExpanded(currentGroup?.key ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          variant === "compact"
            ? "flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-text"
            : "flex w-full items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent"
        }
      >
        {value}
        <ChevronDown size={variant === "compact" ? 13 : 15} className="text-text-faint" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="glass glass-contour flex max-h-[75vh] w-full flex-col rounded-t-2xl border-t border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="font-display text-[15px] font-bold text-text">Select Minecraft Version</div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-text-faint hover:text-text">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="border-b border-border bg-warn-soft px-4 py-2 text-[11px] font-semibold text-warn">
                Couldn't fetch the latest list — showing cached versions.
              </div>
            )}

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
              {loading && groups.length === 0 && (
                <div className="py-8 text-center text-sm text-text-faint">Loading versions…</div>
              )}

              {groups.map((g) => {
                const isExpanded = expanded === g.key;
                const hasSelected = g.versions.includes(value);
                return (
                  <div key={g.key}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : g.key)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-surface-2"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-text">
                        {g.label}
                        <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-faint">
                          {g.versions.length}
                        </span>
                        {hasSelected && <Check size={13} className="text-good" />}
                      </span>
                      <ChevronDown
                        size={15}
                        className={`text-text-faint transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 py-1 pl-3">
                        {g.versions.map((v) => {
                          const active = v === value;
                          return (
                            <button
                              key={v}
                              onClick={() => {
                                onChange(v);
                                setOpen(false);
                              }}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                                active
                                  ? "bg-good-soft font-bold text-good"
                                  : "text-text-muted hover:bg-surface-2"
                              }`}
                            >
                              {v}
                              {active && <Check size={14} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
