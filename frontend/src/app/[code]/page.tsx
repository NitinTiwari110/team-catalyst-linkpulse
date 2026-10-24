
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { getStoredLinks } from "@/lib/storage";
import type { LinkItem } from "@/types";

type PageStatus =
  | "resolving"
  | "redirecting"
  | "not_found"
  | "expired"
  | "disabled"
  | "error";

export default function ShortCodeRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === "string" ? params.code : "";

  const [state, setState] = useState<{
    status: PageStatus;
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

    const reserved = [
      "dashboard",
      "links",
      "campaigns",
      "settings",
      "login",
      "signup",
      "qr-tools",
      "api",
    ];

    if (reserved.includes(code.toLowerCase())) {
      router.replace(`/${code}`);
      return;
    }

    let cancelled = false;

    async function handleRedirection() {
      let matchedLink: LinkItem | null = null;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

      // Use the backend whenever it is configured.
      if (apiBaseUrl) {
        try {
          const token = localStorage.getItem("linkpulse_jwt_token");

          const response = await fetch(
            `${apiBaseUrl}/api/links/code/${encodeURIComponent(code)}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                ...(token
                  ? { Authorization: `Bearer ${token}` }
                  : {}),
              },
              cache: "no-store",
            }
          );

          if (response.status === 404) {
            if (!cancelled) {
              setState({ status: "not_found", destinationUrl: null });
            }
            return;
          }

          if (!response.ok) {
            console.error(
              "Short-link lookup failed:",
              response.status,
              await response.text()
            );

            if (!cancelled) {
              setState({ status: "error", destinationUrl: null });
            }
            return;
          }

          const body = await response.json();
          const data = body?.data;

          if (!data || typeof data.originalUrl !== "string") {
            console.error("Unexpected link API response:", body);

            if (!cancelled) {
              setState({ status: "error", destinationUrl: null });
            }
            return;
          }

          matchedLink = {
            ...data,
            isActive: data.isActive ?? data.active,
          } as LinkItem;
        } catch (error) {
          console.error("Backend link lookup failed:", error);

          if (!cancelled) {
            setState({ status: "error", destinationUrl: null });
          }
          return;
        }
      } else {
        // Local-only mode: this cannot resolve links saved on another device.
        const localLinks = getStoredLinks();

        matchedLink =
          localLinks.find(
            (link) =>
              link.shortCode === code || link.customAlias === code
          ) ?? null;
      }

      if (cancelled) return;

      if (!matchedLink) {
        setState({ status: "not_found", destinationUrl: null });
        return;
      }

      if (matchedLink.isActive === false) {
        setState({ status: "disabled", destinationUrl: null });
        return;
      }

      if (
        matchedLink.expiresAt &&
        new Date(matchedLink.expiresAt).getTime() < Date.now()
      ) {
        setState({ status: "expired", destinationUrl: null });
        return;
      }

      const originalUrl = matchedLink.originalUrl.trim();

      if (!originalUrl) {
        setState({ status: "error", destinationUrl: null });
        return;
      }

      let target: URL;

      try {
        target = new URL(
          /^https?:\/\//i.test(originalUrl)
            ? originalUrl
            : `https://${originalUrl}`
        );

        if (!["http:", "https:"].includes(target.protocol)) {
          throw new Error("Unsupported URL protocol");
        }
      } catch {
        console.error("Invalid destination URL:", originalUrl);
        setState({ status: "error", destinationUrl: null });
        return;
      }

      setState({
        status: "redirecting",
        destinationUrl: target.toString(),
      });

      window.location.replace(target.toString());
    }

    void handleRedirection();

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  if (state.status === "resolving" || state.status === "redirecting") {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Redirecting...
          </h1>
          <p className="text-sm text-slate-500 mb-3">
            Resolving LinkPulse short code{" "}
            <span className="font-mono font-medium text-blue-600">
              /{code}
            </span>
          </p>
          {state.destinationUrl && (
            <p className="text-xs text-slate-400 break-all">
              {state.destinationUrl}
            </p>
          )}
        </div>
      </main>
    );
  }

  if (state.status === "expired" || state.status === "disabled") {
    const expired = state.status === "expired";

    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-md w-full text-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
              expired
                ? "bg-amber-50 text-amber-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {expired ? (
              <Clock className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            {expired ? "Link Expired" : "Link Deactivated"}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {expired
              ? `The link /${code} has passed its active validity period.`
              : "This short link has been temporarily disabled by its owner."}
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

  const isError = state.status === "error";

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {isError ? "Unable to Resolve Link" : "Link Not Found"}
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          {isError
            ? "We couldn't reach the link service or process its response. Please try again shortly."
            : `The link /${code} does not exist or may have been deleted.`}
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
