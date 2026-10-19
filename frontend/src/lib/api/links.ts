import { LinkItem, CreateLinkPayload, ApiResponse, LinkAnalytics } from "@/types";
import { getStoredLinks, saveStoredLinks } from "@/lib/storage";
import { SAMPLE_ANALYTICS } from "@/lib/mock-data/initial-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
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
    await new Promise((r) => setTimeout(r, 120));
    return getStoredLinks();
  }

  const res = await fetch(`${API_BASE_URL}/api/links`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const envelope: ApiResponse<LinkItem[]> = await res.json();
  return envelope.data;
}

export async function fetchLinkById(id: string): Promise<LinkItem | null> {
  if (USE_MOCK) {
    const links = getStoredLinks();
    return links.find((l) => l.id === id) || null;
  }

  const res = await fetch(`${API_BASE_URL}/api/links/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const envelope: ApiResponse<LinkItem> = await res.json();
  return envelope.data;
}

export async function fetchLinkAnalytics(id: string): Promise<LinkAnalytics> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 100));

    // If pre-seeded sample analytics exists, return it
    if (SAMPLE_ANALYTICS[id]) {
      return SAMPLE_ANALYTICS[id];
    }

    // Dynamic fallback for newly created user links
    const link = (await fetchLinkById(id)) || { clickCount: 0 };
    const clicks = link.clickCount || 1;
    const unique = Math.max(1, Math.round(clicks * 0.78));

    return {
      linkId: id,
      totalClicks: clicks,
      uniqueVisitors: unique,
      clicksOverTime: [
        { date: "00:00", clicks: Math.round(clicks * 0.1), uniqueVisitors: Math.round(unique * 0.1) },
        { date: "06:00", clicks: Math.round(clicks * 0.2), uniqueVisitors: Math.round(unique * 0.2) },
        { date: "12:00", clicks: Math.round(clicks * 0.4), uniqueVisitors: Math.round(unique * 0.4) },
        { date: "18:00", clicks: Math.round(clicks * 0.3), uniqueVisitors: Math.round(unique * 0.3) },
      ],
      referrers: [
        { name: "Direct / QR Scan", clicks: Math.round(clicks * 0.55), percentage: 55 },
        { name: "Twitter / X", clicks: Math.round(clicks * 0.25), percentage: 25 },
        { name: "LinkedIn", clicks: Math.round(clicks * 0.12), percentage: 12 },
        { name: "Other", clicks: Math.round(clicks * 0.08), percentage: 8 },
      ],
      devices: [
        { name: "Desktop", clicks: Math.round(clicks * 0.65), percentage: 65 },
        { name: "Mobile", clicks: Math.round(clicks * 0.30), percentage: 30 },
        { name: "Tablet", clicks: Math.round(clicks * 0.05), percentage: 5 },
      ],
      browsers: [
        { name: "Chrome", clicks: Math.round(clicks * 0.6), percentage: 60 },
        { name: "Safari", clicks: Math.round(clicks * 0.25), percentage: 25 },
        { name: "Edge / Firefox", clicks: Math.round(clicks * 0.15), percentage: 15 },
      ],
      countries: [
        { name: "India", clicks: Math.round(clicks * 0.6), percentage: 60 },
        { name: "United States", clicks: Math.round(clicks * 0.25), percentage: 25 },
        { name: "United Kingdom", clicks: Math.round(clicks * 0.15), percentage: 15 },
      ],
    };
  }

  const res = await fetch(`${API_BASE_URL}/api/links/${id}/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  const envelope: ApiResponse<LinkAnalytics> = await res.json();
  return envelope.data;
}

export async function createLink(payload: CreateLinkPayload): Promise<LinkItem> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));

    try {
      new URL(payload.originalUrl);
    } catch {
      throw new Error("Invalid URL format. Please include http:// or https://");
    }

    const shortCode = payload.customAlias && payload.customAlias.trim().length > 0 
      ? payload.customAlias.trim() 
      : generateShortCode();

    const existingLinks = getStoredLinks();
    
    if (existingLinks.some((l) => l.shortCode.toLowerCase() === shortCode.toLowerCase())) {
      throw new Error(`The alias "${shortCode}" is already in use. Please pick another.`);
    }

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
}

export async function deleteLink(id: string): Promise<void> {
  if (USE_MOCK) {
    const links = getStoredLinks().filter((l) => l.id !== id);
    saveStoredLinks(links);
    return;
  }

  const res = await fetch(`${API_BASE_URL}/api/links/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete link");
}

export async function toggleLinkStatus(id: string, isActive: boolean): Promise<LinkItem> {
  if (USE_MOCK) {
    const links = getStoredLinks();
    const target = links.find((l) => l.id === id);
    if (!target) throw new Error("Link not found");
    target.isActive = isActive;
    target.updatedAt = new Date().toISOString();
    saveStoredLinks(links);
    return target;
  }

  const res = await fetch(`${API_BASE_URL}/api/links/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  const envelope: ApiResponse<LinkItem> = await res.json();
  return envelope.data;
}