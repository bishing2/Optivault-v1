import type { CuratedMod } from "../types";

export const MOD_CATEGORIES: { id: CuratedMod["category"]; label: string }[] = [
  { id: "fps", label: "FPS Boosters" },
  { id: "stability", label: "Stability & Memory" },
  { id: "survival", label: "Survival & QoL" },
  { id: "pvp", label: "PvP & Latency" },
  { id: "shaders", label: "Shaders & Visuals" },
  { id: "controls", label: "Controls & Touch" },
];

export const CURATED_MODS: CuratedMod[] = [
  // FPS Boosters
  m("sodium", "Sodium", "jellysquid3 / IMS212", "Modern rendering engine replacement that dramatically boosts frame rates, reduces micro-stutters.", "Essential for mobile. On PojavLauncher, gives +150% to +300% FPS boost. Works with VirGL, Zink & GL4ES.", "fps", true, "38.5M", "#f97316"),
  m("lithium", "Lithium", "jellysquid3", "General-purpose optimization mod that improves physics, mob AI, chunk ticking, and world logic.", "Crucial for mobile CPUs! Significantly reduces single-thread CPU load and battery drain during long sessions.", "fps", true, "31.2M", "#a855f7"),
  m("immediatelyfast", "ImmediatelyFast", "RaphiMC", "Speeds up immediate mode rendering in menus, text, HUD, particle effects, maps, and entity rendering.", "Huge FPS win when opening large chests, inventory screens, or busy multiplayer servers.", "fps", true, "14.2M", "#22d3ee"),
  m("indium", "Indium", "comp500", "Restores the Fabric Rendering API on top of Sodium so compatible mods keep working.", "Required if you queue any mod that depends on the Fabric Rendering API alongside Sodium.", "fps", false, "9.8M", "#38bdf8"),
  m("entityculling", "EntityCulling", "tr7zw", "Skips rendering entities that are fully hidden behind blocks or outside the view frustum.", "Big FPS win in caves and crowded builds — stops wasting draw calls on things you can't see.", "fps", false, "12.6M", "#fb7185"),
  m("dynamic-fps", "Dynamic FPS", "juliand665", "Reduces frame rate and tick workload automatically when PojavLauncher is minimized or backgrounded.", "Saves battery and reduces heat when you alt-tab to Discord or another app mid-session.", "fps", false, "6.4M", "#facc15"),
  m("sodium-extra", "Sodium Extra", "FlashyReese", "Adds extra graphics and HUD toggles on top of Sodium's options screen.", "Lets you disable expensive effects (clouds, fog, biome blend) individually to squeeze out more FPS.", "fps", false, "4.1M", "#f97316"),
  m("reeses-sodium-options", "Reese's Sodium Options", "FlashyReese", "Touch-friendlier redesign of the Sodium video settings screen.", "Bigger buttons and cleaner layout — much easier to tap through settings on a phone screen.", "fps", false, "3.7M", "#f97316"),
  m("noisium", "Noisium", "Steveplays28", "Optimizes world generation noise calculations without changing terrain output.", "Speeds up chunk generation when exploring new terrain — less stutter on weaker chipsets.", "fps", false, "2.9M", "#84cc16"),
  m("starlight", "Starlight", "SpottedLeaf", "Rewrites Minecraft's lighting engine for dramatically faster light updates.", "Fixes lighting-related lag spikes when placing/breaking blocks or loading new chunks.", "fps", false, "5.6M", "#eab308"),

  // Stability & Memory
  m("ferrite-core", "FerriteCore", "malte0811", "Reduces Minecraft's memory usage by restructuring internal data storage.", "Lets low-RAM devices (6-8GB total) allocate less to Pojav while staying stable.", "stability", false, "9.3M", "#60a5fa"),
  m("krypton", "Krypton", "astei", "Optimizes the netty networking stack for faster, lighter connections.", "Reduces micro-lag on mobile data / weak Wi-Fi when playing on multiplayer servers.", "stability", false, "5.1M", "#34d399"),
  m("modernfix", "ModernFix", "embeddedt", "Bundle of startup-time, memory, and bug-fix optimizations.", "Cuts PojavLauncher cold-start time significantly — great for devices with slow storage.", "stability", false, "8.8M", "#818cf8"),
  m("lazydfu", "LazyDFU", "astei", "Defers Minecraft's DataFixerUpper initialization so it loads lazily instead of at boot.", "Shaves several seconds off every launch — most noticeable on budget chipsets.", "stability", false, "10.4M", "#f472b6"),
  m("memoryleakfix", "MemoryLeakFix", "Sollace", "Patches several vanilla memory leaks that build up over long play sessions.", "Prevents the slow FPS decay you'd otherwise see after playing for an hour+ on mobile.", "stability", false, "2.2M", "#f87171"),
  m("fabric-api", "Fabric API", "FabricMC", "Core library most Fabric mods require to function.", "Hard dependency — auto-queued whenever another mod needs it.", "stability", true, "420M", "#38bdf8"),
  m("cloth-config", "Cloth Config API", "shedaniel", "Shared configuration-screen library used by many popular mods.", "Hard dependency for several QoL and visual mods in this list.", "stability", true, "62M", "#a78bfa"),
  m("debugify", "Debugify", "Luligabi", "Fixes dozens of small long-standing vanilla bugs without changing gameplay.", "Polish pass that quietly removes annoying vanilla jank on any device.", "stability", false, "3.4M", "#4ade80"),

  // Survival & QoL
  m("appleskin", "AppleSkin", "squeek502", "Shows exact hunger/saturation values and food exhaustion in the HUD.", "Small HUD footprint — ideal for cramped mobile screen real estate.", "survival", false, "23.1M", "#fb923c"),
  m("xaeros-minimap", "Xaero's Minimap", "xaero96", "Adds a configurable minimap with waypoints and entity radar.", "Touch-friendly waypoint menu — tap to set/teleport markers instead of typing commands.", "survival", false, "45.6M", "#4ade80"),
  m("xaeros-world-map", "Xaero's World Map", "xaero96", "Full-screen world map companion to Xaero's Minimap.", "Pinch-to-zoom map screen designed for touchscreens.", "survival", false, "29.8M", "#4ade80"),
  m("jei", "Just Enough Items", "mezz", "In-game recipe and item lookup book.", "Tap-to-search crafting recipes without alt-tabbing to a wiki on your phone.", "survival", false, "62.3M", "#facc15"),
  m("rei", "Roughly Enough Items", "shedaniel", "Alternative recipe viewer with a touch-optimized favorites bar.", "Drag-and-drop favorites bar works great with a stylus or thumb.", "survival", false, "38.9M", "#a78bfa"),
  m("bobby", "Bobby", "Johni0702", "Caches previously loaded chunks client-side to fake extended render distance.", "Lets you use a bigger render distance than weak mobile servers actually send.", "survival", false, "6.7M", "#22c55e"),
  m("waystones", "Waystones", "BlayTheNinth", "Craftable fast-travel waystones to teleport around your world.", "Cuts down on long walks — easier one-handed play during short mobile sessions.", "survival", false, "18.5M", "#c084fc"),
  m("jade", "Jade", "Snownee_", "Shows a tooltip with info about the block or entity you're looking at.", "Replaces several menu dives with a single glance — good for small screens.", "survival", false, "27.4M", "#fbbf24"),

  // PvP & Latency
  m("no-chat-reports", "No Chat Reports", "Aizistral", "Strips Mojang's chat-reporting telemetry from outgoing packets.", "Reduces background network chatter, freeing a little bandwidth on mobile data.", "pvp", false, "16.2M", "#f87171"),
  m("notenoughanimations", "Not Enough Animations", "tr7zw", "Adds smoother, more readable third-person player animations.", "Easier to read opponent movement in PvP on a small screen.", "pvp", false, "5.9M", "#fb7185"),
  m("bettercombat", "Better Combat", "Tox1cCode", "Reworks combat with weapon-specific movesets and smoother swing timing.", "Makes tap-to-attack feel more responsive with touch controls.", "pvp", false, "4.3M", "#ef4444"),
  m("attributefix", "AttributeFix", "DaFuqs", "Fixes vanilla attribute-stacking bugs that can unbalance PvP.", "Keeps combat math fair and predictable across modded servers.", "pvp", false, "2.6M", "#f97316"),

  // Shaders & Visuals
  m("iris", "Iris Shaders", "IMS212 / coderbot", "Shader pack loader compatible with Sodium for enhanced lighting and reflections.", "Use with GL4ES devices at low shader presets — full shaders are heavy on mobile GPUs.", "shaders", false, "22.9M", "#38bdf8"),
  m("continuity", "Continuity", "SpiralHalo", "Adds connected textures and emissive texture support.", "Purely visual — safe to skip first if you need to save RAM on a budget phone.", "shaders", false, "8.1M", "#0ea5e9"),
  m("particular", "Particular", "Mca", "Enhances and adds new particle effects with better performance.", "Adjustable particle density so you can dial visuals back on weaker GPUs.", "shaders", false, "1.4M", "#e879f9"),
  m("3dskinlayers", "3D Skin Layers", "tr7zw", "Renders the second skin layer (hat, sleeves) in 3D instead of flat.", "Cheap visual upgrade with almost no FPS cost — safe for every tier.", "shaders", false, "9.6M", "#f472b6"),

  // Controls & Touch
  m("mouse-tweaks", "Mouse Tweaks", "YaLTeR", "Adds click-and-drag item sorting shortcuts in inventories.", "Drag-to-move items works well with touch input on PojavLauncher's virtual mouse.", "controls", false, "24.7M", "#93c5fd"),
  m("zoomify", "Zoomify", "FlashyReese", "Adds a configurable zoom keybind, similar to OptiFine's zoom.", "Bind zoom to an on-screen button in Pojav for quick PvP or scenery scoping.", "controls", false, "7.8M", "#fca5a5"),
  m("inventory-profiles-next", "Inventory Profiles Next", "Illusive_Chase", "Smart inventory sorting profiles and quick-move rules.", "One-tap sort keeps cluttered survival inventories manageable on a small screen.", "controls", false, "5.2M", "#c4b5fd"),
  m("better-third-person", "Better Third Person", "Sollace", "Improves third-person camera positioning and collision.", "Useful for touch players who prefer third-person for spatial awareness.", "controls", false, "1.9M", "#67e8f9"),
  m("controlify", "Controlify", "isXander", "Full gamepad and touch-control remapping with on-screen prompts.", "Best-in-class for mapping actions to custom on-screen buttons in Pojav.", "controls", false, "6.5M", "#a3e635"),
  m("inventoryhud", "InventoryHUD+", "DustPuppy", "Shows nearby hotbar-adjacent inventory slots without opening the full screen.", "Fewer full-inventory opens needed — smoother on touch controls.", "controls", false, "3.1M", "#fde047"),
  m("legendary-tooltips", "Legendary Tooltips", "SuperMartijn642", "Redesigned, more readable item tooltip boxes.", "Bigger, clearer tooltip text that's easier to read on a phone display.", "controls", false, "4.6M", "#fdba74"),
];

function m(
  slug: string,
  name: string,
  author: string,
  description: string,
  mobileTip: string,
  category: CuratedMod["category"],
  essential: boolean,
  downloads: string,
  iconColor: string,
): CuratedMod {
  return { id: slug, slug, name, author, description, mobileTip, category, essential, downloads, iconColor };
}
