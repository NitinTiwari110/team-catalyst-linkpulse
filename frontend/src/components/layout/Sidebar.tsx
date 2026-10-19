"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  LayoutDashboard, 
  Link2, 
  Layers, 
  QrCode, 
  Settings, 
  ExternalLink,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Links", href: "/links", icon: Link2 },
  { name: "Campaigns", href: "/campaigns", icon: Layers },
  { name: "QR & Bulk Tools", href: "/qr-tools", icon: QrCode },
  { name: "Settings", href: "/settings", icon: Settings },
];

function NavLinks({ onSelect }: { onSelect: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onSelect}
            className={cn(
              "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
              )} />
              <span>{item.name}</span>
            </div>

            {isActive ? (
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-sm animate-pulse" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ mobileOpen, setMobileOpen }: SidebarProps) {
  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200 p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Link<span className="text-blue-600">Pulse</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Mission Control
              </span>
            </div>
          </Link>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <Suspense
          fallback={
            <div className="space-y-2 py-2">
              <div className="h-10 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          }
        >
          <NavLinks onSelect={() => setMobileOpen(false)} />
        </Suspense>
      </div>

      {/* Footer Info / Team Catalyst Credit */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/40 p-3.5 text-xs shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900">TEAM CATALYST</span>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200">
            2026
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Innovista Hackathon Edition
        </p>
        <Link
          href="/"
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Column */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 z-30 shadow-xs">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80%] shadow-2xl z-50 bg-white">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="hidden md:block w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30" />}>
      <SidebarInner {...props} />
    </Suspense>
  );
}