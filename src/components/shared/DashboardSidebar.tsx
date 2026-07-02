/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { Role } from "@/types";
import {
  Stethoscope,
  X,
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Clock,
  Tags,
  UserPlus,
  Users,
  DollarSign,
  Shield,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: DashboardSidebarProps) {
  const router = useRouter();
  const { currentUser, activeRole, currentProfile, logout } = useAuth();

  if (!currentUser || !activeRole) return null;

  const getSidebarLinks = () => {
    const common = [
      {
        label: "Dashboard Overview",
        icon: <LayoutDashboard className="h-5 w-5" />,
        tab: "overview",
      },
    ];

    if (activeRole === Role.PATIENT) {
      return [
        ...common,
        {
          label: "Book Consultation",
          icon: <Calendar className="h-5 w-5" />,
          tab: "book",
        },
        {
          label: "My Appointments",
          icon: <Clock className="h-5 w-5" />,
          tab: "appointments",
        },
        {
          label: "My Prescriptions",
          icon: <FileText className="h-5 w-5" />,
          tab: "prescriptions",
        },
        {
          label: "Health Profile & Reports",
          icon: <User className="h-5 w-5" />,
          tab: "profile",
        },
      ];
    }

    if (activeRole === Role.DOCTOR) {
      return [
        ...common,
        {
          label: "Manage Claimed Slots",
          icon: <Clock className="h-5 w-5" />,
          tab: "slots",
        },
        {
          label: "Appointments & Patients",
          icon: <Calendar className="h-5 w-5" />,
          tab: "doctor-appointments",
        },
        {
          label: "Prescription Records",
          icon: <FileText className="h-5 w-5" />,
          tab: "doctor-prescriptions",
        },
        {
          label: "Patient Reviews",
          icon: <Star className="h-5 w-5" />,
          tab: "doctor-reviews",
        },
      ];
    }

    if (activeRole === Role.ADMIN) {
      return [
        ...common,
        {
          label: "Specialty Registry",
          icon: <Tags className="h-5 w-5" />,
          tab: "admin-specialties",
        },
        {
          label: "Doctors",
          icon: <UserPlus className="h-5 w-5" />,
          tab: "admin-doctors",
        },
        {
          label: "Generate Schedules",
          icon: <Clock className="h-5 w-5" />,
          tab: "admin-schedules",
        },
        {
          label: "Users Moderation",
          icon: <Users className="h-5 w-5" />,
          tab: "admin-users",
        },
        {
          label: "Clinic Billing Audit",
          icon: <DollarSign className="h-5 w-5" />,
          tab: "admin-audit",
        },
      ];
    }

    if (activeRole === Role.SUPER_ADMIN) {
      return [
        ...common,
        {
          label: "Create Admin Profile",
          icon: <Shield className="h-5 w-5" />,
          tab: "super-admins",
        },
        {
          label: "User Controls",
          icon: <Users className="h-5 w-5" />,
          tab: "super-users",
        },
      ];
    }

    return common;
  };

  const menuLinks = getSidebarLinks();

  const handleTabClick = (tab: string) => {
    setSidebarOpen(false);
    const rolePath = activeRole.toLowerCase().replace("_", "-");
    if (tab === "overview") {
      router.push(`/dashboard/${rolePath}`);
    } else {
      router.push(`/dashboard/${rolePath}/${tab}`);
    }
  };

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
    <>
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-850 shrink-0">
        {/* Logo */}
        <div className="h-18 flex items-center px-6 border-b border-slate-100 dark:border-slate-850">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white shadow-xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CarePulse
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <Suspense
          fallback={
            <div className="flex-1 px-4 py-4 text-center text-xs text-slate-400">
              Loading navigation...
            </div>
          }
        >
          <SidebarNav menuLinks={menuLinks} handleTabClick={handleTabClick} />
        </Suspense>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
          <Link
            href="/change-password"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Settings className="h-4 w-4" />
            Change Password
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Sidebar Drawer */}
          <div className="relative w-64 bg-white dark:bg-slate-900 flex flex-col max-w-xs z-10">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-850">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg text-white">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  CarePulse
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 p-2 hover:bg-slate-50 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="p-5 border-b border-slate-55 dark:border-slate-850/50 flex gap-3 items-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden">
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

            {/* Links */}
            <Suspense
              fallback={
                <div className="flex-1 px-4 py-6 text-center text-xs text-slate-400">
                  Loading navigation...
                </div>
              }
            >
              <SidebarNav
                menuLinks={menuLinks}
                handleTabClick={handleTabClick}
              />
            </Suspense>

            <div className="p-4 border-t border-slate-150 dark:border-slate-850 space-y-2">
              <Link
                href="/change-password"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-400"
              >
                <Settings className="h-4 w-4" />
                Change Password
              </Link>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface SidebarNavProps {
  menuLinks: { label: string; icon: React.ReactNode; tab: string }[];
  handleTabClick: (tab: string) => void;
}

function SidebarNav({ menuLinks, handleTabClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      {menuLinks.map((link, idx) => {
        const isActive =
          link.tab === "overview"
            ? pathname.endsWith("/patient") ||
              pathname.endsWith("/doctor") ||
              pathname.endsWith("/admin") ||
              pathname.endsWith("/super-admin")
            : pathname.endsWith(`/${link.tab}`);
        return (
          <button
            key={idx}
            onClick={() => handleTabClick(link.tab)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer ${
              isActive
                ? "bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary"
                : "text-slate-655 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 hover:text-slate-900"
            }`}
          >
            {link.icon}
            {link.label}
          </button>
        );
      })}
    </nav>
  );
}
