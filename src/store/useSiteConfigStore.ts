import { create } from "zustand";
import { getSiteLogoUrl } from "../lib/siteConfig";

interface SiteConfigState {
  logoUrl: string | null;
  loadLogo: () => Promise<void>;
  setLogoUrl: (url: string) => void;
}

export const useSiteConfigStore = create<SiteConfigState>((set) => ({
  logoUrl: null,
  loadLogo: async () => {
    const url = await getSiteLogoUrl();
    set({ logoUrl: url });
  },
  setLogoUrl: (url) => set({ logoUrl: url }),
}));
