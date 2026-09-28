export type DeviceTier = "flagship" | "upper-mid" | "mid" | "budget" | "entry";

export type Renderer = "zink-turnip" | "gl4es-virgl";

export interface DevicePreset {
  id: string;
  name: string;
  brand: string;
  chipset: string;
  gpu: string;
  ramGB: number;
  tier: DeviceTier;
  renderer: Renderer;
  recommendedRamMB: number;
  minRamMB: number;
  maxRamMB: number;
  resolutionScaler: number;
  sustainedPerformance: boolean;
}

export type ModCategory =
  | "fps"
  | "stability"
  | "survival"
  | "pvp"
  | "shaders"
  | "controls";

export interface CuratedMod {
  id: string;
  slug: string;
  name: string;
  author: string;
  description: string;
  mobileTip: string;
  category: ModCategory;
  essential: boolean;
  downloads: string;
  iconColor: string;
}

export type Loader = "fabric" | "forge" | "neoforge" | "quilt";

export interface ModrinthVersionFile {
  url: string;
  filename: string;
  primary: boolean;
  size: number;
}

export interface ModrinthVersion {
  id: string;
  project_id: string;
  version_number: string;
  name: string;
  game_versions: string[];
  loaders: string[];
  dependencies: ModrinthDependency[];
  files: ModrinthVersionFile[];
}

export interface ModrinthDependency {
  project_id: string | null;
  version_id: string | null;
  dependency_type: "required" | "optional" | "incompatible" | "embedded";
}

export interface ModrinthSearchHit {
  project_id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  downloads: number;
  icon_url: string | null;
  categories: string[];
}

export interface QueuedMod {
  id: string;
  slug: string;
  name: string;
  author: string;
  source: "curated" | "modrinth" | "dependency";
  iconUrl?: string | null;
  iconColor?: string;
  estimatedRamMB: number;
}

export type UserRole = "owner" | "helper";

export interface RoleDoc {
  role: UserRole;
  codeHash: string;
  grantedAt: number;
}

export interface AccessCodeDoc {
  role: UserRole;
  createdBy: string;
  createdAt: number;
  label?: string;
}

export type CatalogCategory =
  | "fps"
  | "shaders"
  | "potato"
  | "pvp"
  | "survival";

export interface PrebuiltModpack {
  id: string;
  name: string;
  authorName: string;
  description: string;
  imageUrl?: string | null;
  mcVersion: string;
  loader: Loader;
  category: CatalogCategory;
  ramMB: number;
  modSlugs: string[];
  downloadCount: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface TexturePack {
  id: string;
  name: string;
  authorName: string;
  description: string;
  imageUrl?: string | null;
  resolution: "8x" | "16x" | "32x" | "64x";
  fpsBoostLabel?: string;
  modrinthSlug: string;
  downloadCount: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
