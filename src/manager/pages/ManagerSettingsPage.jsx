import { useState } from "react";
import { Printer, MonitorSmartphone, Archive } from "lucide-react";

export default function ManagerSettingsPage() {
  const [scannerType, setScannerType] = useState("camera");
  const [autoPrint, setAutoPrint] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  const testPrint = () => {
    alert("Test print signal sent to configured local printer.");
  };

  const openCashDrawer = () => {
    alert("Cash drawer open signal sent.");
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black text-[#3E2723]">Hardware & Settings</h1>
        <p className="mt-1 text-sm text-[#8B6F47]">Configure branch-specific hardware devices and preferences.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Hardware Integrations */}
        <div className="rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#e7d5c3] pb-4">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-[#f8eee3] text-[#D4853D]">
              <MonitorSmartphone size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#3E2723]">Device Configurations</h2>
          </div>
          
          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#3E2723]">Barcode Scanner Input</label>
              <select
                value={scannerType}
                onChange={(e) => setScannerType(e.target.value)}
                className="w-full rounded-xl border border-[#e7d5c3] bg-white px-3 py-2 text-sm text-[#3E2723] outline-none focus:border-[#D4853D] focus:ring-4 focus:ring-[#D4853D]/15"
              >
                <option value="camera">Device Camera (Built-in)</option>
                <option value="usb">USB Physical Scanner</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#3E2723]">Audio Feedback</p>
                <p className="text-xs text-[#8B6F47]">Play beep sound on successful scan</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={audioFeedback} onChange={() => setAudioFeedback(!audioFeedback)} className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#D4853D] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Printer & Drawer */}
        <div className="rounded-2xl border border-[#e7d5c3] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#e7d5c3] pb-4">
            <div className="grid h-10 w-10 place-content-center rounded-lg bg-[#f8eee3] text-[#D4853D]">
              <Printer size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#3E2723]">Printer & Cash Drawer</h2>
          </div>
          
          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#3E2723]">Auto-Print Receipts</p>
                <p className="text-xs text-[#8B6F47]">Automatically print after transaction</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={autoPrint} onChange={() => setAutoPrint(!autoPrint)} className="peer sr-only" />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#D4853D] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={testPrint} className="flex items-center justify-center gap-2 rounded-xl border border-[#D4853D] bg-white px-4 py-2 text-sm font-semibold text-[#D4853D] transition hover:bg-[#f8eee3]">
                <Printer size={16} /> Test Printer
              </button>
              <button onClick={openCashDrawer} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4853D] to-[#6F4E37] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#6f4e37]/30 transition hover:opacity-90">
                <Archive size={16} /> Open Drawer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
