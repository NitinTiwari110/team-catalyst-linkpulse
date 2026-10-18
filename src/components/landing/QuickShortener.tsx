"use client";

import { useState } from "react";
import { Link2, Sparkles, Copy, Check, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";
import { createLink } from "@/lib/api/links";
import { copyToClipboard } from "@/lib/utils";
import { LinkItem } from "@/types";
import Link from "next/link";

export default function QuickShortener() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanUrl = url.trim();
    if (!cleanUrl) {
      setError("Please paste or type a valid URL.");
      return;
    }

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setLoading(true);
    try {
      const result = await createLink({
        originalUrl: cleanUrl,
        customAlias: alias.trim() ? alias.trim() : undefined,
        title: "Quick Link",
        tags: ["Landing Page"],
      });

      setCreatedLink(result);
      setUrl("");
      setAlias("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while shortening your URL.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    const ok = await copyToClipboard(createdLink.shortUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Link2 className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste long link (e.g. https://innovista2026.org/guidelines)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:bg-white focus:border-brand-blue focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue-hover disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Shorten Link</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle for Custom Alias */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="font-medium text-brand-blue hover:underline"
            >
              {showAdvanced ? "— Hide options" : "+ Add custom alias"}
            </button>
            <span>Instant redirect • High telemetry</span>
          </div>

          {showAdvanced && (
            <div className="pt-2 animate-in fade-in duration-200">
              <label className="block text-xs font-medium text-slate-600 mb-1 text-left">
                Custom Back-half Alias (optional)
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm">
                <span className="text-slate-400 text-xs font-mono mr-1">linkpulse.io/</span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="innovista-demo"
                  className="w-full bg-transparent text-xs font-medium text-brand-navy focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Success Card */}
        {createdLink && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-left animate-in fade-in-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Short Link Ready
              </span>
              <span className="text-[11px] text-slate-500">Saved to Local Dashboard</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-200/80 bg-white p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-brand-blue truncate">
                    {createdLink.shortUrl}
                  </span>
                  <a
                    href={createdLink.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-600"
                    title="Test original destination"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5 max-w-sm">
                  {createdLink.originalUrl}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-slate-50 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light transition"
                >
                  <span>View in Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}