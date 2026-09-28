<div align="center">

<img src="assets/icon.png" width="96" height="96" alt="OptiVault icon" />

# OptiVault

**Build, tune, and share Minecraft: Bedrock/Java modpacks for PojavLauncher on Android.**

[![Platform](https://img.shields.io/badge/platform-Android-3ddc84)](#-installing-the-apk)
[![Built with Capacitor](https://img.shields.io/badge/built%20with-Capacitor-119eff)](https://capacitorjs.com/)
[![Backend](https://img.shields.io/badge/backend-Cloudflare%20Workers%20%2B%20D1-f38020)](#-backend-architecture)

[Download the APK](../../releases/latest) · [Report an issue](../../issues)

</div>

---

## What is OptiVault?

OptiVault is a mobile-first companion app for **PojavLauncher** players — people running Minecraft: Java Edition on their phones. Tuning JVM flags, hunting down mobile-friendly mods, and assembling a working modpack on a touchscreen is painful. OptiVault turns that into a few taps:

- **Device & JVM** — pick your phone (or enter its specs) and instantly get tuned JVM arguments, RAM allocation, and render-distance/graphics recommendations for PojavLauncher.
- **Mods** — browse a curated catalog of mobile-friendly mods (performance, QoL, visual) alongside a live [Modrinth](https://modrinth.com/) search, queue up what you want, and export a ready-to-drop `.zip` sized for your Minecraft version and mod loader.
- **Packs Hub** — browse and download community-published modpacks and texture packs, or (if you're a contributor) publish your own by uploading a `.zip` and a cover image directly from your phone.

No desktop required, no manual JAR hunting, no guessing at `-Xmx` values.

## Screenshots

<div align="center">
<em>Add screenshots of the Device & JVM, Mods, and Packs Hub tabs here.</em>
</div>

## Features

| | |
|---|---|
| 🎛 **JVM tuning** | Device presets + custom RAM/CPU input generate copy-ready PojavLauncher JVM args |
| 🧩 **Mod catalog** | Curated, mobile-tested mods plus live Modrinth search by Minecraft version & loader |
| 📦 **One-tap modpack export** | Selected mods are packaged into a single `.zip` client-side (via JSZip) and shared straight to your device |
| 🌐 **Packs Hub** | A community catalog of pre-built modpacks and texture packs, backed by a real API |
| 👤 **Lightweight roles** | Device-bound access codes gate who can publish/edit packs — no accounts, email, or passwords |
| 📱 **Native Android app** | Packaged with Capacitor; installs like any APK, works offline for the Device & JVM and Mods tabs |

## Tech stack

**App**
- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first theme tokens)
- [Zustand](https://github.com/pmndrs/zustand) for state
- [Capacitor](https://capacitorjs.com/) for the Android build (`@capacitor/filesystem`, `@capacitor/share`, `@capacitor/status-bar`)
- [JSZip](https://stuk.github.io/jszip/) for client-side modpack packaging

**Backend** (`worker/`)
- [Cloudflare Workers](https://workers.cloudflare.com/) — REST API, zero cold-start, generous free tier
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite database for packs, roles, and access codes
- Custom HMAC-signed device tokens for auth (no third-party auth provider)
- GitHub Releases used as free file storage/CDN for uploaded `.zip`s and cover images

## Project structure

```
src/
  components/    UI components (device, mods, catalog/Packs Hub, layout)
  pages/         Top-level tab screens
  data/          Curated mod catalog, device presets, JVM arg presets
  lib/           API client, upload, zip builder, native-save helpers
  store/         Zustand stores (app settings, role/auth, site config)
worker/
  src/index.ts   REST API routes (auth, packs, texture packs, uploads)
  src/auth.ts    Device tokens, roles, access codes
  src/github.ts  GitHub Releases upload proxy
  schema.sql     D1 database schema
android/         Capacitor Android project (generated + committed)
assets/          Source icon/splash artwork for capacitor-assets
```

## Getting started (web/dev)

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if you're running your own backend
npm run dev
```

The app runs fully client-side without a backend — only the Packs Hub tab needs `VITE_API_BASE_URL` pointed at a deployed worker (see below). Leaving it unset simply disables that tab.

## Backend architecture

Packs Hub is powered by a small Cloudflare Worker + D1 database, chosen because it runs entirely on Cloudflare's free tier with no credit card required:

1. **Auth** — on first launch, the app generates a random device ID and registers it with the worker (`POST /api/register`), which issues an HMAC-signed token. There are no passwords or emails; access to publish/edit packs is granted via short-lived redeemable codes tied to a device.
2. **Uploads** — `.zip` and image uploads go to `POST /api/upload`, which streams the file to a private GitHub Releases asset (used purely as free CDN storage) and returns a public download URL.
3. **Catalog** — `GET/POST /api/modpacks` and `/api/texturepacks` read/write pack metadata (name, description, size, download URL) in D1.

To deploy your own backend:

```bash
cd worker
npm install
npx wrangler d1 execute optivault --file=schema.sql --remote
npx wrangler secret put AUTH_SECRET
npx wrangler secret put OWNER_SETUP_CODE
npx wrangler secret put GITHUB_TOKEN     # fine-grained PAT with Contents: write on a releases repo
npx wrangler secret put GITHUB_REPO      # e.g. yourname/optivault-storage
npx wrangler deploy
```

Then point the app at it via `VITE_API_BASE_URL=https://<your-worker>.workers.dev` in `.env`.

The first person to redeem `OWNER_SETUP_CODE` inside the app becomes the project owner and can grant publish access to other devices.

## Building the Android APK

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug     # output: android/app/build/outputs/apk/debug/app-debug.apk
```

App icons and splash screens are generated from the source art in `assets/` via [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets):

```bash
npx capacitor-assets generate --android
```

## Installing the APK

Grab the latest build from the [Releases page](../../releases/latest), enable "Install unknown apps" for your file manager/browser on Android, and install it like any sideloaded APK. Built for use alongside [PojavLauncher](https://pojavlauncherteam.github.io/) — OptiVault doesn't launch Minecraft itself, it prepares your mods and settings for it.

## License

No license has been specified yet — all rights reserved by the author unless stated otherwise.
