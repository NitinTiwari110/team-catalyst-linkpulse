"use client";

import { Menu, Plus, Radio } from "lucide-react";

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenCreateModal: () => void;
}

export default function Header({ onOpenMobileNav, onOpenCreateModal }: HeaderProps) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Backend Connectivity Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs">
          <Radio className={`h-3 w-3 ${isMock ? "text-amber-500 animate-pulse" : "text-emerald-500"}`} />
          <span className="font-medium text-slate-600">
            {isMock ? "Mock Engine (Ready for Spring Boot)" : "Live API Connected"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-blue-hover"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Short Link</span>
          <span className="sm:hidden">Create</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy font-bold text-white text-xs">
            TC
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <p className="font-bold text-brand-navy">Team Catalyst</p>
            <p className="text-[10px] text-slate-400">Lead Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}