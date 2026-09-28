import { Check, Plus, Lightbulb, Download } from "lucide-react";

interface Props {
  name: string;
  author: string;
  description: string;
  tip?: string;
  essential?: boolean;
  downloads?: string;
  iconUrl?: string | null;
  iconColor?: string;
  added: boolean;
  onToggle: () => void;
}

export function ModCard({
  name,
  author,
  description,
  tip,
  essential,
  downloads,
  iconUrl,
  iconColor = "#7c6fee",
  added,
  onToggle,
}: Props) {
  return (
    <div
      className={`rounded-xl border p-3.5 transition-colors ${
        added ? "border-accent/50 bg-accent-soft/40" : "border-border bg-surface"
      }`}
    >
      <div className="mb-2 flex items-start gap-2.5">
        {iconUrl ? (
          <img src={iconUrl} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
        ) : (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white"
            style={{ backgroundColor: iconColor }}
          >
            {name[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold text-text">{name}</div>
          <div className="truncate text-[11px] text-text-faint">by {author}</div>
        </div>
        <button
          onClick={onToggle}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${
            added ? "bg-accent text-white" : "bg-surface-2 text-text-muted hover:text-text"
          }`}
        >
          {added ? <Check size={13} /> : <Plus size={13} />}
          {added ? "Added" : "Add"}
        </button>
      </div>

      <p className="mb-2 text-[12px] leading-snug text-text-muted">{description}</p>

      {tip && (
        <div className="mb-2 flex items-start gap-1.5 rounded-lg bg-surface-2 px-2.5 py-2 text-[11px] leading-snug text-accent-light">
          <Lightbulb size={13} className="mt-0.5 shrink-0 text-warn" />
          <span>{tip}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] font-semibold text-text-faint">
        {essential && (
          <span className="rounded bg-good/15 px-1.5 py-0.5 text-good">ESSENTIAL</span>
        )}
        {downloads && (
          <span className="flex items-center gap-1">
            <Download size={11} /> {downloads} DLs
          </span>
        )}
      </div>
    </div>
  );
}
