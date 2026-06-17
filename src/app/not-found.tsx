"use client";

import React from "react";
import Link from "next/link";
import CommonLayout from "./(commonLayout)/layout";
import { HelpCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <CommonLayout>
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="bg-primary/5 text-primary p-4 rounded-full shadow-inner animate-bounce">
          <HelpCircle className="h-14 w-14" />
        </div>
        
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The path you are trying to visit does not exist or has been shifted. Check the URL parameters or return to directory.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            href="/doctors"
            className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Find Doctors
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-primary/15 transition-all"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </CommonLayout>
  );
}
