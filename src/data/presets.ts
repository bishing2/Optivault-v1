export interface ModpackPreset {
  id: string;
  label: string;
  icon: string;
  color: "good" | "accent" | "warn" | "danger";
  modIds: string[];
}

export const MODPACK_PRESETS: ModpackPreset[] = [
  {
    id: "mobile-60fps",
    label: "Mobile 60FPS Boost",
    icon: "bolt",
    color: "good",
    modIds: [
      "sodium",
      "lithium",
      "immediatelyfast",
      "indium",
      "entityculling",
      "ferrite-core",
      "lazydfu",
      "fabric-api",
    ],
  },
  {
    id: "ultra-fps",
    label: "Ultra FPS",
    icon: "bolt",
    color: "accent",
    modIds: [
      "sodium",
      "lithium",
      "immediatelyfast",
      "indium",
      "entityculling",
      "sodium-extra",
      "reeses-sodium-options",
      "noisium",
      "starlight",
      "dynamic-fps",
      "fabric-api",
    ],
  },
  {
    id: "survival-qol",
    label: "Survival & QoL",
    icon: "globe",
    color: "accent",
    modIds: [
      "sodium",
      "lithium",
      "fabric-api",
      "cloth-config",
      "appleskin",
      "xaeros-minimap",
      "xaeros-world-map",
      "jei",
      "waystones",
      "jade",
    ],
  },
  {
    id: "pvp-fast",
    label: "PvP Fast",
    icon: "cross",
    color: "danger",
    modIds: [
      "sodium",
      "lithium",
      "immediatelyfast",
      "krypton",
      "no-chat-reports",
      "notenoughanimations",
      "bettercombat",
      "attributefix",
      "fabric-api",
    ],
  },
  {
    id: "shaders",
    label: "Shaders",
    icon: "sparkles",
    color: "accent",
    modIds: [
      "sodium",
      "lithium",
      "indium",
      "iris",
      "continuity",
      "3dskinlayers",
      "fabric-api",
    ],
  },
];
