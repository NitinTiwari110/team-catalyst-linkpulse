"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import StatCards from "@/components/dashboard/StatCards";
import OverviewChart from "@/components/dashboard/OverviewChart";
import { fetchLinks } from "@/lib/api/links";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { LinkItem } from "@/types";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Tag 
} from "lucide-react";

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (err) {
      console.error("Failed to load links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const totalClicks = links.reduce((sum, item) => sum + item.clickCount, 0);
  const activeLinks = links.filter((item) => item.isActive).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time link distribution, redirection telemetry, and performance insights.
            </p>
          </div>
          <Link
            href="/links"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-slate-50 transition"
          >
            <span>Manage All Links</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 1. Stat Cards */}
        <StatCards
          totalLinks={links.length}
          totalClicks={totalClicks}
          activeLinks={activeLinks}
        />

        {/* 2. Telemetry Chart */}
        <OverviewChart />

        {/* 3. Recent Links Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Recent Links Activity</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Displaying most recent shortened links and current click health.
              </p>
            </div>
            <Link
              href="/links"
              className="text-xs font-semibold text-brand-blue hover:underline"
            >
              View Full Table →
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
              Loading link records...
            </div>
          ) : links.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No links created yet. Click &quot;Create Short Link&quot; above to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Short URL / Slug</th>
                    <th className="px-6 py-3.5">Original Destination</th>
                    <th className="px-6 py-3.5">Clicks</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Created</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {links.slice(0, 5).map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/70 transition">
                      {/* Short Link & Alias */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-brand-blue">
                            /{link.shortCode}
                          </span>
                          {link.isPasswordProtected && (
                            <span title="Password Protected">
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                            </span>
                          )}
                        </div>
                        {link.tags && link.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                            <Tag className="h-3 w-3" />
                            <span>{link.tags.join(", ")}</span>
                          </div>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="px-6 py-4 max-w-xs truncate">
                        <p className="font-medium text-brand-navy truncate">
                          {link.title || link.originalUrl}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {link.originalUrl}
                        </p>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-brand-navy">
                          {link.clickCount.toLocaleString()}
                        </span>
                        {link.clickLimit && (
                          <span className="text-[11px] text-slate-400 block">
                            limit: {link.clickLimit}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {link.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{formatDate(link.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(link.id, link.shortUrl)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                            title="Copy short link"
                          >
                            {copiedId === link.id ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-slate-400" />
                            )}
                            <span>{copiedId === link.id ? "Copied" : "Copy"}</span>
                          </button>

                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Open destination"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}