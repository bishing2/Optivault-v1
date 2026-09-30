import { create } from "zustand";
import { fetchMcVersionGroups, FALLBACK_GROUPS, type McVersionGroup } from "../lib/mcVersions";

interface McVersionsState {
  groups: McVersionGroup[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  fetchIfNeeded: () => void;
}

export const useMcVersionsStore = create<McVersionsState>((set, get) => ({
  groups: FALLBACK_GROUPS,
  loading: false,
  error: null,
  loaded: false,

  fetchIfNeeded: () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });
    fetchMcVersionGroups()
      .then((groups) => set({ groups, loading: false, loaded: true }))
      .catch((err) =>
        set({
          loading: false,
          loaded: true,
          error: err instanceof Error ? err.message : "Couldn't fetch the latest version list.",
        }),
      );
  },
}));
