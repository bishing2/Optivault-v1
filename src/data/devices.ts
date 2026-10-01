import type { DevicePreset } from "../types";

const ZINK = "zink-turnip" as const;
const GL4ES = "gl4es-virgl" as const;

type Renderer = DevicePreset["renderer"];
type Tier = DevicePreset["tier"];

export interface ChipsetProfile {
  label: string;
  gpu: string;
  tier: Tier;
  renderer: Renderer;
  resolutionScaler: number;
  sustainedPerformance: boolean;
}

function chip(
  label: string,
  gpu: string,
  tier: Tier,
  renderer: Renderer,
  resolutionScaler: number,
  sustainedPerformance: boolean,
): ChipsetProfile {
  return { label, gpu, tier, renderer, resolutionScaler, sustainedPerformance };
}

// Qualcomm / MediaTek / Samsung / Google / Unisoc chipsets, mapped to a tuning profile.
export const CHIPSETS = {
  // Snapdragon flagship
  sd8elite: chip("Snapdragon 8 Elite", "Adreno 830", "flagship", ZINK, 100, true),
  sd8gen3: chip("Snapdragon 8 Gen 3", "Adreno 750", "flagship", ZINK, 100, true),
  sd8sgen3: chip("Snapdragon 8s Gen 3", "Adreno 735", "flagship", ZINK, 95, true),
  sd8gen2: chip("Snapdragon 8 Gen 2", "Adreno 740", "flagship", ZINK, 96, true),
  sd8plusgen1: chip("Snapdragon 8+ Gen 1", "Adreno 730", "flagship", ZINK, 94, true),
  sd8gen1: chip("Snapdragon 8 Gen 1", "Adreno 730", "flagship", ZINK, 90, true),
  // Snapdragon upper-mid
  sd7gen3: chip("Snapdragon 7 Gen 3", "Adreno 720", "upper-mid", ZINK, 82, true),
  sd7pgen3: chip("Snapdragon 7+ Gen 3", "Adreno 725", "upper-mid", ZINK, 85, true),
  sd7pgen2: chip("Snapdragon 7+ Gen 2", "Adreno 725", "upper-mid", ZINK, 84, true),
  sd7sgen2: chip("Snapdragon 7s Gen 2", "Adreno 710", "upper-mid", ZINK, 80, true),
  sd778g: chip("Snapdragon 778G", "Adreno 642L", "upper-mid", ZINK, 80, true),
  sd732g: chip("Snapdragon 732G", "Adreno 618", "upper-mid", ZINK, 76, true),
  // Snapdragon mid
  sd6sgen3: chip("Snapdragon 6s Gen 3", "Adreno 710", "mid", ZINK, 68, true),
  sd695: chip("Snapdragon 695", "Adreno 619", "mid", ZINK, 68, true),
  sd4gen2: chip("Snapdragon 4 Gen 2", "Adreno 613", "mid", ZINK, 72, true),
  sd4gen1: chip("Snapdragon 4 Gen 1", "Adreno 613", "mid", ZINK, 68, false),
  // Snapdragon budget/entry
  sd680: chip("Snapdragon 680", "Adreno 610", "budget", GL4ES, 60, false),
  sd675: chip("Snapdragon 675", "Adreno 612", "budget", GL4ES, 62, false),
  sd665: chip("Snapdragon 665", "Adreno 610", "budget", GL4ES, 58, false),
  sd460: chip("Snapdragon 460", "Adreno 610", "entry", GL4ES, 50, false),

  // MediaTek flagship
  dimensity9400: chip("Dimensity 9400", "Immortalis-G925 (Mali)", "flagship", GL4ES, 94, true),
  dimensity9300: chip("Dimensity 9300", "Immortalis-G720 (Mali)", "flagship", GL4ES, 90, true),
  dimensity9200plus: chip("Dimensity 9200+", "Immortalis-G715 (Mali)", "flagship", GL4ES, 88, true),
  dimensity9000plus: chip("Dimensity 9000+", "Mali-G710", "upper-mid", GL4ES, 84, true),
  // MediaTek upper-mid
  dimensity8300: chip("Dimensity 8300 Ultra", "Mali-G615", "upper-mid", GL4ES, 82, true),
  dimensity8200: chip("Dimensity 8200", "Mali-G610", "upper-mid", GL4ES, 80, true),
  dimensity7300: chip("Dimensity 7300 Ultra", "Mali-G615", "upper-mid", GL4ES, 78, true),
  dimensity7200: chip("Dimensity 7200", "Mali-G610", "upper-mid", GL4ES, 78, true),
  dimensity7050: chip("Dimensity 7050", "Mali-G68", "upper-mid", GL4ES, 76, true),
  // MediaTek mid
  dimensity6100plus: chip("Dimensity 6100+", "Mali-G57", "mid", GL4ES, 65, true),
  dimensity6080: chip("Dimensity 6080", "Mali-G57", "mid", GL4ES, 65, true),
  dimensity7020: chip("Dimensity 7020", "Mali-G57 MC3", "mid", GL4ES, 74, true),
  dimensity6020: chip("Dimensity 6020", "Mali-G57", "mid", GL4ES, 66, true),
  dimensity7350: chip("Dimensity 7350 Pro", "Mali-G610 MC4", "upper-mid", GL4ES, 80, true),
  dimensity700: chip("Dimensity 700", "Mali-G57", "mid", GL4ES, 64, false),
  // MediaTek Helio budget/entry
  heliog99: chip("Helio G99 Ultra", "Mali-G57", "budget", GL4ES, 60, false),
  heliog91: chip("Helio G91", "Mali-G76", "budget", GL4ES, 60, false),
  heliog88: chip("Helio G88", "Mali-G52", "budget", GL4ES, 58, false),
  heliog85: chip("Helio G85", "Mali-G52", "budget", GL4ES, 58, false),
  heliog37: chip("Helio G37", "PowerVR GE8320", "entry", GL4ES, 52, false),
  heliog36: chip("Helio G36", "PowerVR GE8320", "entry", GL4ES, 50, false),
  heliop35: chip("Helio P35", "PowerVR GE8320", "entry", GL4ES, 48, false),

  // Samsung Exynos
  exynos2400: chip("Exynos 2400", "Xclipse 940 (AMD RDNA3)", "flagship", GL4ES, 90, true),
  exynos1480: chip("Exynos 1480", "Mali-G68", "mid", GL4ES, 72, true),
  exynos1380: chip("Exynos 1380", "Mali-G68", "mid", GL4ES, 70, true),
  exynos1330: chip("Exynos 1330", "Mali-G68", "budget", GL4ES, 62, false),

  // Google Tensor
  tensorg4: chip("Google Tensor G4", "Mali-G715", "flagship", GL4ES, 90, true),
  tensorg3: chip("Google Tensor G3", "Mali-G715", "upper-mid", GL4ES, 84, true),
  tensorg2: chip("Google Tensor G2", "Mali-G710", "upper-mid", GL4ES, 80, true),

  // Unisoc
  unisoct616: chip("Unisoc T616", "Mali-G57", "budget", GL4ES, 55, false),
  unisoct606: chip("Unisoc T606", "PowerVR GE8320", "entry", GL4ES, 48, false),
  unisoct612: chip("Unisoc T612", "PowerVR GE8320", "entry", GL4ES, 48, false),

  // Huawei Kirin
  kirin9000s: chip("Kirin 9000S", "Maleoon 910", "flagship", GL4ES, 86, true),
  kirin710a: chip("Kirin 710A", "Mali-G51", "entry", GL4ES, 50, false),
} satisfies Record<string, ChipsetProfile>;

