import type {
  Loader,
  ModrinthSearchHit,
  ModrinthVersion,
} from "../types";

const BASE = "https://api.modrinth.com/v2";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Modrinth request failed (${res.status}): ${path}`);
  }
  return (await res.json()) as T;
}

export async function searchModrinth(
  query: string,
  mcVersion: string,
  loader: Loader,
  limit = 20,
): Promise<ModrinthSearchHit[]> {
  const facets = JSON.stringify([
    ["project_type:mod"],
    [`categories:${loader}`],
    [`versions:${mcVersion}`],
  ]);
  const params = new URLSearchParams({
    query,
    facets,
    limit: String(limit),
  });
  try {
    const data = await get<{ hits: any[] }>(`/search?${params.toString()}`);
    return data.hits.map((h) => ({
      project_id: h.project_id,
      slug: h.slug,
      title: h.title,
      description: h.description,
      author: h.author,
      downloads: h.downloads,
      icon_url: h.icon_url,
      categories: h.display_categories ?? h.categories ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getVersionsFor(
  slugOrId: string,
  mcVersion: string,
  loader: Loader,
): Promise<ModrinthVersion[]> {
  const params = new URLSearchParams({
    loaders: JSON.stringify([loader]),
    game_versions: JSON.stringify([mcVersion]),
  });
  try {
    return await get<ModrinthVersion[]>(
      `/project/${encodeURIComponent(slugOrId)}/version?${params.toString()}`,
    );
  } catch {
    return [];
  }
}

export async function getBestVersion(
  slugOrId: string,
  mcVersion: string,
  loader: Loader,
): Promise<ModrinthVersion | null> {
  const versions = await getVersionsFor(slugOrId, mcVersion, loader);
  if (versions.length === 0) return null;
  // Prefer release > beta > alpha, then most recent (API returns newest first already)
  const releaseFirst = [...versions].sort((a: any, b: any) => {
    const rank = (v: any) =>
      v.version_type === "release" ? 0 : v.version_type === "beta" ? 1 : 2;
    return rank(a) - rank(b);
  });
  return releaseFirst[0];
}

export interface ResolvedModEntry {
  slug: string;
  version: ModrinthVersion;
  isDependency: boolean;
}

export interface ResolveResult {
  resolved: ResolvedModEntry[];
  incompatible: string[]; // slugs that have no version for this MC version + loader
}

/**
 * Given a set of curated/searched mod slugs, resolves the best compatible
 * Modrinth version for each, then recursively pulls in required
 * dependencies. Mods with no compatible version are reported back rather
 * than silently dropped.
 */
export async function resolveModpack(
  slugs: string[],
  mcVersion: string,
  loader: Loader,
): Promise<ResolveResult> {
  const resolved = new Map<string, ResolvedModEntry>();
  const incompatible: string[] = [];
  const queue = [...slugs];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const slug = queue.shift()!;
    if (seen.has(slug)) continue;
    seen.add(slug);

    const version = await getBestVersion(slug, mcVersion, loader);
    if (!version) {
      incompatible.push(slug);
      continue;
    }

    resolved.set(slug, {
      slug,
      version,
      isDependency: !slugs.includes(slug),
    });

    for (const dep of version.dependencies ?? []) {
      if (dep.dependency_type !== "required") continue;
      const depKey = dep.project_id ?? dep.version_id;
      if (!depKey || seen.has(depKey)) continue;
      queue.push(depKey);
    }
  }

  return { resolved: [...resolved.values()], incompatible };
}
