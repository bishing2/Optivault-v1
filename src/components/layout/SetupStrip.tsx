import { Smartphone, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface Props {
  onJump: () => void;
}

export function SetupStrip({ onJump }: Props) {
  const device = useAppStore((s) => s.device);
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);

  return (
    <button
      onClick={onJump}
      className="glass flex items-center gap-2.5 border-b border-border px-4 py-2 text-left"
    >
      <Smartphone size={13} className="shrink-0 text-accent-light" />
      <span className="truncate text-[11.5px] font-bold text-text">{device.name.split(" / ")[0]}</span>
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
