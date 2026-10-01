import { Smartphone, Wand2, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  onJump: () => void;
}

export function SetupStrip({ onJump }: Props) {
  const device = useAppStore((s) => s.device);
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);
  const isCustom = device.id === "custom";

  return (
    <button
      onClick={onJump}
      className="glass flex items-center gap-2.5 border-b border-border px-4 py-2 text-left"
    >
      {isCustom ? (
        <span className="gradient-warn flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold text-black">
          <Wand2 size={10} /> CUSTOM
        </span>
      ) : (
        <Smartphone size={13} className="shrink-0 text-accent-light" />
      )}
      <span className={`truncate text-[11.5px] font-bold ${isCustom ? "text-warn" : "text-text"}`}>
        {device.name.split(" / ")[0].replace("Custom (", "").replace(")", "")}
      </span>
      <Dot />
      <span className="shrink-0 text-[11.5px] font-bold text-accent-light">{device.ramGB}GB</span>
      <Dot />
      <span className="shrink-0 text-[11.5px] font-semibold text-text-muted">{mcVersion}</span>
      <Dot />
      <span className="shrink-0 text-[11.5px] font-semibold capitalize text-text-muted">{loader}</span>
      <span className="flex-1" />
      <ChevronRight size={13} className="shrink-0 text-text-faint" />
    </button>
  );
}

function Dot() {
  return <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-text-faint" />;
}
