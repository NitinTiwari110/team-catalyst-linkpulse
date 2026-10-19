"use client";

import { useState } from "react";
import { Link2, Sparkles, Copy, Check, ArrowRight, AlertCircle, ExternalLink, SlidersHorizontal } from "lucide-react";
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
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-6 shadow-xl backdrop-blur-sm card-hover-lift">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-brand-blue transition-colors">
                <Link2 className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste long link (e.g. https://innovista2026.org/guidelines)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-brand-navy placeholder:text-slate-400 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:outline-none transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-tactile inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/20 hover:shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
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
              className="inline-flex items-center gap-1.5 font-medium text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{showAdvanced ? "Hide options" : "Custom back-half alias"}</span>
            </button>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Sub-40ms Telemetry
            </span>
          </div>

          {showAdvanced && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 text-left">
                Custom Back-half Vanity Alias
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm focus-within:bg-white focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/10 transition-all">
                <span className="text-slate-400 text-xs font-mono select-none mr-1.5">linkpulse.io/</span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="innovista-demo"
                  className="w-full bg-transparent text-xs font-semibold text-brand-navy focus:outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50/80 border border-red-200 p-3 text-xs text-red-700 text-left animate-scale-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Success Card with Spring Animation */}
        {createdLink && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-left animate-scale-in shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Short Link Ready
              </span>
              <span className="text-[11px] text-emerald-700/80 font-medium">Synced with Backend</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-white p-3.5 shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-brand-blue truncate">
                    {createdLink.shortUrl}
                  </span>
                  <a
                    href={createdLink.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-brand-navy transition-colors"
                    title="Test original destination"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5 max-w-sm font-mono">
                  {createdLink.originalUrl}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-tactile inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-slate-50 shadow-sm"
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
                  className="btn-tactile inline-flex items-center gap-1 rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light shadow-sm"
                >
                  <span>Dashboard</span>
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