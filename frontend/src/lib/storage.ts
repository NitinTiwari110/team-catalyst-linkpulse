import { LinkItem, Campaign } from "@/types";
import { INITIAL_LINKS, INITIAL_CAMPAIGNS } from "./mock-data/initial-data";

const LINKS_STORAGE_KEY = "linkpulse_links_v1";
const CAMPAIGNS_STORAGE_KEY = "linkpulse_campaigns_v1";

export function getStoredLinks(): LinkItem[] {
  if (typeof window === "undefined") return INITIAL_LINKS;
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(INITIAL_LINKS));
      return INITIAL_LINKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read links from storage", e);
    return INITIAL_LINKS;
  }
}

export function saveStoredLinks(links: LinkItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
  } catch (e) {
    console.error("Failed to save links to storage", e);
  }
}

export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return INITIAL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read campaigns from storage", e);
    return INITIAL_CAMPAIGNS;
  }
}

export function saveStoredCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error("Failed to save campaigns to storage", e);
  }
}