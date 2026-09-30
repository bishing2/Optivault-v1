import { JvmArgsPanel } from "../components/device/JvmArgsPanel";
import { DevicePresetPicker } from "../components/device/DevicePresetPicker";

export function DeviceJvmTab() {
  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <DevicePresetPicker />
      <JvmArgsPanel />
    </div>
  );
}
