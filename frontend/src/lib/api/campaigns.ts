import { Campaign, ApiResponse } from "@/types";
import { getStoredCampaigns, saveStoredCampaigns, getStoredLinks } from "@/lib/storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function fetchCampaigns(): Promise<Campaign[]> {
  if (USE_MOCK) {
    return getLocalCampaigns();
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/campaigns`, { 
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    const envelope: ApiResponse<Campaign[]> = await res.json();
    return envelope.data || [];
  } catch (err) {
    console.warn("Backend unreachable at " + API_BASE_URL + ", using local campaigns cache:", err);
    return getLocalCampaigns();
  }
}

function getLocalCampaigns(): Campaign[] {
  const campaigns = getStoredCampaigns();
  const links = getStoredLinks();
  return campaigns.map((camp) => {
    const associatedLinks = links.filter((l) => l.campaignId === camp.id);
    const totalClicks = associatedLinks.reduce((sum, l) => sum + l.clickCount, 0);
    return {
      ...camp,
      linkCount: associatedLinks.length || camp.linkCount,
      totalClicks: totalClicks || camp.totalClicks,
    };
  });
}

export async function createCampaign(name: string, description: string): Promise<Campaign> {
  if (USE_MOCK) {
    return createLocalCampaign(name, description);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) throw new Error("Failed to create campaign");
    const envelope: ApiResponse<Campaign> = await res.json();
    return envelope.data;
  } catch (err) {
    console.warn("Backend create failed, saving locally:", err);
    return createLocalCampaign(name, description);
  }
}

function createLocalCampaign(name: string, description: string): Campaign {
  const campaigns = getStoredCampaigns();
  const newCamp: Campaign = {
    id: `camp-${Date.now()}`,
    name: name.trim(),
    description: description.trim() || "No description provided.",
    linkCount: 0,
    totalClicks: 0,
    createdAt: new Date().toISOString(),
  };
  saveStoredCampaigns([newCamp, ...campaigns]);
  return newCamp;
}

export async function deleteCampaign(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/campaigns/${id}`, { method: "DELETE" });
  } catch {
    const campaigns = getStoredCampaigns().filter((c) => c.id !== id);
    saveStoredCampaigns(campaigns);
  }
}