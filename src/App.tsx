import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { BottomNav, type Tab } from "./components/layout/BottomNav";
import { StickyQueueButton } from "./components/mods/StickyQueueButton";
import { DeviceJvmTab } from "./pages/DeviceJvmTab";
import { ModsTab } from "./pages/ModsTab";
import { CatalogTab } from "./pages/CatalogTab";
import { useRoleStore } from "./store/useRoleStore";
import { useSiteConfigStore } from "./store/useSiteConfigStore";
import { apiEnabled } from "./lib/api";

function App() {
  const [tab, setTab] = useState<Tab>("device");
  const initRole = useRoleStore((s) => s.init);
  const loadLogo = useSiteConfigStore((s) => s.loadLogo);

  useEffect(() => {
    if (!apiEnabled) return;
    initRole();
    loadLogo();
  }, [initRole, loadLogo]);

  return (
    <div className="bg-app-glow flex h-dvh flex-col">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === "device" && <DeviceJvmTab />}
        {tab === "mods" && <ModsTab />}
        {tab === "catalog" && <CatalogTab />}
      </main>
      <StickyQueueButton />
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
