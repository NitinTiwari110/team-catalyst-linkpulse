"use client";

import { useState, useEffect } from "react";
import { X, Check, Calendar, Hash, Tag, AlertCircle } from "lucide-react";
import { LinkItem, UpdateLinkPayload } from "@/types";
import { getStoredLinks, saveStoredLinks } from "@/lib/storage";

interface EditLinkModalProps {
  link: LinkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLinkUpdated: (updated: LinkItem) => void;
}

export default function EditLinkModal({
  link,
  isOpen,
  onClose,
  onLinkUpdated,
}: EditLinkModalProps) {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [clickLimit, setClickLimit] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (link) {
      setTitle(link.title || "");
      setIsActive(link.isActive);
      setExpiresAt(link.expiresAt ? link.expiresAt.substring(0, 16) : "");
      setClickLimit(link.clickLimit ? String(link.clickLimit) : "");
      setTagsInput(link.tags ? link.tags.join(", ") : "");
      setError(null);
    }
  }, [link]);

  if (!isOpen || !link) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: UpdateLinkPayload = {
        title: title.trim() || undefined,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        clickLimit: clickLimit ? parseInt(clickLimit, 10) : null,
        tags,
      };

      // Update in storage
      const existing = getStoredLinks();
      const index = existing.findIndex((l) => l.id === link.id);
      if (index === -1) throw new Error("Link not found");

      const updated: LinkItem = {
        ...existing[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      existing[index] = updated;
      saveStoredLinks(existing);
      onLinkUpdated(updated);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-brand-navy">Edit Link Settings</h3>
            <p className="text-xs font-mono text-brand-blue">/{link.shortCode}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1">
              Link Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marketing Landing Page"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-brand-navy focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                <Calendar className="h-3 w-3" /> Expiry Date
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs text-brand-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                <Hash className="h-3 w-3" /> Click Limit
              </label>
              <input
                type="number"
                min="1"
                value={clickLimit}
                onChange={(e) => setClickLimit(e.target.value)}
                placeholder="Unlimited"
                className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs text-brand-navy focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
              <Tag className="h-3 w-3" /> Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Docs, Product, Campaign"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-brand-navy focus:outline-none"
            />
          </div>

          {/* Operational Status Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-xs font-semibold text-brand-navy">Active Routing</p>
              <p className="text-[10px] text-slate-400">Allow visitors to redirect to destination</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-hover"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}