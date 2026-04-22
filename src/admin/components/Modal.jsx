import { X } from "lucide-react";

export default function Modal({ isOpen, title, description, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#101f4d] to-[#0a1434] shadow-[0_40px_80px_rgba(1,4,20,0.65)]">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-300/85">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200 transition hover:bg-white/[0.12] hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
