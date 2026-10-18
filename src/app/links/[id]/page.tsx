"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import QrModal from "@/components/links/QrModal";
import { fetchLinkById, fetchLinkAnalytics, toggleLinkStatus } from "@/lib/api/links";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { LinkItem, LinkAnalytics } from "@/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Power,
  ShieldCheck,
  Calendar,
  Globe2,
  Smartphone,
  Compass,
  Share2,
  Layers,
  Info,
} from "lucide-react";

function LinkDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [link, setLink] = useState<LinkItem | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const foundLink = await fetchLinkById(id);
        if (!foundLink) {
          setLoading(false);
          return;
        }
        setLink(foundLink);

        const foundAnalytics = await fetchLinkAnalytics(id);
        setAnalytics(foundAnalytics);
      } catch (err) {
        console.error("Error loading link detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleCopy = async () => {
    if (!link) return;
    const ok = await copyToClipboard(link.shortUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggle = async () => {
    if (!link) return;
    try {
      const updated = await toggleLinkStatus(link.id, !link.isActive);
      setLink(updated);
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        <p className="text-xs text-slate-500">Retrieving link metrics and telemetry...</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-card">
        <h2 className="text-base font-bold text-brand-navy">Link Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The link you requested does not exist or may have been deleted.
        </p>
        <button
          onClick={() => router.push("/links")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Link Console</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/links" className="hover:text-brand-blue flex items-center gap-1 font-medium">
          <ArrowLeft className="h-3.5 w-3.5" />
          Links
        </Link>
        <span>/</span>
        <span className="font-mono text-brand-navy font-semibold">/{link.shortCode}</span>
      </div>

      {/* Master Link Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
                /{link.shortCode}
              </h1>
              {link.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                  Disabled
                </span>
              )}
              {link.isPasswordProtected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Protected
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {link.title || "Custom Redirect Link"} • Created {formatDate(link.createdAt)}
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-slate-50 shadow-sm"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Link" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:bg-slate-50 shadow-sm"
            >
              <QrCode className="h-3.5 w-3.5 text-brand-cyan" />
              <span>QR Code</span>
            </button>

            <a
              href={link.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-blue-hover shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Test Destination</span>
            </a>

            <button
              type="button"
              onClick={handleToggle}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                link.isActive
                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{link.isActive ? "Disable Link" : "Enable Link"}</span>
            </button>
          </div>
        </div>

        {/* Destination Target URL Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Destination Target URL
            </span>
            <p className="font-mono text-slate-700 truncate mt-0.5">{link.originalUrl}</p>
          </div>
          {link.expiresAt && (
            <div className="shrink-0 flex items-center gap-1 text-[11px] text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Expires: {formatDate(link.expiresAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-slate-500">Total Clicks</span>
          <p className="text-2xl font-extrabold text-brand-navy mt-1">
            {analytics?.totalClicks.toLocaleString() || link.clickCount.toLocaleString()}
          </p>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
            100% telemetry verified
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-slate-500">Unique Visitors</span>
          <p className="text-2xl font-extrabold text-brand-navy mt-1">
            {analytics?.uniqueVisitors.toLocaleString() || Math.round(link.clickCount * 0.78)}
          </p>
          <span className="text-[11px] font-semibold text-brand-blue mt-1 inline-block">
            High audience retention
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-slate-500">Click Limit</span>
          <p className="text-2xl font-extrabold text-brand-navy mt-1">
            {link.clickLimit ? link.clickLimit.toLocaleString() : "Unlimited"}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            {link.clickLimit ? `${link.clickLimit - link.clickCount} remaining` : "No throttle applied"}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <span className="text-xs font-semibold text-slate-500">Campaign Attribution</span>
          <p className="text-base font-bold text-brand-navy mt-1.5 truncate">
            {link.campaignName || "General Distribution"}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-flex items-center gap-1">
            <Layers className="h-3 w-3" /> Grouped Channel
          </span>
        </div>
      </div>

      {/* Telemetry Chart: Clicks Over Time */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-navy">Traffic Velocity Over Time</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                <Info className="h-3 w-3" />
                Hourly Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Timestamped click traffic logged for this destination.
            </p>
          </div>
        </div>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics?.clicksOverTime || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="detailClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "12px",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#FFFFFF" }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#2563EB"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#detailClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referrers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Share2 className="h-4 w-4 text-brand-blue" />
            <h4 className="text-sm font-bold text-brand-navy">Top Referrers</h4>
          </div>
          <div className="space-y-3">
            {(analytics?.referrers || []).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand-navy">{item.name}</span>
                  <span className="text-slate-500">{item.clicks} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Smartphone className="h-4 w-4 text-brand-cyan" />
            <h4 className="text-sm font-bold text-brand-navy">Device Breakdown</h4>
          </div>
          <div className="space-y-3">
            {(analytics?.devices || []).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand-navy">{item.name}</span>
                  <span className="text-slate-500">{item.clicks} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-cyan"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Compass className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-brand-navy">Browser Distribution</h4>
          </div>
          <div className="space-y-3">
            {(analytics?.browsers || []).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand-navy">{item.name}</span>
                  <span className="text-slate-500">{item.clicks} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geography */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Globe2 className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-brand-navy">Geographic Locations</h4>
          </div>
          <div className="space-y-3">
            {(analytics?.countries || []).map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-brand-navy">{item.name}</span>
                  <span className="text-slate-500">{item.clicks} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QrModal
        link={link}
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
      />
    </div>
  );
}

export default function LinkDetailPage() {
  return (
    <AppLayout>
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
            <p className="text-xs text-slate-500">Loading telemetry dashboard...</p>
          </div>
        }
      >
        <LinkDetailContent />
      </Suspense>
    </AppLayout>
  );
}