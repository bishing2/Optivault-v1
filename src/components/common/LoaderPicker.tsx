import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";
import { LOADERS } from "../../store/useAppStore";
import type { Loader } from "../../types";
import { tapHaptic } from "../../lib/haptics";

interface Props {
  value: Loader;
  onChange: (l: Loader) => void;
}

export function LoaderPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = LOADERS.find((l) => l.id === value);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-text"
      >
        {current?.label ?? value}
        <ChevronDown size={13} className="text-text-faint" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={() => setOpen(false)}>
            <div
              className="glass-strong glass-contour flex w-full flex-col rounded-t-2xl border-t border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="font-display text-[15px] font-bold text-text">Select Mod Loader</div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-text-faint hover:text-text">
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
                {LOADERS.map((l) => {
                  const active = l.id === value;
                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        tapHaptic();
                        onChange(l.id);
                        setOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-bold ${
                        active ? "bg-good-soft text-good" : "text-text-muted"
                      }`}
                    >
                      {l.label}
                      {active && <Check size={15} />}
                    </button>
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
