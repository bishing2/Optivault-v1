import { useState } from "react";
import { Download, Sparkles } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { QueueSheet } from "./QueueSheet";

export function StickyQueueButton() {
  const count = useAppStore((s) => s.modQueue.length);
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="gradient-good glow-good font-display fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] right-4 z-30 flex items-center gap-2 rounded-full px-4 py-3 text-[13px] font-bold text-black active:scale-95"
      >
        <Download size={16} />
        {count} Mods Queued
        <Sparkles size={14} />
      </button>
      {open && <QueueSheet onClose={() => setOpen(false)} />}
    </>
  );
}
