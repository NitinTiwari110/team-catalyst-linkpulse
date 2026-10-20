"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, LogOut } from "lucide-react";
import { getAuthUser, clearAuthSession, AuthUser } from "@/lib/auth";

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenCreateModal: () => void;
}

export default function Header({ onOpenMobileNav, onOpenCreateModal }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const isMock = false;

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    router.push("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "TC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden btn-press rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Live Connectivity Pulse Pill */}
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-1 text-xs shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isMock ? "bg-amber-400" : "bg-emerald-400"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isMock ? "bg-amber-500" : "bg-emerald-500"
            }`}></span>
          </span>
          <span className="font-semibold text-slate-700">
            {isMock ? "Mock Engine (Ready for Spring Boot)" : "Live Spring Boot API"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn-glow inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Short Link</span>
          <span className="sm:hidden">Create</span>
        </button>

        {/* User Pill & Logout */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 font-bold text-white text-xs shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="hidden lg:block text-left text-xs leading-tight">
            <p className="font-bold text-slate-900 truncate max-w-[120px]">
              {user?.name || "Team Catalyst"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {user?.email || "Lead Admin"}
            </p>
          </div>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="btn-press rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors ml-1"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}