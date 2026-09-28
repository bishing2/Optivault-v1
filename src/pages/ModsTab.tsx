import { ModpackBrowser } from "../components/mods/ModpackBrowser";

export function ModsTab() {
  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <ModpackBrowser />
    </div>
  );
}
