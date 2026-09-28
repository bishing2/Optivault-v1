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
    <nav className="sticky bottom-0 z-30 flex border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {items.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
            style={{ color: isActive ? "var(--color-good)" : "var(--color-text-faint)" }}
          >
            {isActive && (
              <span className="absolute top-0 h-0.5 w-10 rounded-full bg-[var(--color-good)]" />
            )}
            <span className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {!!item.badge && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] font-bold text-white">
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
