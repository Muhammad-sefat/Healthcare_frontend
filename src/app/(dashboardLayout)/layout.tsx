"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardNavbar } from "@/components/shared/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, activeRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser || !activeRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans">
      {/* Sidebar Navigation (Desktop & Mobile) */}
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Header */}
        <DashboardNavbar setSidebarOpen={setSidebarOpen} />

        {/* Content Body Pane */}
        <main className="grow overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
