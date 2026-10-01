import { useAppStore, LOADERS } from "../../store/useAppStore";
import { useSiteConfigStore } from "../../store/useSiteConfigStore";
import { VersionPicker } from "../common/VersionPicker";

export function Header() {
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);
  const setMcVersion = useAppStore((s) => s.setMcVersion);
  const setLoader = useAppStore((s) => s.setLoader);
  const logoUrl = useSiteConfigStore((s) => s.logoUrl);

  return (
    <header className="glass glass-contour sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src={logoUrl || "/app-icon.png"}
          alt=""
          className="glow-accent h-9 w-9 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 leading-tight">
          <div className="font-display truncate text-[16px] font-bold text-gradient-brand">OptiVault</div>
          <div className="truncate text-[11px] text-text-faint">
            by <span className="font-semibold text-accent-light">bishing</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <VersionPicker value={mcVersion} onChange={setMcVersion} variant="compact" />
        <select
          value={loader}
          onChange={(e) => setLoader(e.target.value as any)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-text outline-none"
        >
          {LOADERS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
