import { X } from "lucide-react";

export default function Modal({ isOpen, title, description, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2f1f15]/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e7d5c3] bg-[#fffaf4] shadow-[0_30px_70px_rgba(76,54,36,0.22)]">
        <div className="flex items-start justify-between gap-3 border-b border-[#efdfd0] px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-[#3E2723]">{title}</h3>
            {description && <p className="mt-1 text-sm text-[#8B6F47]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7d5c3] bg-white text-[#6F4E37] transition hover:bg-[#f8eee3]"
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
