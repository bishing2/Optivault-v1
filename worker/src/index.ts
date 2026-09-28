import { type Env, verifyDevice, getRole, sha256Hex, issueDeviceToken, generateAccessCode } from "./auth";
import { uploadToGithub } from "./github";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Device-Id, X-Device-Token, X-Filename",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function err(status: number, message: string): Response {
  return json({ ok: false, message }, status);
}

function modpackRowToJson(row: any) {
  return {
    id: row.id,
    name: row.name,
    authorName: row.author_name,
    description: row.description,
    imageUrl: row.image_url,
    mcVersion: row.mc_version,
    loader: row.loader,
    category: row.category,
    ramMB: row.ram_mb,
    sizeMB: row.size_mb,
    jarCount: row.jar_count,
    downloadUrl: row.download_url,
    downloadCount: row.download_count,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function texturePackRowToJson(row: any) {
  return {
    id: row.id,
    name: row.name,
    authorName: row.author_name,
    description: row.description,
    imageUrl: row.image_url,
    resolution: row.resolution,
    fpsBoostLabel: row.fps_boost_label ?? undefined,
    sizeMB: row.size_mb,
    downloadUrl: row.download_url,
    downloadCount: row.download_count,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const deviceId = await verifyDevice(request, env);

    try {
      // --- auth ---
      if (path === "/api/register" && request.method === "POST") {
        const newId = crypto.randomUUID();
        const token = await issueDeviceToken(env, newId);
        return json({ deviceId: newId, token });
      }

      if (path === "/api/me" && request.method === "GET") {
        const role = await getRole(env, deviceId);
        return json({ deviceId, role });
      }

      if (path === "/api/redeem" && request.method === "POST") {
        if (!deviceId) return err(401, "Not signed in.");
        const body = await request.json<{ code?: string }>();
        const code = (body.code ?? "").trim();
        if (!code) return err(400, "Code is required.");

        if (code === env.OWNER_SETUP_CODE) {
          const existingOwner = await env.DB.prepare("SELECT device_id FROM roles WHERE role = 'owner' LIMIT 1").first();
          if (existingOwner) return err(403, "An owner is already set for this project.");
          await env.DB.prepare(
            "INSERT INTO roles (device_id, role, code_hash, granted_at) VALUES (?1, 'owner', NULL, ?2) " +
              "ON CONFLICT(device_id) DO UPDATE SET role='owner', granted_at=?2",
          )
            .bind(deviceId, Date.now())
            .run();
          return json({ ok: true, role: "owner", message: "You're now the owner." });
        }

        const hash = await sha256Hex(code);
        const codeRow = await env.DB.prepare("SELECT role FROM access_codes WHERE code_hash = ?1")
          .bind(hash)
          .first<{ role: string }>();
        if (!codeRow) return json({ ok: false, message: "That code isn't valid." });

        const existingRole = await env.DB.prepare("SELECT device_id FROM roles WHERE device_id = ?1")
          .bind(deviceId)
          .first();
        if (existingRole) return json({ ok: false, message: "This device already has a role." });

        await env.DB.prepare(
          "INSERT INTO roles (device_id, role, code_hash, granted_at) VALUES (?1, ?2, ?3, ?4)",
        )
          .bind(deviceId, codeRow.role, hash, Date.now())
          .run();
        return json({ ok: true, role: codeRow.role, message: `Code accepted — you're now a ${codeRow.role}.` });
      }

      if (path === "/api/codes" && request.method === "POST") {
        if ((await getRole(env, deviceId)) !== "owner") return err(403, "Only the owner can create codes.");
        const body = await request.json<{ label?: string }>().catch(() => ({}) as { label?: string });
        const plainCode = generateAccessCode();
        const hash = await sha256Hex(plainCode);
        await env.DB.prepare(
          "INSERT INTO access_codes (code_hash, role, created_by, created_at, label) VALUES (?1, 'helper', ?2, ?3, ?4)",
        )
          .bind(hash, deviceId, Date.now(), body.label ?? null)
          .run();
        return json({ ok: true, code: plainCode });
      }

      // --- file uploads (proxied to a GitHub release) ---
      if (path === "/api/upload" && request.method === "POST") {
        const role = await getRole(env, deviceId);
        if (role !== "owner" && role !== "helper") return err(403, "Only owner/helper can upload files.");
        const filename = request.headers.get("X-Filename");
        if (!filename) return err(400, "X-Filename header is required.");
        if (!request.body) return err(400, "Request body is empty.");

        const contentType = request.headers.get("Content-Type") ?? "application/octet-stream";
        const url = await uploadToGithub(env, filename, contentType, request.body);
        return json({ ok: true, url });
      }

      // --- modpacks ---
      if (path === "/api/modpacks" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM modpacks ORDER BY created_at DESC").all();
        return json((results ?? []).map(modpackRowToJson));
      }

      if (path === "/api/modpacks" && request.method === "POST") {
        const role = await getRole(env, deviceId);
        if (role !== "owner" && role !== "helper") return err(403, "Only owner/helper can add modpacks.");
        const b = await request.json<any>();
        const id = crypto.randomUUID();
        const now = Date.now();
        await env.DB.prepare(
          `INSERT INTO modpacks (id, name, author_name, description, image_url, mc_version, loader, category, ram_mb, size_mb, jar_count, download_url, download_count, created_by, created_at, updated_at)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,0,?13,?14,?14)`,
        )
          .bind(
            id,
            b.name,
            b.authorName ?? "You",
            b.description ?? "",
            b.imageUrl ?? null,
            b.mcVersion,
            b.loader,
            b.category,
            b.ramMB,
            b.sizeMB ?? 0,
            b.jarCount ?? 0,
            b.downloadUrl,
            deviceId,
            now,
          )
          .run();
        return json({ ok: true, id });
      }

      const modpackIdMatch = path.match(/^\/api\/modpacks\/([^/]+)$/);
      if (modpackIdMatch && request.method === "PATCH") {
        const role = await getRole(env, deviceId);
        if (role !== "owner" && role !== "helper") return err(403, "Only owner/helper can edit modpacks.");
        const id = modpackIdMatch[1];
        const b = await request.json<any>();
        await env.DB.prepare(
          `UPDATE modpacks SET name=?1, author_name=?2, description=?3, image_url=?4, mc_version=?5, loader=?6, category=?7, ram_mb=?8, size_mb=?9, jar_count=?10, download_url=?11, updated_at=?12 WHERE id=?13`,
        )
          .bind(
            b.name,
            b.authorName ?? "You",
            b.description ?? "",
            b.imageUrl ?? null,
            b.mcVersion,
            b.loader,
            b.category,
            b.ramMB,
            b.sizeMB ?? 0,
            b.jarCount ?? 0,
            b.downloadUrl,
            Date.now(),
            id,
          )
          .run();
        return json({ ok: true });
      }

      if (modpackIdMatch && request.method === "DELETE") {
        if ((await getRole(env, deviceId)) !== "owner") return err(403, "Only the owner can delete modpacks.");
        await env.DB.prepare("DELETE FROM modpacks WHERE id=?1").bind(modpackIdMatch[1]).run();
        return json({ ok: true });
      }

      const modpackDownloadMatch = path.match(/^\/api\/modpacks\/([^/]+)\/download$/);
      if (modpackDownloadMatch && request.method === "POST") {
        await env.DB.prepare("UPDATE modpacks SET download_count = download_count + 1 WHERE id=?1")
          .bind(modpackDownloadMatch[1])
          .run();
        return json({ ok: true });
      }

      // --- texture packs ---
      if (path === "/api/texturepacks" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM texture_packs ORDER BY created_at DESC").all();
        return json((results ?? []).map(texturePackRowToJson));
      }

      if (path === "/api/texturepacks" && request.method === "POST") {
        const role = await getRole(env, deviceId);
        if (role !== "owner" && role !== "helper") return err(403, "Only owner/helper can add texture packs.");
        const b = await request.json<any>();
        const id = crypto.randomUUID();
        const now = Date.now();
        await env.DB.prepare(
          `INSERT INTO texture_packs (id, name, author_name, description, image_url, resolution, fps_boost_label, size_mb, download_url, download_count, created_by, created_at, updated_at)
           VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,0,?10,?11,?11)`,
        )
          .bind(
            id,
            b.name,
            b.authorName ?? "You",
            b.description ?? "",
            b.imageUrl ?? null,
            b.resolution,
            b.fpsBoostLabel ?? null,
            b.sizeMB ?? 0,
            b.downloadUrl,
            deviceId,
            now,
          )
          .run();
        return json({ ok: true, id });
      }

      const texIdMatch = path.match(/^\/api\/texturepacks\/([^/]+)$/);
      if (texIdMatch && request.method === "PATCH") {
        const role = await getRole(env, deviceId);
        if (role !== "owner" && role !== "helper") return err(403, "Only owner/helper can edit texture packs.");
        const id = texIdMatch[1];
        const b = await request.json<any>();
        await env.DB.prepare(
          `UPDATE texture_packs SET name=?1, author_name=?2, description=?3, image_url=?4, resolution=?5, fps_boost_label=?6, size_mb=?7, download_url=?8, updated_at=?9 WHERE id=?10`,
        )
          .bind(
            b.name,
            b.authorName ?? "You",
            b.description ?? "",
            b.imageUrl ?? null,
            b.resolution,
            b.fpsBoostLabel ?? null,
            b.sizeMB ?? 0,
            b.downloadUrl,
            Date.now(),
            id,
          )
          .run();
        return json({ ok: true });
      }

      if (texIdMatch && request.method === "DELETE") {
        if ((await getRole(env, deviceId)) !== "owner") return err(403, "Only the owner can delete texture packs.");
        await env.DB.prepare("DELETE FROM texture_packs WHERE id=?1").bind(texIdMatch[1]).run();
        return json({ ok: true });
      }

      const texDownloadMatch = path.match(/^\/api\/texturepacks\/([^/]+)\/download$/);
      if (texDownloadMatch && request.method === "POST") {
        await env.DB.prepare("UPDATE texture_packs SET download_count = download_count + 1 WHERE id=?1")
          .bind(texDownloadMatch[1])
          .run();
        return json({ ok: true });
      }

      // --- site config ---
      if (path === "/api/site-config/logo" && request.method === "GET") {
        const row = await env.DB.prepare("SELECT value FROM site_config WHERE key = 'logo'").first<{
          value: string;
        }>();
        return json({ url: row?.value ?? null });
      }

      if (path === "/api/site-config/logo" && request.method === "PUT") {
        if ((await getRole(env, deviceId)) !== "owner") return err(403, "Only the owner can change the logo.");
        const b = await request.json<{ url?: string }>();
        if (!b.url) return err(400, "url is required.");
        await env.DB.prepare(
          "INSERT INTO site_config (key, value) VALUES ('logo', ?1) ON CONFLICT(key) DO UPDATE SET value=?1",
        )
          .bind(b.url)
          .run();
        return json({ ok: true });
      }

      return err(404, "Not found.");
    } catch (e) {
      return err(500, e instanceof Error ? e.message : "Internal error.");
    }
  },
};
