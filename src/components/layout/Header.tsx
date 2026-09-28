import { Box } from "lucide-react";
import { useAppStore, MC_VERSIONS, LOADERS } from "../../store/useAppStore";

export function Header() {
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);
  const setMcVersion = useAppStore((s) => s.setMcVersion);
  const setLoader = useAppStore((s) => s.setLoader);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
          <Box size={18} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[15px] font-bold text-[var(--color-text)]">OptiVault</div>
          <div className="truncate text-[11px] text-[var(--color-text-faint)]">
            by <span className="text-[var(--color-accent-light)]">bishing</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <select
          value={mcVersion}
          onChange={(e) => setMcVersion(e.target.value)}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs font-semibold text-[var(--color-text)] outline-none"
        >
          {MC_VERSIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={loader}
          onChange={(e) => setLoader(e.target.value as any)}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-xs font-semibold text-[var(--color-accent-light)] outline-none"
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
