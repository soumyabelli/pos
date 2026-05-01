import { useEffect, useRef, useState } from "react";
import { Camera, ScanLine, X } from "lucide-react";

const SUPPORTED_FORMATS = [
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "code_128",
  "code_39",
  "itf",
  "qr_code",
];

export default function BarcodeScannerModal({ isOpen, onClose, onDetected }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("Starting camera...");

  useEffect(() => {
    if (!isOpen) return undefined;

    let isMounted = true;
    let detector = null;

    const stopScanner = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const startScanner = async () => {
      if (!("BarcodeDetector" in window)) {
        setStatusMessage("Barcode scan is not supported in this browser. Use latest Chrome on localhost.");
        return;
      }

      try {
        const supportedFormats = await window.BarcodeDetector.getSupportedFormats();
        const formats = SUPPORTED_FORMATS.filter((format) => supportedFormats.includes(format));
        detector = new window.BarcodeDetector({ formats: formats.length ? formats : undefined });
      } catch {
        detector = new window.BarcodeDetector();
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStatusMessage("Point camera at product barcode");

        intervalRef.current = setInterval(async () => {
          if (!videoRef.current || !detector) return;

          try {
            const barcodes = await detector.detect(videoRef.current);
            const rawValue = barcodes?.[0]?.rawValue?.trim();
            if (rawValue) {
              stopScanner();
              onDetected(rawValue);
              onClose();
            }
          } catch {
            // Ignore transient detect errors while video frames are stabilizing.
          }
        }, 250);
      } catch {
        setStatusMessage("Camera permission denied or unavailable.");
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [isOpen, onClose, onDetected]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close barcode scanner"
        className="absolute inset-0 bg-[#3E2723]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border-2 border-[#D9C4B3] bg-gradient-to-b from-[#FFFBF7] to-[#F5E6D3] shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-[#D9C4B3] bg-white/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-[#6F4E37]" />
            <h3 className="text-base font-black text-[#3E2723]">Scan Product Barcode</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#D9C4B3] bg-white text-[#8B6F47] transition hover:bg-red-50 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-[#D9C4B3] bg-black">
            <video
              ref={videoRef}
              className="h-72 w-full object-cover"
              muted
              playsInline
              autoPlay
            />
            <div className="pointer-events-none absolute inset-x-6 top-1/2 h-16 -translate-y-1/2 rounded-lg border-2 border-dashed border-[#D4853D]" />
          </div>

          <p className="mt-3 text-center text-sm font-semibold text-[#6F4E37]">
            <Camera size={16} className="mr-1 inline-block" />
            {statusMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
