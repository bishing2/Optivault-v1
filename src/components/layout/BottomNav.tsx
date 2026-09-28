import { Smartphone, Package } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export type Tab = "device" | "mods";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  const queueCount = useAppStore((s) => s.modQueue.length);

  const items: { id: Tab; label: string; icon: typeof Smartphone; badge?: number }[] = [
    { id: "device", label: "Device & JVM", icon: Smartphone },
    { id: "mods", label: "Mods", icon: Package, badge: queueCount },
  ];

  return (
    <nav className="sticky bottom-0 z-30 flex border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      {items.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
              isActive ? "text-good" : "text-text-faint"
            }`}
          >
            {isActive && <span className="gradient-good absolute top-0 h-0.5 w-10 rounded-full" />}
            <span className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {!!item.badge && (
                <span className="gradient-brand glow-accent absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
