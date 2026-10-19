"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  BarChart3,
  QrCode,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
  ChevronRight,
} from "lucide-react";
import QuickShortener from "@/components/landing/QuickShortener";
import { getAuthToken, hasRegisteredBefore } from "@/lib/auth";

export default function LandingPage() {
  const router = useRouter();

  // Mandatory Authentication Guard (Instagram-style)
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      if (hasRegisteredBefore()) {
        router.push("/login");
      } else {
        router.push("/signup");
      }
    }
  }, [router]);

  return (
    <div className="relative min-h-screen bg-slate-50/70 overflow-hidden text-slate-900 selection:bg-blue-600/15 selection:text-blue-600">
      {/* Background Radial Glow Mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="h-[600px] w-full max-w-6xl bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Link<span className="text-blue-600">Pulse</span>
              </span>
              <span className="ml-2 hidden rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 sm:inline-block">
                Innovista 2026
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#analytics" className="hover:text-blue-600 transition-colors">Telemetry</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#team" className="hover:text-blue-600 transition-colors">Team Catalyst</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
            >
              <span>Launch Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>High-Velocity Link Intelligence Engine</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">Full-Stack Ready</span>
          </div>

          {/* Master Headline */}
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
            Shorten URLs. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Amplify Every Click.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            LinkPulse transforms static URLs into dynamic communication pipelines with real-time telemetry, custom aliases, QR generation, campaign grouping, and safety protections.
          </p>

          {/* Upgraded Hero Shortener */}
          <div className="mt-10">
            <QuickShortener />
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
            <div className="p-3 card-float rounded-xl">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">99.99%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Uptime Architecture</p>
            </div>
            <div className="p-3 card-float rounded-xl">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">&lt; 35ms</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Redirect Latency</p>
            </div>
            <div className="p-3 card-float rounded-xl">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Audit Telemetry</p>
            </div>
            <div className="p-3 card-float rounded-xl">
              <p className="text-3xl font-extrabold text-blue-600 tracking-tight">Full-Stack</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Spring Boot 3 + MySQL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 border border-blue-200">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Speed, Precision, and Control
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Everything needed to manage marketing links, internal tools, and developer assets at enterprise scale.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-3xl border border-slate-200/90 border-t-4 border-t-blue-500 bg-slate-50/50 p-8 card-float">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <MousePointerClick className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Link Management</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Create memorable vanity aliases, define auto-expiration schedules, set maximum click limits, and protect URLs with passwords.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Custom slugs & vanity aliases
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Auto-expiration by date or click limit
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Live killswitch to freeze links instantly
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl border border-slate-200/90 border-t-4 border-t-cyan-500 bg-slate-50/50 p-8 card-float">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Deep Click Telemetry</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Gain instant visibility into your traffic. Track visitors over time, referring channels, browser engines, and operating systems.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Real-time hourly telemetry charts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Referrer & domain attribution breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Device and geographic segmentation
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl border border-slate-200/90 border-t-4 border-t-indigo-500 bg-slate-50/50 p-8 card-float">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">QR Tools & Bulk CSV Ingestion</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Generate high-resolution vector QR codes ready for print and signage. Upload CSV spreadsheets to shorten hundreds of links in seconds.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Custom-colored print PNG QR generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Bulk CSV drag-and-drop batch shortening
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Campaign attribution & grouping
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modern macOS-Style Console Showcase Preview */}
      <section id="analytics" className="py-20 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-2xl card-float">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Live Console Simulation
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Unified Mission Control
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sub-millisecond redirect processing paired with synchronous telemetry logging.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="btn-glow inline-flex items-center gap-2 self-start rounded-xl px-4 py-2 text-xs font-semibold"
              >
                <span>Open Live Console</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* macOS Window Mockup */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-950 p-1 shadow-inner overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">linkpulse-console // mission-control</span>
              </div>

              <div className="p-4 sm:p-6 bg-slate-900/50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                    <span className="text-xs font-medium text-slate-400">Total Short Links</span>
                    <p className="text-2xl font-extrabold text-white mt-1">1,420</p>
                    <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">Active on MySQL</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                    <span className="text-xs font-medium text-slate-400">Click Volume</span>
                    <p className="text-2xl font-extrabold text-white mt-1">482,903</p>
                    <span className="text-[11px] font-semibold text-blue-400 mt-1 block">Telemetry Logged</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                    <span className="text-xs font-medium text-slate-400">Backend Latency</span>
                    <p className="text-2xl font-extrabold text-emerald-400 mt-1">14ms</p>
                    <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Spring Boot 3</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
                    <span className="text-xs font-medium text-slate-400">System Health</span>
                    <p className="text-2xl font-extrabold text-white mt-1">100%</p>
                    <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Catalyst Section */}
      <section id="team" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Innovista 2026 Submission
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Engineered by TEAM CATALYST
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Autonomous engineering squad delivering full-stack URL infrastructure.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-left card-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm mb-3">
                NT
              </div>
              <p className="text-sm font-bold text-slate-900">Nitin Tiwari</p>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">Team Leader & Backend Architect</p>
              <p className="text-[11px] text-slate-500 mt-1">Java, Spring Boot 3, REST API, Systems Design</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-left card-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm mb-3">
                TR
              </div>
              <p className="text-sm font-bold text-slate-900">Tanishq Rawat</p>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">Frontend Engineer</p>
              <p className="text-[11px] text-slate-500 mt-1">Next.js App Router, React, Client State Engine</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-left card-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold text-sm mb-3">
                AT
              </div>
              <p className="text-sm font-bold text-slate-900">Ankit Tiwari</p>
              <p className="text-xs font-semibold text-purple-600 mt-0.5">UI/UX & Styling</p>
              <p className="text-[11px] text-slate-500 mt-1">Design System, Tailwind CSS, Micro-interactions</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-left card-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm mb-3">
                VB
              </div>
              <p className="text-sm font-bold text-slate-900">Vivek Bisht</p>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">Database Administrator</p>
              <p className="text-[11px] text-slate-500 mt-1">MySQL, Indexing, Telemetry Data Modeling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">LinkPulse</span>
            <span>•</span>
            <span>TEAM CATALYST // Innovista 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link href="/links" className="hover:text-blue-600 transition-colors">Links</Link>
            <Link href="/campaigns" className="hover:text-blue-600 transition-colors">Campaigns</Link>
            <Link href="/qr-tools" className="hover:text-blue-600 transition-colors">QR Studio</Link>
            <Link href="/settings" className="hover:text-blue-600 transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}