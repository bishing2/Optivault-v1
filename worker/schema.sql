CREATE TABLE IF NOT EXISTS roles (
  device_id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  code_hash TEXT,
  granted_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS access_codes (
  code_hash TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  label TEXT
);

CREATE TABLE IF NOT EXISTS modpacks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  author_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  mc_version TEXT NOT NULL,
  loader TEXT NOT NULL,
  category TEXT NOT NULL,
  ram_mb INTEGER NOT NULL,
  size_mb REAL NOT NULL DEFAULT 0,
  jar_count INTEGER NOT NULL DEFAULT 0,
  download_url TEXT NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS texture_packs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  author_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  resolution TEXT NOT NULL,
  fps_boost_label TEXT,
  size_mb REAL NOT NULL DEFAULT 0,
  download_url TEXT NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
