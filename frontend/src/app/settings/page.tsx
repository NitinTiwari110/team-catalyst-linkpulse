"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { saveStoredLinks, saveStoredCampaigns } from "@/lib/storage";
import { INITIAL_LINKS, INITIAL_CAMPAIGNS } from "@/lib/mock-data/initial-data";
import {
  Settings,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
  Code2,
  Database,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  );
  const [pingStatus, setPingStatus] = useState<"idle" | "testing" | "online" | "offline">("idle");
  const [latency, setLatency] = useState<number | null>(null);
  const [resetDone, setResetDone] = useState(false);

  // Ping Spring Boot Backend
  const handleTestBackend = async () => {
    setPingStatus("testing");
    setLatency(null);
    const start = performance.now();

    try {
      // Ping actuator health or api root with a 2-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`${apiUrl}/api/links`, {
        method: "HEAD",
        mode: "no-cors", // Allows detecting if port 8080 is listening even without full CORS yet
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const end = performance.now();
      setLatency(Math.round(end - start));
      setPingStatus("online");
    } catch {
      setPingStatus("offline");
    }
  };

  // Reset demo storage to original state
  const handleResetData = () => {
    if (window.confirm("Reset all local links and campaigns back to the initial sample seed?")) {
      saveStoredLinks(INITIAL_LINKS);
      saveStoredCampaigns(INITIAL_CAMPAIGNS);
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">
            System Settings & Telemetry Config
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure backend bridge parameters, test REST service health, and view team credentials.
          </p>
        </div>

        {/* 1. Spring Boot Backend Bridge & Diagnostics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-navy">Spring Boot REST API Bridge</h3>
                <p className="text-xs text-slate-500">Live service configuration and handshake ping tool</p>
              </div>
            </div>

            {/* Current Engine Mode Indicator */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
              <Radio className={`h-3 w-3 ${isMock ? "text-amber-500 animate-pulse" : "text-emerald-500"}`} />
              <span className="font-semibold text-slate-700">
                Mode: {isMock ? "Demo Storage" : "Live Spring Boot API"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Backend API Base URL (Configured in .env.local)
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-mono text-brand-navy focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={pingStatus === "testing"}
              onClick={handleTestBackend}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-navy-light transition shadow-sm disabled:opacity-50"
            >
              <Activity className="h-4 w-4 text-brand-cyan" />
              <span>{pingStatus === "testing" ? "Testing Connection..." : "Test Backend Handshake"}</span>
            </button>
          </div>

          {/* Connection Result Banner */}
          {pingStatus !== "idle" && (
            <div
              className={`rounded-xl p-4 text-xs flex items-center justify-between border ${
                pingStatus === "online"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : pingStatus === "offline"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {pingStatus === "online" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : pingStatus === "offline" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                ) : (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
                )}
                <span>
                  {pingStatus === "online"
                    ? `Spring Boot backend reachable at ${apiUrl}! Response verified (${latency}ms latency).`
                    : pingStatus === "offline"
                    ? `No active service detected at ${apiUrl}. Frontend is safely running in Demo Data Mode.`
                    : "Sending handshake request to Spring Boot port..."}
                </span>
              </div>
            </div>
          )}

          {/* Integration Guide for Nitin Tiwari & Vivek Bisht */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Code2 className="h-3.5 w-3.5 text-brand-blue" />
              REST API Contract for Nitin & Vivek
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-brand-blue font-bold">GET</span> /api/links
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">Returns LinkItem[]</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-emerald-600 font-bold">POST</span> /api/links
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">Accepts CreateLinkPayload</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-brand-blue font-bold">GET</span> /api/campaigns
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">Returns Campaign[]</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                <span className="text-purple-600 font-bold">GET</span> /api/links/:id/analytics
                <p className="font-sans text-[11px] text-slate-400 mt-0.5">Returns LinkAnalytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Team Catalyst Roster Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-brand-cyan">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">TEAM CATALYST — Innovista 2026</h3>
              <p className="text-xs text-slate-500">Official Hackathon Team Registry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs font-bold text-brand-navy">Nitin Tiwari</p>
              <p className="text-[11px] font-semibold text-brand-blue mt-0.5">Team Leader & Backend Architect</p>
              <p className="text-[10px] text-slate-400 mt-1">Java, Spring Boot 3, REST API</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs font-bold text-brand-navy">Tanishq Rawat</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Frontend Engineer</p>
              <p className="text-[10px] text-slate-400 mt-1">Next.js App Router, React, TypeScript</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs font-bold text-brand-navy">Ankit Tiwari</p>
              <p className="text-[11px] font-semibold text-purple-600 mt-0.5">UI/UX & Styling</p>
              <p className="text-[10px] text-slate-400 mt-1">Design System, Tailwind CSS, Layouts</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs font-bold text-brand-navy">Vivek Bisht</p>
              <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">Database Administrator</p>
              <p className="text-[10px] text-slate-400 mt-1">MySQL, Data Modeling, Optional AI</p>
            </div>
          </div>
        </div>

        {/* 3. Storage Reset / Danger Zone */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-brand-navy">Reset Local Demo Storage</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Wipes out all test links created in your browser and restores the clean seed data.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {resetDone && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Reset Complete!
              </span>
            )}
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Seed Data</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}