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

  // QR Download Handler
  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `linkpulse-qr-${Date.now()}.png`;
    downloadLink.click();
  };

  // CSV Template Generator
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

  // CSV File Upload & Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

      // Check header
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

  // Execute Batch Creation
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
    // Refresh links
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
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
              QR Studio & Bulk Ingestion
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              High-resolution vector QR generation and batch CSV ingestion pipeline.
            </p>
          </div>

          {/* Tab Pill Switcher */}
          <div className="flex items-center rounded-xl bg-slate-200/70 p-1 self-start">
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === "qr"
                  ? "bg-white text-brand-navy shadow-sm"
                  : "text-slate-600 hover:text-brand-navy"
              }`}
            >
              <QrCode className="h-3.5 w-3.5 text-brand-blue" />
              <span>QR Code Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === "bulk"
                  ? "bg-white text-brand-navy shadow-sm"
                  : "text-slate-600 hover:text-brand-navy"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Bulk CSV Import</span>
            </button>
          </div>
        </div>

        {/* Tab 1: QR Code Studio */}
        {activeTab === "qr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
              <div>
                <h3 className="text-base font-bold text-brand-navy">QR Code Customizer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an active shortened link or enter any destination payload.
                </p>
              </div>

              {/* Source Option: Existing Link Selector */}
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                  Target Short Link
                </label>
                <div className="relative">
                  <select
                    value={selectedLinkUrl}
                    onChange={(e) => {
                      setSelectedLinkUrl(e.target.value);
                      setCustomQrText("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-brand-navy focus:bg-white focus:outline-none"
                  >
                    {links.map((link) => (
                      <option key={link.id} value={link.shortUrl}>
                        /{link.shortCode} — {link.title || link.originalUrl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Source Option: Custom Direct Target */}
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">
                  Or Custom URL Target
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs">
                  <Link2 className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={customQrText}
                    onChange={(e) => setCustomQrText(e.target.value)}
                    placeholder="Override target (e.g. https://mybrand.com/promo)"
                    className="w-full bg-transparent text-xs text-brand-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy mb-2">
                  <Palette className="h-3.5 w-3.5 text-brand-blue" />
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
                      className={`h-7 w-7 rounded-full transition-transform ${
                        qrColor === color.hex ? "ring-2 ring-brand-blue ring-offset-2 scale-110" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-brand-navy mb-1.5">
                  <span>Canvas Resolution</span>
                  <span className="text-slate-500 font-mono">{qrSize} x {qrSize} px</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="280"
                  step="20"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full accent-brand-blue cursor-pointer"
                />
              </div>
            </div>

            {/* Right Preview Column */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Render Canvas Preview
              </span>

              <div
                ref={qrCanvasRef}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-inner flex items-center justify-center"
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
                <p className="font-mono text-xs font-bold text-brand-navy max-w-xs truncate">
                  {activeQrTarget}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">High Error Correction (Level H)</p>
              </div>

              <button
                type="button"
                onClick={handleDownloadQr}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy-light shadow-sm transition"
              >
                <Download className="h-4 w-4" />
                <span>Download Print PNG</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Bulk CSV Import Engine */}
        {activeTab === "bulk" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Instructions & Template Banner */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-brand-navy">Batch Spreadsheet Ingestion</h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Upload a standard `.csv` file containing target destination links, titles, and custom aliases. The platform parses and validates each row client-side.
                </p>
              </div>

              <button
                type="button"
                onClick={downloadSampleCsv}
                className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-slate-100 transition shadow-sm"
              >
                <FileDown className="h-3.5 w-3.5 text-brand-blue" />
                <span>Download CSV Template</span>
              </button>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-brand-blue transition">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-subtle text-brand-blue mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-brand-navy">Choose CSV Spreadsheet</h4>
              <p className="text-xs text-slate-500 mt-1">Columns required: url (optional: title, alias)</p>

              <label className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-brand-blue-hover transition shadow-sm">
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
                  Selected: <span className="font-mono text-brand-navy font-bold">{csvFile.name}</span>
                </p>
              )}
            </div>

            {/* Validation & Preview Table */}
            {parsedRows.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
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
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue-hover disabled:opacity-50 transition shadow-sm"
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
                  <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
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
                          <td className="px-6 py-3 font-mono text-brand-blue">
                            {row.alias ? `/${row.alias}` : <span className="text-slate-300 italic">Auto</span>}
                          </td>
                          <td className="px-6 py-3 text-right whitespace-nowrap">
                            {row.valid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-[11px]" title={row.error}>
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