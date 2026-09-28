import type { Env } from "./auth";

const RELEASE_TAG = "modpack-uploads";
const UA = "optivault-worker";

interface GithubRelease {
  id: number;
  upload_url: string;
}

async function ghFetch(env: Env, url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": UA,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

async function getOrCreateRelease(env: Env): Promise<GithubRelease> {
  const getRes = await ghFetch(env, `https://api.github.com/repos/${env.GITHUB_REPO}/releases/tags/${RELEASE_TAG}`);
  if (getRes.ok) return getRes.json();

  const createRes = await ghFetch(env, `https://api.github.com/repos/${env.GITHUB_REPO}/releases`, {
    method: "POST",
    body: JSON.stringify({
      tag_name: RELEASE_TAG,
      name: "Modpack Uploads",
      body: "Auto-created by OptiVault to host user-uploaded modpack and texture pack files.",
      draft: false,
      prerelease: false,
    }),
  });
  if (!createRes.ok) {
    throw new Error(`Couldn't create GitHub release (${createRes.status}): ${await createRes.text()}`);
  }
  return createRes.json();
}

/** Uploads a file to the shared GitHub release, returning its direct download URL. */
export async function uploadToGithub(
  env: Env,
  filename: string,
  contentType: string,
  body: ReadableStream | ArrayBuffer,
): Promise<string> {
  const release = await getOrCreateRelease(env);
  const uniqueName = `${crypto.randomUUID().slice(0, 8)}-${filename}`;

  const uploadUrl = `https://uploads.github.com/repos/${env.GITHUB_REPO}/releases/${release.id}/assets?name=${encodeURIComponent(uniqueName)}`;
  const res = await ghFetch(env, uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType || "application/octet-stream" },
    body,
    duplex: "half",
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`GitHub upload failed (${res.status}): ${await res.text()}`);
  }
  const asset = await res.json<{ browser_download_url: string }>();
  return asset.browser_download_url;
}
