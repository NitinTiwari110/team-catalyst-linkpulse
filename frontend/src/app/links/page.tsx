"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import QrModal from "@/components/links/QrModal";
import EditLinkModal from "@/components/links/EditLinkModal";
import { fetchLinks, deleteLink, toggleLinkStatus } from "@/lib/api/links";
import { copyToClipboard, formatDate } from "@/lib/utils";
import { LinkItem } from "@/types";
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Edit2,
  Trash2,
  BarChart3,
  Power,
  ShieldCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled" | "protected">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedQrLink, setSelectedQrLink] = useState<LinkItem | null>(null);
  const [selectedEditLink, setSelectedEditLink] = useState<LinkItem | null>(null);

  const loadLinks = async () => {
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
    loadLinks();
  }, []);

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggle = async (link: LinkItem) => {
    try {
      const updated = await toggleLinkStatus(link.id, !link.isActive);
      setLinks((prev) => prev.map((l) => (l.id === link.id ? updated : l)));
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const handleDelete = async (id: string, shortCode: string) => {
    if (window.confirm(`Are you sure you want to delete /${shortCode}? This will permanently remove the redirect.`)) {
      try {
        await deleteLink(id);
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      if (statusFilter === "active" && !link.isActive) return false;
      if (statusFilter === "disabled" && link.isActive) return false;
      if (statusFilter === "protected" && !link.isPasswordProtected) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const inShort = link.shortCode.toLowerCase().includes(q);
      const inOriginal = link.originalUrl.toLowerCase().includes(q);
      const inTitle = (link.title || "").toLowerCase().includes(q);
      const inTags = link.tags && link.tags.some((t) => t.toLowerCase().includes(q));

      return inShort || inOriginal || inTitle || inTags;
    });
  }, [links, statusFilter, search]);

  const totalPages = Math.ceil(filteredLinks.length / pageSize) || 1;
  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLinks.slice(start, start + pageSize);
  }, [filteredLinks, currentPage]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Link Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure URLs, monitor live status, generate QR codes, and view click telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 shadow-xs">
              {filteredLinks.length} total links
            </span>
          </div>
        </div>

        {/* Controls Bar: Search & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm card-float">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by slug, destination URL, or tag..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Pills with Smooth Transitions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline-flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            <button
              onClick={() => { setStatusFilter("all"); setCurrentPage(1); }}
              className={`tab-pill rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              All ({links.length})
            </button>
            <button
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={`tab-pill rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Active ({links.filter((l) => l.isActive).length})
            </button>
            <button
              onClick={() => { setStatusFilter("disabled"); setCurrentPage(1); }}
              className={`tab-pill rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "disabled"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Disabled ({links.filter((l) => !l.isActive).length})
            </button>
            <button
              onClick={() => { setStatusFilter("protected"); setCurrentPage(1); }}
              className={`tab-pill rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "protected"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Protected ({links.filter((l) => l.isPasswordProtected).length})
            </button>
          </div>
        </div>

        {/* Master Links Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm card-float overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Loading links catalog...
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm font-bold text-slate-900">No links match your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filter pills.</p>
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); }}
                className="mt-4 btn-press rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Short Code / Tag</th>
                    <th className="px-6 py-4">Destination Target</th>
                    <th className="px-6 py-4">Click Health</th>
                    <th className="px-6 py-4">Status & Switch</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-blue-50/40 transition-colors group">
                      {/* Short Link */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 text-sm group-hover:text-blue-700">
                            /{link.shortCode}
                          </span>
                          {link.isPasswordProtected && (
                            <span title="Password Protected">
                              <ShieldCheck className="h-4 w-4 text-amber-500" />
                            </span>
                          )}
                        </div>
                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {link.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Destination Target */}
                      <td className="px-6 py-4 max-w-sm truncate">
                        <p className="font-semibold text-slate-900 truncate">
                          {link.title || link.originalUrl}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {link.originalUrl}
                        </p>
                      </td>

                      {/* Click Health */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {link.clickCount.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1">clicks</span>
                        {link.clickLimit && (
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                            Limit: {link.clickLimit} max
                          </p>
                        )}
                      </td>

                      {/* Status & Killswitch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggle(link)}
                          title={link.isActive ? "Click to disable link" : "Click to activate link"}
                          className={`btn-press inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border transition ${
                            link.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <Power className="h-3 w-3" />
                          <span>{link.isActive ? "Active" : "Disabled"}</span>
                        </button>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {formatDate(link.createdAt)}
                      </td>

                      {/* Actions Toolbar */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link */}
                          <button
                            type="button"
                            onClick={() => handleCopy(link.id, link.shortUrl)}
                            className="btn-press rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            title="Copy Short URL"
                          >
                            {copiedId === link.id ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>

                          {/* Open Target */}
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-press rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            title="Open Destination"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>

                          {/* QR Code */}
                          <button
                            type="button"
                            onClick={() => setSelectedQrLink(link)}
                            className="btn-press rounded-lg p-1.5 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600"
                            title="Generate QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>

                          {/* Analytics Detail Route */}
                          <Link
                            href={`/links/${link.id}`}
                            className="btn-press rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            title="View Deep Telemetry"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Link>

                          {/* Edit Settings */}
                          <button
                            type="button"
                            onClick={() => setSelectedEditLink(link)}
                            className="btn-press rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            title="Edit Link Settings"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(link.id, link.shortCode)}
                            className="btn-press rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete Link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination */}
          {filteredLinks.length > pageSize && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredLinks.length)} of {filteredLinks.length} links
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="btn-press rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-bold text-slate-900 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-press rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      <QrModal
        link={selectedQrLink}
        isOpen={Boolean(selectedQrLink)}
        onClose={() => setSelectedQrLink(null)}
      />

      {/* Edit Link Modal */}
      <EditLinkModal
        link={selectedEditLink}
        isOpen={Boolean(selectedEditLink)}
        onClose={() => setSelectedEditLink(null)}
        onLinkUpdated={(updated) => {
          setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        }}
      />
    </AppLayout>
  );
}