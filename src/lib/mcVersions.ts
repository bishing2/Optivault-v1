export interface McVersionGroup {
  key: string;
  label: string;
  versions: string[];
}

const MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

interface ManifestEntry {
  id: string;
  type: string;
  releaseTime: string;
}

function groupKeyFor(id: string): string {
  return id.split(".").slice(0, 2).join(".");
}

function groupEntries(entries: { id: string; releaseTime: string }[]): McVersionGroup[] {
  const map = new Map<string, { id: string; releaseTime: string }[]>();
  for (const entry of entries) {
    const key = groupKeyFor(entry.id);
    const bucket = map.get(key);
    if (bucket) bucket.push(entry);
    else map.set(key, [entry]);
  }

  const groups = Array.from(map.entries()).map(([key, bucket]) => {
    bucket.sort((a, b) => (a.releaseTime < b.releaseTime ? 1 : -1));
    return { key, label: `${key}.x`, versions: bucket.map((e) => e.id), newestTime: bucket[0].releaseTime };
  });

  groups.sort((a, b) => (a.newestTime < b.newestTime ? 1 : -1));
  return groups.map(({ key, label, versions }) => ({ key, label, versions }));
}

/** Live-fetched from Mojang's own version manifest — always current, no hardcoded cutoff. */
export async function fetchMcVersionGroups(): Promise<McVersionGroup[]> {
  const res = await fetch(MANIFEST_URL);
  if (!res.ok) throw new Error(`Version manifest fetch failed (${res.status})`);
  const data = (await res.json()) as { versions: ManifestEntry[] };
  const releases = data.versions.filter((v) => v.type === "release");
  return groupEntries(releases);
}

// Used only if the live fetch fails (no network, Mojang unreachable) so the picker still works.
const FALLBACK_IDS = [
  { id: "1.21.4", releaseTime: "2024-12-03" },
  { id: "1.21.3", releaseTime: "2024-10-23" },
  { id: "1.21.1", releaseTime: "2024-08-08" },
  { id: "1.21", releaseTime: "2024-06-13" },
  { id: "1.20.6", releaseTime: "2024-04-29" },
  { id: "1.20.4", releaseTime: "2023-12-07" },
  { id: "1.20.1", releaseTime: "2023-06-12" },
  { id: "1.19.4", releaseTime: "2023-03-14" },
  { id: "1.19.2", releaseTime: "2022-08-05" },
  { id: "1.18.2", releaseTime: "2022-02-28" },
  { id: "1.17.1", releaseTime: "2021-07-06" },
  { id: "1.16.5", releaseTime: "2021-01-14" },
  { id: "1.16.1", releaseTime: "2020-06-24" },
  { id: "1.15.2", releaseTime: "2020-01-17" },
  { id: "1.14.4", releaseTime: "2019-10-14" },
  { id: "1.12.2", releaseTime: "2017-09-18" },
  { id: "1.8.9", releaseTime: "2015-12-09" },
];

export const FALLBACK_GROUPS = groupEntries(FALLBACK_IDS);
