
import {
  LinkItem,
  CreateLinkPayload,
  ApiResponse,
  LinkAnalytics,
} from "@/types";

import { getStoredLinks, saveStoredLinks } from "@/lib/storage";
import { SAMPLE_ANALYTICS } from "@/lib/mock-data/initial-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Keep false for real backend usage.
const USE_MOCK = false;

function generateShortCode(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let result = "";

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Returns the JWT authorization header for browser requests.
 */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("linkpulse_jwt_token")
      : null;

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Makes an authenticated API request.
 */
async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(getAuthHeaders());

  new Headers(options.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (response.status === 401) {
    throw new Error(
      "Session expired or unauthorized. Please log in again."
    );
  }

  return response;
}

/**
 * Fetch all links belonging to the authenticated user.
 */
export async function fetchLinks(): Promise<LinkItem[]> {
  if (USE_MOCK) {
    return getStoredLinks();
  }

  try {
    const res = await apiFetch("/api/links");

    if (!res.ok) {
      throw new Error(`Failed to fetch links: HTTP ${res.status}`);
    }

    const envelope: ApiResponse<LinkItem[]> = await res.json();

    return envelope.data || [];
  } catch (err) {
    // Do not disguise authentication failures as backend outages.
    if (
      err instanceof Error &&
      err.message.includes("Session expired or unauthorized")
    ) {
      throw err;
    }

    console.error("Failed to fetch links from backend:", err);
    throw err;
  }
}

/**
 * Fetch a single link by ID.
 */
export async function fetchLinkById(
  id: string
): Promise<LinkItem | null> {
  if (USE_MOCK) {
    const links = getStoredLinks();
    return links.find((link) => link.id === id) || null;
  }

  const res = await apiFetch(`/api/links/${encodeURIComponent(id)}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch link: HTTP ${res.status}`);
  }

  const envelope: ApiResponse<LinkItem> = await res.json();

  return envelope.data ?? null;
}

/**
 * Fetch analytics for a link.
 */
export async function fetchLinkAnalytics(
  id: string
): Promise<LinkAnalytics> {
  if (USE_MOCK) {
    return (
      SAMPLE_ANALYTICS[id] || createFallbackAnalytics(id)
    );
  }

  const res = await apiFetch(
    `/api/links/${encodeURIComponent(id)}/analytics`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch analytics: HTTP ${res.status}`);
  }

  const envelope: ApiResponse<LinkAnalytics> = await res.json();

  return envelope.data;
}

/**
 * Create a new link in the backend.
 */
export async function createLink(
  payload: CreateLinkPayload
): Promise<LinkItem> {
  if (USE_MOCK) {
    return createLocalLink(payload);
  }

  const res = await apiFetch("/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));

    throw new Error(
      errorBody.message || `Link creation failed: HTTP ${res.status}`
    );
  }

  const envelope: ApiResponse<LinkItem> = await res.json();

  if (!envelope.data) {
    throw new Error("Backend returned no link data.");
  }

  return envelope.data;
}

/**
 * Local link creation is used only when mock mode is explicitly enabled.
 */
function createLocalLink(payload: CreateLinkPayload): LinkItem {
  const shortCode =
    payload.customAlias && payload.customAlias.trim().length > 0
      ? payload.customAlias.trim()
      : generateShortCode();

  const existingLinks = getStoredLinks();

  const newLink: LinkItem = {
    id: `link-${Date.now()}`,
    originalUrl: payload.originalUrl,
    shortCode,
    shortUrl: `${APP_URL}/${shortCode}`,
    title: payload.title || new URL(payload.originalUrl).hostname,
    customAlias: payload.customAlias || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: payload.expiresAt || null,
    clickLimit: payload.clickLimit || null,
    clickCount: 0,
    isActive: true,
    isPasswordProtected: Boolean(payload.password),
    tags: payload.tags || ["Quick Link"],
    campaignId: payload.campaignId || null,
  };

  saveStoredLinks([newLink, ...existingLinks]);

  return newLink;
}

/**
 * Delete a link.
 */
export async function deleteLink(id: string): Promise<void> {
  if (USE_MOCK) {
    const links = getStoredLinks().filter((link) => link.id !== id);
    saveStoredLinks(links);
    return;
  }

  const res = await apiFetch(
    `/api/links/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete link: HTTP ${res.status}`);
  }
}

/**
 * Enable or disable a link.
 */
export async function toggleLinkStatus(
  id: string,
  isActive: boolean
): Promise<LinkItem> {
  if (USE_MOCK) {
    const links = getStoredLinks();
    const target = links.find((link) => link.id === id);

    if (!target) {
      throw new Error("Link not found");
    }

    target.isActive = isActive;
    saveStoredLinks(links);

    return target;
  }

  const res = await apiFetch(
    `/api/links/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update link status: HTTP ${res.status}`);
  }

  const envelope: ApiResponse<LinkItem> = await res.json();

  if (!envelope.data) {
    throw new Error("Backend returned no updated link data.");
  }

  return envelope.data;
}

function createFallbackAnalytics(id: string): LinkAnalytics {
  return {
    linkId: id,
    totalClicks: 0,
    uniqueVisitors: 0,
    clicksOverTime: [],
    referrers: [],
    devices: [],
    browsers: [],
    countries: [],
  };
}
