"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="grow flex flex-col">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
