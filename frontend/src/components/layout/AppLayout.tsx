"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, hasRegisteredBefore } from "@/lib/auth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CreateLinkModal from "@/components/links/CreateLinkModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Protect internal routes
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
    <div className="min-h-screen bg-slate-50/60 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenCreateModal={() => setCreateModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>

      <CreateLinkModal 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
}