type ChipsetKey = keyof typeof CHIPSETS;

function d(id: string, name: string, brand: string, chipsetKey: ChipsetKey, ramVariantsGB: number[]): DevicePreset {
  const c = CHIPSETS[chipsetKey];
  return {
    id,
    name,
    brand,
    chipset: c.label,
    gpu: c.gpu,
    tier: c.tier,
    renderer: c.renderer,
    resolutionScaler: c.resolutionScaler,
    sustainedPerformance: c.sustainedPerformance,
    ramVariantsGB,
  };
}

export const DEVICES: DevicePreset[] = [
  // iQOO
  d("iqoo-13", "iQOO 13", "iQOO", "sd8elite", [12, 16]),
  d("iqoo-12", "iQOO 12 / 12 Pro", "iQOO", "sd8gen3", [12, 16]),
  d("iqoo-neo9pro", "iQOO Neo 9 Pro", "iQOO", "sd8gen3", [8, 12, 16]),
  d("iqoo-neo7pro", "iQOO Neo 7 Pro", "iQOO", "sd8plusgen1", [8, 12]),
  d("iqoo-z9", "iQOO Z9 / Z9x", "iQOO", "sd7gen3", [6, 8]),
  d("iqoo-z7pro", "iQOO Z7 Pro", "iQOO", "sd7pgen2", [8, 12]),
  d("iqoo-z6", "iQOO Z6 / Z6 Lite", "iQOO", "sd4gen1", [4, 6]),

  // Vivo
  d("vivo-x200pro", "Vivo X200 Pro / X200", "Vivo", "dimensity9400", [12, 16]),
  d("vivo-x100", "Vivo X100 / X100 Pro", "Vivo", "dimensity9300", [12, 16]),
  d("vivo-v40pro", "Vivo V40 Pro", "Vivo", "dimensity9200plus", [12, 16]),
  d("vivo-v30pro", "Vivo V30 Pro 5G", "Vivo", "dimensity8200", [8, 12]),
  d("vivo-t3", "Vivo T3 5G / T3 Pro", "Vivo", "sd7gen3", [8, 12]),
  d("vivo-t3x", "Vivo T3x 5G", "Vivo", "sd4gen2", [6, 8]),
  d("vivo-y200", "Vivo Y200 / Y200e", "Vivo", "sd4gen2", [6, 8]),
  d("vivo-y100", "Vivo Y100 5G", "Vivo", "dimensity6020", [8]),
  d("vivo-u20", "Vivo U20 / Z1 Pro", "Vivo", "sd675", [4, 6]),
  d("vivo-y17s", "Vivo Y17s / Y16", "Vivo", "heliog85", [4, 6]),

  // OnePlus
  d("op-13", "OnePlus 13", "OnePlus", "sd8elite", [12, 16]),
  d("op-12", "OnePlus 12 / 12R", "OnePlus", "sd8gen3", [12, 16]),
  d("op-11r", "OnePlus 11R", "OnePlus", "sd8gen2", [8, 16]),
  d("op-nord4", "OnePlus Nord 4", "OnePlus", "sd7pgen3", [8, 12]),
  d("op-nordce4", "OnePlus Nord CE4", "OnePlus", "sd7gen3", [8, 12]),
  d("op-nordce3", "OnePlus Nord CE3 Lite", "OnePlus", "sd695", [6, 8]),

  // Samsung
  d("sam-s25ultra", "Galaxy S25 Ultra", "Samsung", "sd8elite", [12]),
  d("sam-s24ultra", "Galaxy S24 Ultra", "Samsung", "sd8gen3", [12]),
  d("sam-s24", "Galaxy S24 / S24+", "Samsung", "sd8gen3", [8, 12]),
  d("sam-s23fe", "Galaxy S23 FE", "Samsung", "exynos2400", [8]),
  d("sam-a55", "Galaxy A55 5G", "Samsung", "exynos1480", [8, 12]),
  d("sam-a54", "Galaxy A54 5G", "Samsung", "exynos1380", [6, 8]),
  d("sam-a35", "Galaxy A35 5G", "Samsung", "exynos1380", [6, 8]),
  d("sam-a15", "Galaxy A15 / A15 5G", "Samsung", "exynos1330", [4, 6, 8]),
  d("sam-m15", "Galaxy M15 5G", "Samsung", "dimensity6100plus", [4, 6, 8]),
  d("sam-m14", "Galaxy M14 5G", "Samsung", "exynos1330", [4, 6]),
  d("sam-a05", "Galaxy A05 / A05s", "Samsung", "heliog85", [4, 6]),

  // ASUS ROG / Zenfone / Republic of Gamers
  d("rog-9pro", "ROG Phone 9 Pro / 9 Pro Edition", "ASUS ROG", "sd8elite", [16, 24]),
  d("rog-9", "ROG Phone 9", "ASUS ROG", "sd8elite", [12, 16]),
  d("rog-8pro", "ROG Phone 8 Pro", "ASUS ROG", "sd8gen3", [16, 24]),
  d("rog-8", "ROG Phone 8", "ASUS ROG", "sd8gen3", [12, 16]),
  d("zen-11ultra", "Zenfone 11 Ultra", "ASUS ROG", "sd8gen3", [12, 16]),

  // Redmi
  d("redmi-note14pro", "Redmi Note 14 Pro+ 5G", "Redmi", "dimensity7300", [8, 12]),
  d("redmi-note13pro", "Redmi Note 13 Pro+ 5G", "Redmi", "sd7sgen2", [8, 12]),
  d("redmi-note13", "Redmi Note 13 5G / Note 13", "Redmi", "sd680", [6, 8]),
  d("redmi-note12", "Redmi Note 12 / Note 12 5G", "Redmi", "sd4gen1", [4, 6, 8]),
  d("redmi-13c", "Redmi 13C / 13C 5G", "Redmi", "heliog85", [4, 6, 8]),
  d("redmi-12c", "Redmi 12C", "Redmi", "heliog36", [3, 4, 6]),
  d("redmi-a3", "Redmi A3 / A3x", "Redmi", "heliog36", [3, 4]),

  // POCO
  d("poco-f6pro", "POCO F6 Pro", "POCO", "sd8gen2", [12, 16]),
  d("poco-f6", "POCO F6", "POCO", "sd8sgen3", [8, 12]),
  d("poco-x6pro", "POCO X6 Pro", "POCO", "dimensity8300", [8, 12]),
  d("poco-x6", "POCO X6", "POCO", "sd7gen3", [8, 12]),
  d("poco-m6pro", "POCO M6 Pro", "POCO", "heliog99", [6, 8]),
  d("poco-m6", "POCO M6 5G", "POCO", "sd4gen2", [4, 6, 8]),
  d("poco-c65", "POCO C65", "POCO", "heliog85", [4, 6]),

  // Xiaomi
  d("mi-15", "Xiaomi 15", "Xiaomi", "sd8elite", [12, 16]),
  d("mi-14ultra", "Xiaomi 14 Ultra", "Xiaomi", "sd8gen3", [12, 16]),
  d("mi-14civi", "Xiaomi 14 Civi", "Xiaomi", "sd8sgen3", [12, 16]),
  d("mi-13t", "Xiaomi 13T / 13T Pro", "Xiaomi", "dimensity8200", [8, 12]),
  d("mi-13lite", "Xiaomi 13 Lite", "Xiaomi", "sd778g", [8]),

  // Realme
  d("realme-gt6", "Realme GT 6", "Realme", "sd8sgen3", [12, 16]),
  d("realme-gtneo6", "Realme GT Neo 6", "Realme", "sd8gen2", [12, 16]),
  d("realme-13pro", "Realme 13 Pro+ 5G", "Realme", "sd7sgen2", [8, 12]),
  d("realme-12pro", "Realme 12 Pro+ 5G", "Realme", "dimensity7050", [8, 12]),
  d("realme-note60x", "Realme Note 60x / C67", "Realme", "unisoct612", [4, 6]),
  d("realme-c55", "Realme C55", "Realme", "heliog88", [6, 8]),
  d("realme-c53", "Realme C53", "Realme", "unisoct612", [6, 8]),

  // Motorola
  d("moto-edge50ultra", "Motorola Edge 50 Ultra", "Motorola", "sd8sgen3", [12, 16]),
  d("moto-edge50pro", "Motorola Edge 50 Pro", "Motorola", "sd7gen3", [8, 12]),
  d("moto-edge50fusion", "Motorola Edge 50 Fusion", "Motorola", "sd7sgen2", [8, 12]),
  d("moto-g85", "Moto G85 5G", "Motorola", "sd6sgen3", [8, 12]),
  d("moto-g75", "Moto G75 5G", "Motorola", "sd695", [8, 12]),
  d("moto-g54", "Moto G54 5G", "Motorola", "dimensity7020", [8, 12]),

  // Infinix
  d("infinix-gt20pro", "Infinix GT 20 Pro", "Infinix", "dimensity8200", [8, 12]),
  d("infinix-note40pro", "Infinix Note 40 Pro+", "Infinix", "heliog99", [8, 12]),
  d("infinix-note40", "Infinix Note 40", "Infinix", "dimensity6080", [8]),
  d("infinix-hot40i", "Infinix Hot 40i", "Infinix", "heliog88", [4, 8]),
  d("infinix-smart8", "Infinix Smart 8", "Infinix", "unisoct606", [3, 4]),

  // Tecno
  d("tecno-camon30premier", "Tecno Camon 30 Premier", "Tecno", "dimensity8200", [8, 12]),
  d("tecno-phantomv2fold", "Tecno Phantom V Fold2", "Tecno", "dimensity9000plus", [12]),
  d("tecno-spark20pro", "Tecno Spark 20 Pro+", "Tecno", "heliog99", [8]),
  d("tecno-spark20", "Tecno Spark 20", "Tecno", "unisoct612", [4, 8]),
  d("tecno-pop8", "Tecno Pop 8", "Tecno", "unisoct606", [3, 4]),

  // Oppo
  d("oppo-findx8pro", "Oppo Find X8 Pro", "Oppo", "dimensity9400", [12, 16]),
  d("oppo-findx7ultra", "Oppo Find X7 Ultra", "Oppo", "sd8gen3", [12, 16]),
  d("oppo-reno12pro", "Oppo Reno 12 Pro", "Oppo", "dimensity8300", [8, 12]),
  d("oppo-reno11pro", "Oppo Reno 11 Pro", "Oppo", "dimensity8200", [8, 12]),
  d("oppo-a79", "Oppo A79 5G", "Oppo", "dimensity6020", [8]),
  d("oppo-a3x", "Oppo A3x / A18", "Oppo", "heliog36", [4, 6]),

  // Honor
  d("honor-magic7pro", "Honor Magic 7 Pro", "Honor", "sd8elite", [12, 16]),
  d("honor-magic6pro", "Honor Magic 6 Pro", "Honor", "sd8gen3", [12, 16]),
  d("honor-200pro", "Honor 200 Pro", "Honor", "sd8sgen3", [12]),
  d("honor-200", "Honor 200", "Honor", "sd778g", [8, 12]),
  d("honor-x9b", "Honor X9b", "Honor", "dimensity6020", [8, 12]),
  d("honor-x6b", "Honor X6b", "Honor", "heliog36", [4, 8]),

  // Google Pixel
  d("pixel-9pro", "Pixel 9 Pro / 9 Pro XL", "Google", "tensorg4", [16]),
  d("pixel-9", "Pixel 9", "Google", "tensorg4", [12]),
  d("pixel-8a", "Pixel 8a", "Google", "tensorg3", [8]),
  d("pixel-8", "Pixel 8 / 8 Pro", "Google", "tensorg3", [8, 12]),
  d("pixel-7a", "Pixel 7a", "Google", "tensorg2", [8]),

  // Nothing
  d("nothing-3a", "Nothing Phone 3a / 3a Pro", "Nothing", "sd7sgen2", [8, 12]),
  d("nothing-2a", "Nothing Phone 2a Plus / 2a", "Nothing", "dimensity7350", [8, 12]),
  d("nothing-2", "Nothing Phone 2", "Nothing", "sd8plusgen1", [8, 12]),

  // CMF (by Nothing)
  d("cmf-phone1", "CMF Phone 1", "CMF", "dimensity7300", [8]),

  // Lava
  d("lava-agni3", "Lava Agni 3", "Lava", "dimensity7050", [8, 12]),
  d("lava-blazecurve", "Lava Blaze Curve 5G", "Lava", "dimensity6020", [6, 8]),
  d("lava-blaze2", "Lava Blaze 2", "Lava", "unisoct612", [4, 6]),

  // Red Magic (gaming-focused — relevant for a Minecraft/mod-performance app)
  d("redmagic10pro", "Red Magic 10 Pro", "Red Magic", "sd8elite", [16, 24]),
  d("redmagic9pro", "Red Magic 9 Pro", "Red Magic", "sd8gen3", [12, 16, 24]),
  d("redmagic9s", "Red Magic 9S Pro", "Red Magic", "sd8gen3", [12, 16]),

  // Huawei
  d("huawei-mate70pro", "Huawei Mate 70 Pro", "Huawei", "kirin9000s", [12, 16]),
  d("huawei-nova12", "Huawei Nova 12", "Huawei", "kirin710a", [8, 12]),
  d("huawei-y9a", "Huawei Y9a", "Huawei", "kirin710a", [6, 8]),

  // Itel
  d("itel-s24", "Itel S24", "Itel", "unisoct612", [4, 8]),
  d("itel-a70", "Itel A70", "Itel", "unisoct606", [3, 4]),

  // Micromax
  d("micromax-in2c", "Micromax IN 2c", "Micromax", "heliog37", [3, 4]),
];

export const BRANDS = [
  "All",
  ...Array.from(new Set(DEVICES.map((dv) => dv.brand))),
];

export const RENDERER_LABEL: Record<DevicePreset["renderer"], string> = {
  "zink-turnip": "Zink (Mesa Vulkan) / Turnip Driver",
  "gl4es-virgl": "Holy GL4ES / VirGL-renderer",
};
