/* eslint-disable @next/next/no-img-element */
"use client";
import { useAuth } from "@/providers/authProvider";
import { Role } from "@/types";
import { Menu, Bell } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface DashboardNavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardNavbar({ setSidebarOpen }: DashboardNavbarProps) {
  const { currentUser, activeRole, currentProfile } = useAuth();

  if (!currentUser || !activeRole) return null;

  const getRoleBadgeColor = (role: Role) => {
    if (role === Role.SUPER_ADMIN)
      return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-350 border-rose-200 dark:border-rose-900/40";
    if (role === Role.ADMIN)
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-350 border-purple-200 dark:border-purple-900/40";
    if (role === Role.DOCTOR)
      return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-350 border-sky-200 dark:border-sky-900/40";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border-emerald-200 dark:border-emerald-900/40";
  };

  return (
    <header className="h-18 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="hidden sm:block text-base font-extrabold text-slate-800 dark:text-white">
          System Dashboard
        </h1>
      </div>

      {/* Right: Notifications, Role Switcher, Profiler */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Feed Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 rounded-full transition-all cursor-pointer relative focus:outline-hidden">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 rounded-2xl shadow-xl py-2 z-50 text-xs mt-2.5 p-0"
            align="end"
          >
            <div className="px-4 py-2 font-bold text-slate-455 border-b border-slate-50 dark:border-slate-750 uppercase tracking-wider text-[9px] flex justify-between items-center">
              <span>Notifications Feed</span>
              <span className="text-[10px] text-primary lowercase font-medium cursor-pointer">
                Mark read
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-750/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Payment Verified
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Your Stripe checkout of ৳1000 was verified.
                </p>
                <span className="text-[8px] text-slate-350 block mt-1">
                  2 mins ago
                </span>
              </div>
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-750/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Consultation Scheduled
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Appointment with Dr. Sarah Jenkins is booked for 20th Jun.
                </p>
                <span className="text-[8px] text-slate-350 block mt-1">
                  10 mins ago
                </span>
              </div>
              <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Welcome to CarePulse
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Profile set up completed successfully. Get started online.
                </p>
                <span className="text-[8px] text-slate-350 block mt-1">
                  1 hour ago
                </span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Avatar Trigger */}
        <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-3">
          <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
            <img
              src={
                currentProfile?.profilePhoto ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40"
              }
              alt={currentProfile?.name || "Profile"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">
              {currentProfile?.name}
            </span>
            <span
              className={`inline-block border text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${getRoleBadgeColor(activeRole)}`}
            >
              {activeRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
