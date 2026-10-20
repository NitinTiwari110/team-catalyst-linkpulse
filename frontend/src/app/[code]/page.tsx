"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { getStoredLinks, saveStoredLinks } from "@/lib/storage";
import { LinkItem } from "@/types";

export default function ShortCodeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === "string" ? params.code : "";

  const [state, setState] = useState<{
    status: "resolving" | "redirecting" | "not_found" | "expired" | "disabled";
    destinationUrl: string | null;
  }>({
    status: "resolving",
    destinationUrl: null,
  });

  useEffect(() => {
    if (!code) {
      setState({ status: "not_found", destinationUrl: null });
      return;
    }

    // Guard against reserved system paths
    const reserved = ["dashboard", "links", "campaigns", "settings", "login", "signup", "qr-tools", "api"];
    if (reserved.includes(code.toLowerCase())) {
      router.replace(`/${code}`);
      return;
    }

    async function handleRedirection() {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const isMockEnabled = false;

      let matchedLink: LinkItem | null = null;

      // 1. If backend API is configured and live, query Spring Boot first
      if (!isMockEnabled && apiBaseUrl) {
        try {
          const res = await fetch(`${apiBaseUrl}/api/links/code/${code}`);
          if (res.ok) {
            const body = await res.json();
            matchedLink = {
                ...body.data,
                isActive: body.data.active,
              };
          }
        } catch (e) {
          console.warn("Backend link lookup failed, falling back to local storage.", e);
        }
      }

      // 2. Query frontend storage (localStorage + initial fallback)
      if (!matchedLink) {
        const localLinks = getStoredLinks();
        const found = localLinks.find(
          (l) => l.shortCode === code || l.customAlias === code
        );

        if (found) {
          matchedLink = found;
          // Increment click telemetry
          found.clickCount = (found.clickCount || 0) + 1;
          found.updatedAt = new Date().toISOString();
          saveStoredLinks(localLinks);
        }
      }

      // 3. Validation rules
      if (!matchedLink) {
        setState({ status: "not_found", destinationUrl: null });
        return;
      }
      console.log("Matched link:", matchedLink);
      console.log("isActive value:", matchedLink.isActive);

      if (!matchedLink.isActive) {
        setState({ status: "disabled", destinationUrl: null });
        return;
      }

      if (matchedLink.expiresAt && new Date(matchedLink.expiresAt).getTime() < Date.now()) {
        setState({ status: "expired", destinationUrl: null });
        return;
      }

      // Format destination URL
      let target = matchedLink.originalUrl.trim();
      if (!/^https?:\/\//i.test(target)) {
        target = `https://${target}`;
      }

      setState({ status: "redirecting", destinationUrl: target });

      // Immediate browser redirect
      window.location.replace(target);
    }

    handleRedirection();
  }, [code, router]);

  if (state.status === "resolving" || state.status === "redirecting") {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Redirecting...</h1>
          <p className="text-sm text-slate-500 mb-3">
            Resolving LinkPulse short code <span className="font-mono font-medium text-blue-600">/{code}</span>
          </p>
          {state.destinationUrl && (
            <p className="text-xs text-slate-400 truncate max-w-xs mx-auto">
              {state.destinationUrl}
            </p>
          )}
        </div>
      </main>
    );
  }

  if (state.status === "expired") {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Link Expired</h1>
          <p className="text-sm text-slate-600 mb-6">
            The link <span className="font-mono font-medium text-amber-700">/{code}</span> has passed its active validity period.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (state.status === "disabled") {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Link Deactivated</h1>
          <p className="text-sm text-slate-600 mb-6">
            This short link has been temporarily disabled by its owner.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Link Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">
          The link <span className="font-mono font-medium text-rose-600">/{code}</span> does not exist or may have been deleted.
        </p>
        <Link
          href="/links"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Links
        </Link>
      </div>
    </main>
  );
}