"use client";

import { useState } from "react";
import { X, Sparkles, AlertCircle, Copy, Check, Lock, Calendar, Hash } from "lucide-react";
import { createLink } from "@/lib/api/links";
import { copyToClipboard } from "@/lib/utils";
import { LinkItem } from "@/types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkCreated?: (link: LinkItem) => void;
}

export default function CreateLinkModal({ isOpen, onClose, onLinkCreated }: ModalProps) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [clickLimit, setClickLimit] = useState("");
  const [password, setPassword] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let cleanUrl = url.trim();
    if (!cleanUrl) {
      setError("Destination URL is required.");
      return;
    }

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setLoading(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const newLink = await createLink({
        originalUrl: cleanUrl,
        customAlias: alias.trim() ? alias.trim() : undefined,
        title: title.trim() ? title.trim() : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        clickLimit: clickLimit ? parseInt(clickLimit, 10) : null,
        password: password.trim() ? password.trim() : null,
        tags: tags.length ? tags : ["Direct"],
      });

      setCreatedResult(newLink);
      if (onLinkCreated) onLinkCreated(newLink);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create short link.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!createdResult) return;
    const ok = await copyToClipboard(createdResult.shortUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setUrl("");
    setAlias("");
    setTitle("");
    setExpiresAt("");
    setClickLimit("");
    setPassword("");
    setTagsInput("");
    setCreatedResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-brand-navy">Create New Short Link</h3>
            <p className="text-xs text-slate-500">Configure destination, routing alias, and safety controls.</p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdResult ? (
          <div className="py-6 space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-navy">Short Link Generated!</h4>
              <p className="text-xs text-slate-500 mt-1">Your new link is ready to share.</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
              <span className="font-mono text-sm font-bold text-brand-blue truncate mr-2">
                {createdResult.shortUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy border border-slate-200 shadow-sm hover:bg-slate-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreatedResult(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Create Another
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-xl bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy-light"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1">
                Destination URL *
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/path"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-brand-navy focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">
                  Custom Alias (optional)
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="e.g. hackathon-demo"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-brand-navy focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">
                  Link Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Guidelines Doc"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-brand-navy focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-brand-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                  <Lock className="h-3 w-3" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-brand-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Product, Innovista, Social"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-brand-navy focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-hover disabled:opacity-50"
              >
                {loading ? "Generating..." : <><Sparkles className="h-3.5 w-3.5" /> Create Short Link</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}