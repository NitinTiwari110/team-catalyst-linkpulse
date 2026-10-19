"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { QRCodeCanvas } from "qrcode.react";
import { fetchLinks, createLink } from "@/lib/api/links";
import { LinkItem } from "@/types";
import {
  QrCode,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  Palette,
  FileDown,
} from "lucide-react";

interface ParsedRow {
  url: string;
  title?: string;
  alias?: string;
  valid: boolean;
  error?: string;
}

export default function QrAndBulkToolsPage() {
  const [activeTab, setActiveTab] = useState<"qr" | "bulk">("qr");

  // QR Studio State
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedLinkUrl, setSelectedLinkUrl] = useState("https://linkpulse.io");
  const [customQrText, setCustomQrText] = useState("");
  const [qrColor, setQrColor] = useState("#0F172A");
  const [qrSize, setQrSize] = useState(200);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Bulk CSV State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    async function initLinks() {
      try {
        const data = await fetchLinks();
        setLinks(data);
        if (data.length > 0) {
          setSelectedLinkUrl(data[0].shortUrl);
        }
      } catch (err) {
        console.error("Failed to load links for QR studio:", err);
      }
    }
    initLinks();
  }, []);

  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `linkpulse-qr-${Date.now()}.png`;
    downloadLink.click();
  };

  const downloadSampleCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "url,title,alias\n" +
      "https://github.com/team-catalyst,Team Catalyst GitHub,catalyst-hub\n" +
      "https://nextjs.org/docs,Next.js App Router Docs,next-docs\n" +
      "https://spring.io/projects/spring-boot,Spring Boot Framework,spring-guide\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "linkpulse-import-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

      const headers = lines[0].toLowerCase().split(",");
      const urlIndex = headers.findIndex((h) => h.trim() === "url");
      const titleIndex = headers.findIndex((h) => h.trim() === "title");
      const aliasIndex = headers.findIndex((h) => h.trim() === "alias");

      if (urlIndex === -1) {
        alert("Invalid CSV format. Header must contain at least 'url'.");
        return;
      }

      const rows: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const rawUrl = cols[urlIndex] || "";
        const title = titleIndex !== -1 ? cols[titleIndex] : undefined;
        const alias = aliasIndex !== -1 ? cols[aliasIndex] : undefined;

        if (!rawUrl) continue;

        let valid = true;
        let error: string | undefined = undefined;

        try {
          new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
        } catch {
          valid = false;
          error = "Invalid URL syntax";
        }

        rows.push({
          url: rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
          title,
          alias,
          valid,
          error,
        });
      }

      setParsedRows(rows);
    };

    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) return;

    setImporting(true);
    let successCount = 0;
    let failCount = 0;

    for (const row of validRows) {
      try {
        await createLink({
          originalUrl: row.url,
          title: row.title || undefined,
          customAlias: row.alias || undefined,
          tags: ["CSV Import"],
        });
        successCount++;
      } catch (err) {
        console.error("Batch item failed:", err);
        failCount++;
      }
    }

    setImporting(false);
    setImportSummary({ success: successCount, failed: failCount });
    const updated = await fetchLinks();
    setLinks(updated);
  };

  const activeQrTarget = customQrText.trim() ? customQrText.trim() : selectedLinkUrl;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              QR Studio & Bulk Ingestion
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              High-resolution vector QR generation and batch CSV ingestion pipeline.
            </p>
          </div>

          {/* Upgraded Pill Switcher */}
          <div className="inline-flex items-center rounded-xl bg-slate-200/70 p-1 self-start shadow-inner border border-slate-300/40">
            <button
              onClick={() => setActiveTab("qr")}
              className={`tab-pill flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "qr"
                  ? "bg-white text-slate-900 shadow-sm scale-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="h-3.5 w-3.5 text-blue-600" />
              <span>QR Code Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`tab-pill flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "bulk"
                  ? "bg-white text-slate-900 shadow-sm scale-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Bulk CSV Import</span>
            </button>
          </div>
        </div>

        {/* Tab 1: QR Code Studio */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
            {/* Left Controls */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-float space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">QR Code Customizer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an active shortened link or enter any custom URL.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Target Short Link
                </label>
                <select
                  value={selectedLinkUrl}
                  onChange={(e) => {
                    setSelectedLinkUrl(e.target.value);
                    setCustomQrText("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {links.map((link) => (
                    <option key={link.id} value={link.shortUrl}>
                      /{link.shortCode} — {link.title || link.originalUrl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Or Custom URL Target
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs focus-within:bg-white focus-within:border-blue-500 transition-colors">
                  <Link2 className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={customQrText}
                    onChange={(e) => setCustomQrText(e.target.value)}
                    placeholder="Override target (e.g. https://mybrand.com/promo)"
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Palette Color Presets */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
                  <Palette className="h-3.5 w-3.5 text-blue-600" />
                  Palette Accent
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { label: "Navy", hex: "#0F172A" },
                    { label: "Electric Blue", hex: "#2563EB" },
                    { label: "Cyan", hex: "#06B6D4" },
                    { label: "Emerald", hex: "#059669" },
                    { label: "Purple", hex: "#7C3AED" },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setQrColor(color.hex)}
                      className={`btn-press h-8 w-8 rounded-full transition-all ${
                        qrColor === color.hex ? "ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-md" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-900 mb-1.5">
                  <span>Canvas Resolution</span>
                  <span className="text-blue-600 font-mono font-bold">{qrSize} x {qrSize} px</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="280"
                  step="20"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Right Preview */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-float flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Render Canvas Preview
              </span>

              <div
                ref={qrCanvasRef}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner flex items-center justify-center"
              >
                <QRCodeCanvas
                  value={activeQrTarget}
                  size={qrSize}
                  bgColor="#ffffff"
                  fgColor={qrColor}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="font-mono text-xs font-bold text-slate-900 max-w-xs truncate">
                  {activeQrTarget}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">High Error Correction (Level H)</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="btn-glow mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold"
              >
                <Download className="h-4 w-4" />
                <span>Download Print PNG</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Bulk CSV Import Engine */}
        {activeTab === "bulk" && (
          <div className="space-y-6 animate-slide-up">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-float flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Batch Spreadsheet Ingestion</h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Upload a standard `.csv` file containing target destination links, titles, and custom aliases. The platform parses and validates each row client-side.
                </p>
              </div>

              <button
                type="button"
                onClick={downloadSampleCsv}
                className="btn-press inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
              >
                <FileDown className="h-3.5 w-3.5 text-blue-600" />
                <span>Download CSV Template</span>
              </button>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-blue-500 hover:bg-blue-50/10 transition-all card-float">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-xs">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Choose CSV Spreadsheet</h4>
              <p className="text-xs text-slate-500 mt-1">Columns required: url (optional: title, alias)</p>

              <label className="btn-glow mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {csvFile && (
                <p className="text-xs text-slate-600 mt-3 font-medium">
                  Selected: <span className="font-mono text-slate-900 font-bold">{csvFile.name}</span>
                </p>
              )}
            </div>

            {parsedRows.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Validation Preview ({parsedRows.length} Rows Detected)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {parsedRows.filter((r) => r.valid).length} valid rows ready for shortening.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={importing || parsedRows.filter((r) => r.valid).length === 0}
                    onClick={handleExecuteImport}
                    className="btn-glow inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    {importing ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    <span>{importing ? "Processing Batch..." : "Execute Bulk Shorten"}</span>
                  </button>
                </div>

                {importSummary && (
                  <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 animate-slide-up">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>
                        Successfully created <strong>{importSummary.success}</strong> short links!
                        {importSummary.failed > 0 && ` (${importSummary.failed} failed)`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="px-6 py-3">Destination Target</th>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Custom Alias</th>
                        <th className="px-6 py-3 text-right">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="px-6 py-3 font-mono text-slate-700 truncate max-w-xs">
                            {row.url}
                          </td>
                          <td className="px-6 py-3 text-slate-600">
                            {row.title || <span className="text-slate-300 italic">None</span>}
                          </td>
                          <td className="px-6 py-3 font-mono text-blue-600">
                            {row.alias ? `/${row.alias}` : <span className="text-slate-300 italic">Auto</span>}
                          </td>
                          <td className="px-6 py-3 text-right whitespace-nowrap">
                            {row.valid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]" title={row.error}>
                                <AlertCircle className="h-3 w-3" /> {row.error || "Invalid"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}