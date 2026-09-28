import { useState } from "react";
import { Header } from "./components/layout/Header";
import { BottomNav, type Tab } from "./components/layout/BottomNav";
import { StickyQueueButton } from "./components/mods/StickyQueueButton";
import { DeviceJvmTab } from "./pages/DeviceJvmTab";
import { ModsTab } from "./pages/ModsTab";

function App() {
  const [tab, setTab] = useState<Tab>("device");

  return (
    <div className="flex h-dvh flex-col bg-[var(--color-bg)]">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto">
        {tab === "device" ? <DeviceJvmTab /> : <ModsTab />}
      </main>
      <StickyQueueButton />
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
