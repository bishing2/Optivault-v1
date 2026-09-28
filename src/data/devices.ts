import type { DevicePreset } from "../types";

const ZINK = "zink-turnip" as const;
const GL4ES = "gl4es-virgl" as const;

// id, name, brand, chipset, gpu, ramGB, tier, renderer, recRamMB, minRamMB, maxRamMB, resolutionScaler, sustainedPerf
export const DEVICES: DevicePreset[] = [
  // iQOO
  d("iqoo-13", "iQOO 13 / 12 / 12 Pro", "iQOO", "Qualcomm Snapdragon 8 Elite / 8 Gen 3", "Adreno (Adreno 830 / 750)", 16, "flagship", ZINK, 6200, 1500, 13000, 100, true),
  d("iqoo-neo9", "iQOO Neo 9 Pro / Neo 7 Pro", "iQOO", "Qualcomm Snapdragon 8 Gen 2 / 8+ Gen 1", "Adreno", 12, "flagship", ZINK, 5200, 1500, 9500, 95, true),
  d("iqoo-z9", "iQOO Z9 / Z7 Pro", "iQOO", "Qualcomm Snapdragon 7 Gen 3 / 778G", "Adreno", 8, "upper-mid", ZINK, 3800, 1200, 6200, 80, true),

  // Vivo
  d("vivo-x100", "Vivo X100 / X100 Pro / X200 Pro", "Vivo", "MediaTek Dimensity 9300 / 9400", "Mali", 16, "flagship", GL4ES, 5800, 1500, 13000, 90, true),
  d("vivo-v40", "Vivo V40 Pro / V30 Pro 5G", "Vivo", "MediaTek Dimensity 9200+ / 8200", "Mali", 12, "upper-mid", GL4ES, 4600, 1500, 9500, 82, true),
  d("vivo-t3", "Vivo T3 / T3 Pro 5G / T3x", "Vivo", "Qualcomm Snapdragon 7 Gen 3 / Dimensity 7200", "Adreno / Mali", 8, "upper-mid", ZINK, 3800, 1200, 6200, 80, true),
  d("vivo-u20", "Vivo U20 / U10 / Z1 Pro / Z1x", "Vivo", "Qualcomm Snapdragon 675 AIE / 665 (Octa-Core)", "Adreno 612", 6, "budget", GL4ES, 2800, 1000, 4200, 62, false),
  d("vivo-y200", "Vivo Y200 / Y200e / Y200 Pro 5G / Y100", "Vivo", "Qualcomm Snapdragon 4 Gen 2 / Snapdragon 695", "Adreno", 8, "mid", ZINK, 3600, 1200, 6200, 72, true),
  d("vivo-v29", "Vivo V29 5G / V27 5G / V25 Pro", "Vivo", "Qualcomm Snapdragon 778G / MediaTek Dimensity", "Adreno / Mali", 8, "upper-mid", ZINK, 4200, 1200, 6200, 80, true),

  // OnePlus
  d("op-13", "OnePlus 13 / 12 / 12R", "OnePlus", "Qualcomm Snapdragon 8 Elite / 8 Gen 3", "Adreno (Adreno 830 / 750)", 16, "flagship", ZINK, 6200, 1500, 13000, 100, true),
  d("op-12r", "OnePlus 12R / 11R", "OnePlus", "Qualcomm Snapdragon 8 Gen 2 / 8 Gen 1", "Adreno", 16, "flagship", ZINK, 5800, 1500, 13000, 95, true),
  d("op-nord4", "OnePlus Nord 4 / Nord CE4", "OnePlus", "Snapdragon 7+ Gen 3 / Snapdragon 695", "Adreno", 8, "upper-mid", ZINK, 3800, 1200, 6200, 80, true),

  // Samsung
  d("sam-s25u", "Galaxy S25 Ultra / S24 Ultra", "Samsung", "Snapdragon 8 Elite for Galaxy / 8 Gen 3", "Adreno 830 / 750", 12, "flagship", ZINK, 5200, 1500, 9500, 92, true),
  d("sam-a55", "Galaxy A55 / A54 5G", "Samsung", "Exynos 1480 / 1380", "Mali", 8, "mid", GL4ES, 3600, 1200, 6200, 72, true),
  d("sam-m15", "Galaxy M15 / M14 5G", "Samsung", "MediaTek Dimensity 6100+ / Snapdragon 4 Gen 1", "Mali / Adreno", 6, "budget", GL4ES, 2600, 1000, 4200, 60, false),

  // ASUS ROG
  d("rog-9", "ROG Phone 9 Pro / ROG Phone 9", "ASUS ROG", "Qualcomm Snapdragon 8 Elite", "Adreno 830", 16, "flagship", ZINK, 6800, 1500, 13000, 100, true),
  d("rog-8", "ROG Phone 8 / 8 Pro", "ASUS ROG", "Qualcomm Snapdragon 8 Gen 3", "Adreno 750", 16, "flagship", ZINK, 6600, 1500, 13000, 100, true),
  d("zen-11u", "Zenfone 11 Ultra", "ASUS ROG", "Qualcomm Snapdragon 8 Gen 3", "Adreno 750", 12, "flagship", ZINK, 5400, 1500, 9500, 95, true),

  // Redmi
  d("redmi-note14p", "Redmi Note 14 Pro+ 5G / Note 13 Pro+", "Redmi", "MediaTek Dimensity 7300 Ultra / Snapdragon 7s Gen 2", "Mali / Adreno", 12, "upper-mid", GL4ES, 4600, 1200, 9500, 82, true),
  d("redmi-note13", "Redmi Note 13 / Note 12", "Redmi", "Snapdragon 685 / Snapdragon 4 Gen 2", "Adreno", 8, "mid", GL4ES, 3400, 1200, 6200, 70, true),
  d("redmi-13c", "Redmi 13C / 12C", "Redmi", "MediaTek Helio G85 / G36", "Mali / PowerVR", 6, "budget", GL4ES, 2400, 1000, 4200, 58, false),

  // POCO
  d("poco-f6pro", "POCO F6 Pro / F6", "POCO", "Snapdragon 8 Gen 2 / 7 Gen 3", "Adreno", 12, "flagship", ZINK, 4800, 1500, 9500, 88, true),
  d("poco-x6pro", "POCO X6 Pro / X6", "POCO", "MediaTek Dimensity 8300 Ultra / 7200 Ultra", "Mali", 12, "upper-mid", GL4ES, 4600, 1200, 9500, 82, true),
  d("poco-m6pro", "POCO M6 Pro / M6", "POCO", "MediaTek Helio G99 Ultra / G99", "Mali", 6, "budget", GL4ES, 2600, 1000, 4200, 60, false),

  // Xiaomi
  d("mi-15", "Xiaomi 15 / 14 Ultra", "Xiaomi", "Snapdragon 8 Elite / 8 Gen 3", "Adreno", 16, "flagship", ZINK, 6600, 1500, 13000, 100, true),
  d("mi-14civi", "Xiaomi 14 Civi / 13T Pro", "Xiaomi", "Snapdragon 8s Gen 3 / Dimensity 9200+", "Adreno / Mali", 12, "flagship", ZINK, 5000, 1500, 9500, 90, true),
  d("mi-13lite", "Xiaomi 13 Lite / 12 Lite", "Xiaomi", "Snapdragon 778G", "Adreno", 8, "upper-mid", ZINK, 3800, 1200, 6200, 80, true),

  // Realme
  d("realme-gt6", "Realme GT 6 / GT Neo 6", "Realme", "Snapdragon 8s Gen 3 / 8 Gen 2", "Adreno", 12, "flagship", ZINK, 5000, 1500, 9500, 90, true),
  d("realme-13pro", "Realme 13 Pro+ / 12 Pro+", "Realme", "Snapdragon 7s Gen 2 / Dimensity 7050", "Adreno / Mali", 8, "upper-mid", GL4ES, 3800, 1200, 6200, 80, true),
  d("realme-c67", "Realme C67 / C55", "Realme", "Dimensity 6100+ / Helio G88", "Mali", 6, "budget", GL4ES, 2400, 1000, 4200, 58, false),

  // Motorola
  d("moto-edge50u", "Motorola Edge 50 Ultra / 50 Pro", "Motorola", "Snapdragon 8s Gen 3 / 7 Gen 3", "Adreno", 12, "flagship", ZINK, 4800, 1500, 9500, 88, true),
  d("moto-g85", "Moto G85 / G84 5G", "Motorola", "Snapdragon 6s Gen 3 / Snapdragon 695", "Adreno", 8, "mid", GL4ES, 3200, 1200, 6200, 68, true),
  d("moto-g34", "Moto G34 / G54", "Motorola", "Snapdragon 695 / Snapdragon 680", "Adreno", 6, "budget", GL4ES, 2400, 1000, 4200, 58, false),

  // Infinix
  d("infinix-gt20", "Infinix GT 20 Pro / GT 10 Pro", "Infinix", "MediaTek Dimensity 8200", "Mali", 12, "upper-mid", GL4ES, 4400, 1200, 9500, 80, true),
  d("infinix-note40", "Infinix Note 40 Pro+ / Note 30 Pro", "Infinix", "Helio G99 Ultra / Dimensity 6080", "Mali", 8, "mid", GL4ES, 3200, 1200, 6200, 68, true),
  d("infinix-hot40i", "Infinix Hot 40i / Hot 30i", "Infinix", "Helio G88 / G37", "Mali / PowerVR", 6, "budget", GL4ES, 2200, 1000, 4200, 55, false),

  // Tecno
  d("tecno-camon30", "Tecno Camon 30 Premier / Phantom V Fold2", "Tecno", "Dimensity 9000+ / 8300", "Mali", 12, "upper-mid", GL4ES, 4600, 1200, 9500, 82, true),
  d("tecno-spark20", "Tecno Spark 20 Pro+ / Spark 20 Pro", "Tecno", "Helio G99 / Dimensity 6080", "Mali", 8, "mid", GL4ES, 3000, 1200, 6200, 65, true),
  d("tecno-pop8", "Tecno Pop 8 / Pop 7", "Tecno", "Unisoc T606 / SC9863A", "PowerVR / Mali", 4, "entry", GL4ES, 1600, 800, 2400, 48, false),

  // Oppo
  d("oppo-findx7u", "Oppo Find X7 Ultra / Find X6 Pro", "Oppo", "Snapdragon 8 Gen 3 / 8 Gen 2", "Adreno", 16, "flagship", ZINK, 6400, 1500, 13000, 98, true),
  d("oppo-reno12", "Oppo Reno 12 Pro / Reno 11 Pro", "Oppo", "Dimensity 8300 / 8200", "Mali", 12, "upper-mid", GL4ES, 4600, 1200, 9500, 82, true),
  d("oppo-a79", "Oppo A79 / A78 5G", "Oppo", "Dimensity 6020 / 700", "Mali", 8, "mid", GL4ES, 3200, 1200, 6200, 68, true),

  // Honor
  d("honor-magic7p", "Honor Magic 7 Pro / Magic 6 Pro", "Honor", "Snapdragon 8 Elite / 8 Gen 3", "Adreno", 16, "flagship", ZINK, 6400, 1500, 13000, 98, true),
  d("honor-200pro", "Honor 200 Pro / 200", "Honor", "Snapdragon 8s Gen 3 / 778G", "Adreno", 12, "upper-mid", ZINK, 4600, 1200, 9500, 82, true),
  d("honor-x9b", "Honor X9b / X8b", "Honor", "Dimensity 6020 / 700", "Mali", 8, "mid", GL4ES, 3200, 1200, 6200, 68, true),

  // Lava
  d("lava-agni3", "Lava Agni 3 / Agni 2", "Lava", "Dimensity 7050 / 6020", "Mali", 8, "mid", GL4ES, 3200, 1200, 6200, 68, true),
  d("lava-blaze", "Lava Blaze Curve 5G / Blaze 2", "Lava", "Dimensity 6020 / Unisoc T616", "Mali / PowerVR", 6, "budget", GL4ES, 2400, 1000, 4200, 58, false),

  // Google
  d("pixel-9pro", "Pixel 9 Pro / 9 Pro XL", "Google", "Google Tensor G4", "Mali / Immortalis", 16, "flagship", GL4ES, 5800, 1500, 13000, 90, true),
  d("pixel-9", "Pixel 9 / 8", "Google", "Google Tensor G4 / G3", "Mali", 12, "flagship", GL4ES, 4800, 1500, 9500, 85, true),
  d("pixel-8a", "Pixel 8a / 7a", "Google", "Google Tensor G3 / G2", "Mali", 8, "upper-mid", GL4ES, 3600, 1200, 6200, 78, true),

  // Nothing
  d("nothing-2a", "Nothing Phone 2a Plus / 2a", "Nothing", "Dimensity 7350 Pro / 7200 Pro", "Mali", 12, "upper-mid", GL4ES, 4400, 1200, 9500, 80, true),
  d("nothing-2", "Nothing Phone 2", "Nothing", "Snapdragon 8+ Gen 1", "Adreno", 12, "flagship", ZINK, 5000, 1500, 9500, 90, true),
];

function d(
  id: string,
  name: string,
  brand: string,
  chipset: string,
  gpu: string,
  ramGB: number,
  tier: DevicePreset["tier"],
  renderer: DevicePreset["renderer"],
  recommendedRamMB: number,
  minRamMB: number,
  maxRamMB: number,
  resolutionScaler: number,
  sustainedPerformance: boolean,
): DevicePreset {
  return {
    id,
    name,
    brand,
    chipset,
    gpu,
    ramGB,
    tier,
    renderer,
    recommendedRamMB,
    minRamMB,
    maxRamMB,
    resolutionScaler,
    sustainedPerformance,
  };
}

export const BRANDS = [
  "All",
  ...Array.from(new Set(DEVICES.map((dv) => dv.brand))),
];

export const RENDERER_LABEL: Record<DevicePreset["renderer"], string> = {
  "zink-turnip": "Zink (Mesa Vulkan) / Turnip Driver",
  "gl4es-virgl": "Holy GL4ES / VirGL-renderer",
};
