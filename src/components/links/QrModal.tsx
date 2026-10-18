"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download, ExternalLink, QrCode } from "lucide-react";
import { LinkItem } from "@/types";

interface QrModalProps {
  link: LinkItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QrModal({ link, isOpen, onClose }: QrModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !link) return null;

  const downloadQrCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `linkpulse-qr-${link.shortCode}.png`;
    anchor.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-subtle text-brand-blue mb-3">
          <QrCode className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-brand-navy">Scannable QR Code</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Scan to test the live redirect destination
        </p>

        {/* QR Code Canvas */}
        <div 
          ref={qrRef} 
          className="my-5 flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner"
        >
          <QRCodeCanvas
            value={link.shortUrl}
            size={180}
            bgColor={"#ffffff"}
            fgColor={"#0F172A"}
            level={"H"}
            includeMargin={true}
          />
        </div>

        {/* Short Code & Info */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs">
          <p className="font-mono font-bold text-brand-blue truncate">{link.shortUrl}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{link.originalUrl}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadQrCode}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy-light transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </button>

          <a
            href={link.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-brand-navy hover:bg-slate-50 transition shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Test URL</span>
          </a>
        </div>
      </div>
    </div>
  );
}