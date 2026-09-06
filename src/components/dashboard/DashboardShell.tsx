"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({
  role,
  name,
  children,
}: {
  role: string;
  name: string;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <Sidebar role={role} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar name={name} role={role} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-6xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}