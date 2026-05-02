import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library/esm";
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
  const codeReaderRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("Starting camera...");
  const [cameraError, setCameraError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    let isMounted = true;
    let detector = null;

    const stopScanner = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.reset();
        } catch (err) {
          console.warn("ZXing reset failed", err);
        }
        codeReaderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const startScanner = async () => {
      setCameraError(false);
      setStatusMessage("Starting camera...");
      setErrorMessage("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(true);
        setStatusMessage("Camera access is not available in this browser.");
        setErrorMessage("Your browser does not support getUserMedia. Use latest Chrome or Edge on localhost.");
        return;
      }

      const useNativeBarcodeDetector = "BarcodeDetector" in window;
      if (!useNativeBarcodeDetector) {
        setStatusMessage("Using fallback scanner for better browser support.");
      }

      if (useNativeBarcodeDetector) {
        try {
          const supportedFormats = await window.BarcodeDetector.getSupportedFormats();
          const formats = SUPPORTED_FORMATS.filter((format) => supportedFormats.includes(format));
          detector = new window.BarcodeDetector({ formats: formats.length ? formats : undefined });
        } catch {
          detector = new window.BarcodeDetector();
        }
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

        if (useNativeBarcodeDetector && detector) {
          intervalRef.current = setInterval(async () => {
            if (!videoRef.current) return;
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
        } else {
          const codeReader = new BrowserMultiFormatReader();
          codeReaderRef.current = codeReader;

          codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
            if (result && result.getText()) {
              stopScanner();
              onDetected(result.getText());
              onClose();
            }
            if (error && !(error instanceof NotFoundException)) {
              console.warn("ZXing scanning error:", error);
            }
          });
        }
      } catch (error) {
        setCameraError(true);
        setErrorMessage(error?.message || "Unable to access the camera.");
        setStatusMessage("Camera permission denied or unavailable. Allow camera access in your browser and retry.");
        console.warn("Barcode scanner error:", error);
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [isOpen, onClose, onDetected, retryCount]);

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

          <div className="mt-3 text-center">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d9c4b3]/80 bg-white/90 px-4 py-2 text-sm font-semibold text-[#6f4e37] shadow-sm shadow-[#76533b]/10 backdrop-blur-sm">
              <Camera size={16} />
              {statusMessage}
            </p>
            {cameraError && (
              <div className="mt-4 rounded-2xl border border-[#d9c4b3] bg-[#fff8ef]/90 p-4 text-sm text-[#5e462d] shadow-sm shadow-[#a88b6a]/10">
                <p className="font-semibold text-[#4b2c09]">Camera access issue</p>
                <p className="mt-2 text-[12px] leading-5 text-[#6f4e37]">
                  {errorMessage || "Allow camera access in your browser settings, then retry."}
                </p>
                <p className="mt-3 text-[11px] text-[#5e462d]">
                  Use the lock icon in the address bar and allow Camera for this site. If you are on mobile, make sure the page is loaded from localhost.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => setRetryCount((prev) => prev + 1)}
                    className="inline-flex items-center justify-center rounded-full bg-[#d4853d] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#d4853d]/20 transition hover:bg-[#c36f28]"
                  >
                    Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-[#d4853d] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b2c09] transition hover:bg-[#fff3e2]"
                  >
                    Close Scanner
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
