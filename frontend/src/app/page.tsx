import Link from "next/link";
import {
  Zap,
  ArrowRight,
  BarChart3,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
  Layers,
  Globe2,
  Clock,
  ChevronRight,
} from "lucide-react";
import QuickShortener from "@/components/landing/QuickShortener";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-surface-subtle">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-navy">
                Link<span className="text-brand-blue">Pulse</span>
              </span>
              <span className="ml-2 hidden rounded-full border border-brand-blue/20 bg-brand-blue-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue sm:inline">
                Innovista 2026
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-blue transition">Features</a>
            <a href="#analytics" className="hover:text-brand-blue transition">Telemetry</a>
            <a href="#architecture" className="hover:text-brand-blue transition">Architecture</a>
            <a href="#team" className="hover:text-brand-blue transition">Team Catalyst</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-light"
            >
              <span>Launch Console</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue-subtle px-4 py-1.5 text-xs font-semibold text-brand-blue shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>High-Velocity Link Intelligence Engine</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-brand-navy sm:text-6xl sm:leading-tight">
            Shorten URLs. <br />
            <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
              Amplify Every Click.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            LinkPulse transforms static URLs into dynamic communication pipelines with real-time telemetry, QR code generation, campaign grouping, and safety protections.
          </p>

          {/* Interactive URL Shortener Box */}
          <div className="mt-10">
            <QuickShortener />
          </div>

          {/* Trust Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy">99.99%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Uptime Architecture</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy">&lt; 40ms</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Redirect Latency</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy">100%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Audit Telemetry</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy">REST Ready</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Spring Boot + MySQL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Engineered for Speed, Precision, and Control
            </p>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Everything needed to manage marketing links, internal tools, and developer assets at enterprise scale.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-brand-surface-subtle p-7 hover:border-brand-blue/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-brand-blue mb-5">
                <MousePointerClick className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">Smart Link Management</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Create memorable custom aliases, define expiration schedules, configure max click limits, and tag links for quick discovery.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Custom slugs & branded vanity aliases
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Auto-expiration by date or click count
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Password-protected destinations
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-brand-surface-subtle p-7 hover:border-brand-blue/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-brand-cyan mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">Deep Click Telemetry</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Gain instant visibility into your traffic. Track visitors over time, referring sources, browser engines, and operating systems.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Real-time timeseries volume charts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Referrer & domain attribution breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Device and geographic segmentation
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-brand-surface-subtle p-7 hover:border-brand-blue/40 transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">QR Tools & Bulk Import</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Generate high-resolution vector QR codes ready for print and signage. Upload CSV spreadsheets to shorten hundreds of links in seconds.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Instant SVG/PNG QR code generator
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Bulk CSV processing & batch reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Killswitch to instantly freeze suspicious links
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="analytics" className="py-20 bg-brand-surface-subtle overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                  Console Showcase
                </span>
                <h3 className="text-2xl font-bold text-brand-navy mt-1">
                  Unified Mission Control
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designed for instantaneous feedback and clean data density.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 self-start rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue-hover transition"
              >
                <span>Explore Live Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mock Dashboard Preview Window */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-medium text-slate-500">Total Short Links</span>
                  <p className="text-2xl font-extrabold text-brand-navy mt-1">1,248</p>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
                    +18.4% this week
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-medium text-slate-500">Total Click Volume</span>
                  <p className="text-2xl font-extrabold text-brand-navy mt-1">482,903</p>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
                    +24.1% vs last month
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-medium text-slate-500">Active Campaigns</span>
                  <p className="text-2xl font-extrabold text-brand-navy mt-1">8</p>
                  <span className="text-[11px] font-semibold text-brand-blue mt-1 inline-flex items-center gap-1">
                    3 launched today
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-medium text-slate-500">Avg. Click Rate</span>
                  <p className="text-2xl font-extrabold text-brand-navy mt-1">84.2%</p>
                  <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
                    Optimal health
                  </span>
                </div>
              </div>

              {/* Graphic Mock Table */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Recent High-Performing Links</span>
                  <span className="text-[11px] text-slate-400">Real-time feed</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-brand-blue">/cat-docs</span>
                      <span className="text-slate-500 truncate max-w-xs hidden sm:inline">
                        github.com/team-catalyst/innovista-submission-docs
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">Active</span>
                      <span className="font-bold text-brand-navy">1,420 clicks</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-brand-blue">/lp-figma</span>
                      <span className="text-slate-500 truncate max-w-xs hidden sm:inline">
                        figma.com/design/linkpulse-modern-saas-specs
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">Active</span>
                      <span className="font-bold text-brand-navy">842 clicks</span>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-brand-blue">/sb-api</span>
                      <span className="text-slate-500 truncate max-w-xs hidden sm:inline">
                        spring.io/projects/spring-boot-3-rest-api
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-medium text-amber-700">Protected</span>
                      <span className="font-bold text-brand-navy">312 clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Team Catalyst Section */}
      <section id="architecture" className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
              Technical Foundation
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
              Engineered for Production Scale
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Architected with a decoupled frontend/backend pipeline, ready for high-concurrency redirect loads.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <Layers className="h-6 w-6 text-brand-blue mb-3" />
              <h4 className="font-bold text-brand-navy text-sm">Next.js App Router</h4>
              <p className="text-xs text-slate-500 mt-1">
                Optimized React 19 rendering, streaming layouts, and zero-layout shift.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <Globe2 className="h-6 w-6 text-emerald-600 mb-3" />
              <h4 className="font-bold text-brand-navy text-sm">Spring Boot 3 API</h4>
              <p className="text-xs text-slate-500 mt-1">
                Java microservices with asynchronous event processing for click telemetry.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <ShieldCheck className="h-6 w-6 text-indigo-600 mb-3" />
              <h4 className="font-bold text-brand-navy text-sm">MySQL Relational DB</h4>
              <p className="text-xs text-slate-500 mt-1">
                Normalized schemas for links, campaigns, and indexed time-bucketed analytics.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <Clock className="h-6 w-6 text-brand-cyan mb-3" />
              <h4 className="font-bold text-brand-navy text-sm">Caching & Queues</h4>
              <p className="text-xs text-slate-500 mt-1">
                Designed for Redis caching and message queue ingestion for redirect throughput.
              </p>
            </div>
          </div>

          {/* Team Catalyst Credits */}
          <div id="team" className="mt-16 rounded-2xl border border-slate-200 bg-brand-surface-subtle p-8 text-center">
            <h3 className="text-base font-bold text-brand-navy">Developed by TEAM CATALYST</h3>
            <p className="text-xs text-slate-500 mt-1">Innovista 2026 Submission</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-bold text-brand-navy">Nitin Tiwari</p>
                <p className="text-[11px] text-slate-500">Team Leader & Backend Architect</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-bold text-brand-navy">Tanishq Rawat</p>
                <p className="text-[11px] text-slate-500">Frontend Engineer</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-bold text-brand-navy">Ankit Tiwari</p>
                <p className="text-[11px] text-slate-500">UI/UX & Styling</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-bold text-brand-navy">Vivek Bisht</p>
                <p className="text-[11px] text-slate-500">Database & Data Modeler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brand-navy">LinkPulse</span>
            <span>•</span>
            <span>Built by TEAM CATALYST for Innovista 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-brand-blue">Dashboard</Link>
            <Link href="/links" className="hover:text-brand-blue">Links</Link>
            <Link href="/campaigns" className="hover:text-brand-blue">Campaigns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}