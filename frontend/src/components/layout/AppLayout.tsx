"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CreateLinkModal from "@/components/links/CreateLinkModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface-subtle">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="md:pl-64 flex flex-col flex-1">
        <Header 
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenCreateModal={() => setCreateModalOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick-Create Modal */}
      <CreateLinkModal 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
}