"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import CreateCampaignModal from "@/components/campaigns/CreateCampaignModal";
import { fetchCampaigns, deleteCampaign } from "@/lib/api/campaigns";
import { fetchLinks } from "@/lib/api/links";
import { formatDate } from "@/lib/utils";
import { Campaign, LinkItem } from "@/types";
import {
  Layers,
  Plus,
  MousePointerClick,
  Link2,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
} from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [expandedCampId, setExpandedCampId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [campsData, linksData] = await Promise.all([
        fetchCampaigns(),
        fetchLinks(),
      ]);
      setCampaigns(campsData);
      setLinks(linksData);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      try {
        await deleteCampaign(id);
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // High-level aggregates
  const totalCampaignClicks = campaigns.reduce((sum, c) => sum + c.totalClicks, 0);
  const totalCampaignLinks = campaigns.reduce((sum, c) => sum + c.linkCount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
              Campaign Segmentation
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Organize multiple short URLs into targeted marketing initiatives and compare aggregate conversions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 self-start rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-hover transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Campaigns</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-brand-navy mt-2">
              {campaigns.length}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              Organized Channels
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Grouped Links</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-brand-cyan">
                <Link2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-brand-navy mt-2">
              {totalCampaignLinks}
            </p>
            <span className="text-[11px] font-semibold text-brand-blue mt-1 inline-block">
              Across all initiatives
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Campaign Click Volume</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <MousePointerClick className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-brand-navy mt-2">
              {totalCampaignClicks.toLocaleString()}
            </p>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 inline-block">
              Aggregate Engagement
            </span>
          </div>
        </div>

        {/* Campaign Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-xs text-slate-400 shadow-card">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
              Loading marketing campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-brand-navy">No Campaigns Created Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create your first campaign to group short links and track their combined performance.
              </p>
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="mt-4 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue-hover"
              >
                + Create Campaign
              </button>
            </div>
          ) : (
            campaigns.map((camp) => {
              const campLinks = links.filter((l) => l.campaignId === camp.id);
              const isExpanded = expandedCampId === camp.id;

              return (
                <div
                  key={camp.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-card-hover transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-brand-navy">{camp.name}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {campLinks.length || camp.linkCount} links
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 max-w-xl">{camp.description}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(camp.createdAt)}</span>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2 text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Total Clicks
                        </span>
                        <span className="text-base font-extrabold text-brand-navy">
                          {(camp.totalClicks || campLinks.reduce((s, l) => s + l.clickCount, 0)).toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedCampId(isExpanded ? null : camp.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        <span>{isExpanded ? "Hide Links" : "View Assigned Links"}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(camp.id, camp.name)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Assigned Links Drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-150">
                      <p className="text-xs font-bold text-slate-600 mb-2">
                        Assigned Short Links ({campLinks.length})
                      </p>

                      {campLinks.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
                          No links currently assigned to this campaign. You can attach links in the Links Console.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60 overflow-hidden text-xs">
                          {campLinks.map((link) => (
                            <div
                              key={link.id}
                              className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-100/50 transition"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono font-bold text-brand-blue">
                                  /{link.shortCode}
                                </span>
                                <span className="text-slate-500 truncate max-w-xs hidden sm:inline">
                                  {link.title || link.originalUrl}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <span className="font-bold text-brand-navy">
                                  {link.clickCount.toLocaleString()} clicks
                                </span>
                                <Link
                                  href={`/links/${link.id}`}
                                  className="text-brand-blue hover:underline flex items-center gap-1 font-semibold"
                                >
                                  <span>Details</span>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newCamp) => setCampaigns((prev) => [newCamp, ...prev])}
      />
    </AppLayout>
  );
}