import { useMemo, useState } from "react";
import { Search, Shield, Globe, Bolt, Sparkles, Swords, Wrench } from "lucide-react";
import { CURATED_MODS, MOD_CATEGORIES } from "../../data/curatedMods";
import { MODPACK_PRESETS } from "../../data/presets";
import { useAppStore } from "../../store/useAppStore";
import { ModCard } from "./ModCard";
import { estimateCuratedModRam, DEFAULT_MODRINTH_MOD_RAM_MB } from "../../lib/ramEstimate";
import { searchModrinth } from "../../lib/modrinth";
import type { ModCategory, ModrinthSearchHit } from "../../types";

const PRESET_ICON = { bolt: Bolt, globe: Globe, cross: Swords, sparkles: Sparkles } as const;

export function ModpackBrowser() {
  const [source, setSource] = useState<"curated" | "live">("curated");
  const [category, setCategory] = useState<ModCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [liveResults, setLiveResults] = useState<ModrinthSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const modQueue = useAppStore((s) => s.modQueue);
  const isQueued = useAppStore((s) => s.isQueued);
  const addMod = useAppStore((s) => s.addMod);
  const removeMod = useAppStore((s) => s.removeMod);
  const mcVersion = useAppStore((s) => s.mcVersion);
  const loader = useAppStore((s) => s.loader);

  const filteredCurated = useMemo(() => {
    return CURATED_MODS.filter((mod) => {
      if (category !== "all" && mod.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return mod.name.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [category, query]);

  function applyPreset(modIds: string[]) {
    for (const id of modIds) {
      if (isQueued(id)) continue;
      const mod = CURATED_MODS.find((m) => m.id === id);
      if (!mod) continue;
      addMod({
        id: mod.id,
        slug: mod.slug,
        name: mod.name,
        author: mod.author,
        source: "curated",
        iconColor: mod.iconColor,
        estimatedRamMB: estimateCuratedModRam(mod),
      });
    }
  }

  async function runLiveSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);
    const hits = await searchModrinth(query.trim(), mcVersion, loader);
    setLiveResults(hits);
    setSearching(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface p-4">
        <div className="gradient-brand pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-20 blur-2xl" />
        <div className="relative mb-1 flex items-center gap-2 text-[11px] font-bold text-cyan">
          <Shield size={13} /> CURATED &amp; MODRINTH CATALOG
          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-text-faint">
            MC {mcVersion} · {loader}
          </span>
        </div>
        <h2 className="font-display relative mb-3 text-xl font-bold text-text">Active Modpack Browser</h2>

        <div className="no-scrollbar relative flex gap-1.5 overflow-x-auto pb-1">
          {MODPACK_PRESETS.map((preset) => {
            const Icon = PRESET_ICON[preset.icon as keyof typeof PRESET_ICON] ?? Bolt;
            const gradientClass =
              preset.color === "good"
                ? "gradient-good glow-good text-black"
                : preset.color === "danger"
                  ? "gradient-danger text-white"
                  : "gradient-brand glow-accent text-white";
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.modIds)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-transform active:scale-95 ${gradientClass}`}
              >
                <Icon size={13} /> {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 rounded-xl border border-border bg-surface p-1.5">
        <button
          onClick={() => setSource("curated")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
            source === "curated" ? "gradient-brand text-white" : "text-text-muted"
          }`}
        >
          Curated Mobile ({CURATED_MODS.length})
        </button>
        <button
          onClick={() => setSource("live")}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
            source === "live" ? "gradient-brand text-white" : "text-text-muted"
          }`}
        >
          Modrinth Live
        </button>
      </div>

      {source === "curated" ? (
        <>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mods, performance tweaks, shaders..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
            />
          </div>

          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory("all")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                category === "all" ? "gradient-brand text-white" : "bg-surface text-text-muted"
              }`}
            >
              All Mods ({CURATED_MODS.length})
            </button>
            {MOD_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                  category === c.id ? "gradient-brand text-white" : "bg-surface text-text-muted"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredCurated.map((mod) => (
              <ModCard
                key={mod.id}
                name={mod.name}
                author={mod.author}
                description={mod.description}
                tip={mod.mobileTip}
                essential={mod.essential}
                downloads={mod.downloads}
                iconColor={mod.iconColor}
                added={isQueued(mod.id)}
                onToggle={() =>
                  isQueued(mod.id)
                    ? removeMod(mod.id)
                    : addMod({
                        id: mod.id,
                        slug: mod.slug,
                        name: mod.name,
                        author: mod.author,
                        source: "curated",
                        iconColor: mod.iconColor,
                        estimatedRamMB: estimateCuratedModRam(mod),
                      })
                }
              />
            ))}
            {filteredCurated.length === 0 && (
              <div className="py-8 text-center text-sm text-text-faint">No mods match your search.</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runLiveSearch()}
                placeholder="Search 50,000+ Modrinth mods..."
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-accent"
              />
            </div>
            <button
              onClick={runLiveSearch}
              className="gradient-brand glow-accent flex items-center gap-1.5 rounded-lg px-4 text-xs font-bold text-white"
            >
              <Search size={14} /> Search
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-cyan/20 bg-cyan-soft px-3 py-2 text-[11px] text-cyan">
            <span className="flex items-center gap-1.5">
              <Globe size={13} /> Searching Modrinth live directory for Minecraft {mcVersion} ({loader})
            </span>
            <span className="font-semibold">{liveResults.length} mods found</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {searching && (
              <div className="py-8 text-center text-sm text-text-faint">Searching Modrinth…</div>
            )}
            {!searching &&
              liveResults.map((hit) => (
                <ModCard
                  key={hit.project_id}
                  name={hit.title}
                  author={hit.author}
                  description={hit.description}
                  downloads={formatDownloads(hit.downloads)}
                  iconUrl={hit.icon_url}
                  added={isQueued(hit.project_id)}
                  onToggle={() =>
                    isQueued(hit.project_id)
                      ? removeMod(hit.project_id)
                      : addMod({
                          id: hit.project_id,
                          slug: hit.slug,
                          name: hit.title,
                          author: hit.author,
                          source: "modrinth",
                          iconUrl: hit.icon_url,
                          estimatedRamMB: DEFAULT_MODRINTH_MOD_RAM_MB,
                        })
                  }
                />
              ))}
            {!searching && searched && liveResults.length === 0 && (
              <div className="py-8 text-center text-sm text-text-faint">
                No mods found for "{query}" on {mcVersion} ({loader}).
              </div>
            )}
            {!searching && !searched && (
              <div className="py-8 text-center text-sm text-text-faint">
                Type a mod title (e.g. "Controlify", "Sodium", "Jade") and press Search.
              </div>
            )}
          </div>
        </>
      )}

      {modQueue.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-[11px] text-text-faint">
          <Wrench size={13} /> Your modpack is empty — add mods above or tap a preset to get started.
        </div>
      )}
    </div>
  );
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
