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
  X 
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
    <nav className="space-y-1">
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
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              isActive
                ? "bg-brand-blue text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-brand-navy"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ mobileOpen, setMobileOpen }: SidebarProps) {
  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200 p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-brand-navy">
                Link<span className="text-brand-blue">Pulse</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Console
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

        {/* Navigation Items wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="space-y-2 py-2">
              <div className="h-9 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-9 w-full rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-9 w-full rounded-xl bg-slate-100 animate-pulse" />
            </div>
          }
        >
          <NavLinks onSelect={() => setMobileOpen(false)} />
        </Suspense>
      </div>

      {/* Footer Info / Team Catalyst Credit */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-brand-navy">TEAM CATALYST</span>
          <span className="rounded-full bg-brand-blue-subtle px-1.5 py-0.5 text-[10px] font-bold text-brand-blue">
            2026
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          Innovista Hackathon Edition
        </p>
        <Link
          href="/"
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
        >
          <span>View Public Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80%] shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense
      fallback={
        <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 z-30 bg-white border-r border-slate-200" />
      }
    >
      <SidebarContent {...props} />
    </Suspense>
  );
}