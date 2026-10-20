import { LinkItem, CreateLinkPayload, ApiResponse, LinkAnalytics } from "@/types";
import { getStoredLinks, saveStoredLinks } from "@/lib/storage";
import { SAMPLE_ANALYTICS } from "@/lib/mock-data/initial-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const USE_MOCK = false;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function fetchLinks(): Promise<LinkItem[]> {
  if (USE_MOCK) {
    return getStoredLinks();
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/links`, { 
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const envelope: ApiResponse<LinkItem[]> = await res.json();
    return envelope.data || [];
  } catch (err) {
    console.warn("Backend not reachable at " + API_BASE_URL + ", using local cache:", err);
    return getStoredLinks();
  }
}

export async function fetchLinkById(id: string): Promise<LinkItem | null> {
  if (USE_MOCK) {
    const links = getStoredLinks();
    return links.find((l) => l.id === id) || null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/links/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const envelope: ApiResponse<LinkItem> = await res.json();
    return envelope.data;
  } catch {
    const links = getStoredLinks();
    return links.find((l) => l.id === id) || null;
  }
}

export async function fetchLinkAnalytics(id: string): Promise<LinkAnalytics> {
  if (USE_MOCK) {
    if (SAMPLE_ANALYTICS[id]) return SAMPLE_ANALYTICS[id];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/links/${id}/analytics`, { cache: "no-store" });
    if (res.ok) {
      const envelope: ApiResponse<LinkAnalytics> = await res.json();
      return envelope.data;
    }
  } catch {
    // fallback
  }

  return SAMPLE_ANALYTICS[id] || {
    linkId: id,
    totalClicks: 1,
    uniqueVisitors: 1,
    clicksOverTime: [{ date: "Now", clicks: 1, uniqueVisitors: 1 }],
    referrers: [{ name: "Direct / QR", clicks: 1, percentage: 100 }],
    devices: [{ name: "Desktop", clicks: 1, percentage: 100 }],
    browsers: [{ name: "Chrome", clicks: 1, percentage: 100 }],
    countries: [{ name: "India", clicks: 1, percentage: 100 }],
  };
}

export async function createLink(payload: CreateLinkPayload): Promise<LinkItem> {
  if (USE_MOCK) {
    return createLocalLink(payload);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `Creation failed with status ${res.status}`);
    }

    const envelope: ApiResponse<LinkItem> = await res.json();
    return envelope.data;
  } catch (err) {
    console.warn("Backend unavailable, creating locally:", err);
    return createLocalLink(payload);
  }
}

function createLocalLink(payload: CreateLinkPayload): LinkItem {
  const shortCode = payload.customAlias && payload.customAlias.trim().length > 0 
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

export async function deleteLink(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/links/${id}`, { method: "DELETE" });
  } catch {
    const links = getStoredLinks().filter((l) => l.id !== id);
    saveStoredLinks(links);
  }
}

export async function toggleLinkStatus(id: string, isActive: boolean): Promise<LinkItem> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/links/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const envelope: ApiResponse<LinkItem> = await res.json();
    return envelope.data;
  } catch {
    const links = getStoredLinks();
    const target = links.find((l) => l.id === id);
    if (!target) throw new Error("Link not found");
    target.isActive = isActive;
    saveStoredLinks(links);
    return target;
  }
}