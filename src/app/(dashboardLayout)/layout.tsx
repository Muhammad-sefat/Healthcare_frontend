"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { Role } from "@/types";
import { 
  Stethoscope, 
  Menu, 
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
  Bell,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, activeRole, currentProfile, switchRole, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

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

  // Sidebar Links based on Role
  const getSidebarLinks = () => {
    const common = [{ label: "Dashboard Overview", icon: <LayoutDashboard className="h-5 w-5" />, tab: "overview" }];
    
    if (activeRole === Role.PATIENT) {
      return [
        ...common,
        { label: "Book Consultation", icon: <Calendar className="h-5 w-5" />, tab: "book" },
        { label: "My Appointments", icon: <Clock className="h-5 w-5" />, tab: "appointments" },
        { label: "My Prescriptions", icon: <FileText className="h-5 w-5" />, tab: "prescriptions" },
        { label: "Health Profile & Reports", icon: <User className="h-5 w-5" />, tab: "profile" }
      ];
    }
    
    if (activeRole === Role.DOCTOR) {
      return [
        ...common,
        { label: "Manage Claimed Slots", icon: <Clock className="h-5 w-5" />, tab: "slots" },
        { label: "Appointments & Patients", icon: <Calendar className="h-5 w-5" />, tab: "doctor-appointments" },
        { label: "Prescription Records", icon: <FileText className="h-5 w-5" />, tab: "doctor-prescriptions" },
        { label: "Patient Reviews", icon: <Star className="h-5 w-5" />, tab: "doctor-reviews" }
      ];
    }
    
    if (activeRole === Role.ADMIN) {
      return [
        ...common,
        { label: "Specialty Registry", icon: <Tags className="h-5 w-5" />, tab: "admin-specialties" },
        { label: "Generate Schedules", icon: <Clock className="h-5 w-5" />, tab: "admin-schedules" },
        { label: "Doctor Directory CRUD", icon: <UserPlus className="h-5 w-5" />, tab: "admin-doctors" },
        { label: "User Moderation", icon: <Users className="h-5 w-5" />, tab: "admin-users" },
        { label: "Clinic Billing Audit", icon: <DollarSign className="h-5 w-5" />, tab: "admin-audit" }
      ];
    }
    
    if (activeRole === Role.SUPER_ADMIN) {
      return [
        ...common,
        { label: "Create Admin Profile", icon: <Shield className="h-5 w-5" />, tab: "super-admins" },
        { label: "User Controls", icon: <Users className="h-5 w-5" />, tab: "super-users" }
      ];
    }

    return common;
  };

  const menuLinks = getSidebarLinks();

  const handleTabClick = (tab: string) => {
    setSidebarOpen(false);
    
    // If clicking "book" or "profile" when on dashboard, we will handle it via search params
    if (tab === "book") {
      router.push("/doctors");
    } else {
      router.push(`/dashboard?tab=${tab}`);
    }
  };

  const handleRoleSwitch = (role: Role) => {
    switchRole(role);
    setRoleMenuOpen(false);
    router.push("/dashboard?tab=overview");
  };

  const getRoleBadgeColor = (role: Role) => {
    if (role === Role.SUPER_ADMIN) return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-350 border-rose-200 dark:border-rose-900/40";
    if (role === Role.ADMIN) return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-350 border-purple-200 dark:border-purple-900/40";
    if (role === Role.DOCTOR) return "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-350 border-sky-200 dark:border-sky-900/40";
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-350 border-emerald-200 dark:border-emerald-900/40";
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-850 flex-shrink-0">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-850">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-white shadow-xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CarePulse
            </span>
          </Link>
        </div>

        {/* User Info Quick View */}
        <div className="p-5 border-b border-slate-55 dark:border-slate-850/50 flex gap-3 items-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
            <img
              src={currentProfile?.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40"}
              alt={currentProfile?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">{currentProfile?.name}</span>
            <span className={`inline-block border text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${getRoleBadgeColor(activeRole)}`}>
              {activeRole.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleTabClick(link.tab)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 hover:text-slate-900 transition-all cursor-pointer"
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>

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
                  src={currentProfile?.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40"}
                  alt={currentProfile?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="block font-bold text-xs text-slate-900 dark:text-white truncate">{currentProfile?.name}</span>
                <span className={`inline-block border text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${getRoleBadgeColor(activeRole)}`}>
                  {activeRole.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTabClick(link.tab)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>

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
                onClick={() => { logout(); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-30 shadow-xs">
          
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
            
            {/* Developer Toolbar Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Dev Switcher</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 font-bold text-slate-400 border-b border-slate-50 dark:border-slate-750 uppercase tracking-wider text-[9px]">
                    Select Active Role
                  </div>
                  {Object.values(Role).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 font-semibold cursor-pointer ${
                        activeRole === r ? "text-primary font-bold bg-primary/5" : "text-slate-600 dark:text-slate-350"
                      }`}
                    >
                      {r.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Feed Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="p-2.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 rounded-full transition-all cursor-pointer relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 font-bold text-slate-450 border-b border-slate-50 dark:border-slate-750 uppercase tracking-wider text-[9px] flex justify-between items-center">
                    <span>Notifications Feed</span>
                    <span className="text-[10px] text-primary lowercase font-medium cursor-pointer">Mark read</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-750/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Payment Verified</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Your Stripe checkout of ৳1000 was verified.</p>
                      <span className="text-[8px] text-slate-350 block mt-1">2 mins ago</span>
                    </div>
                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-750/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Consultation Scheduled</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Appointment with Dr. Sarah Jenkins is booked for 20th Jun.</p>
                      <span className="text-[8px] text-slate-350 block mt-1">10 mins ago</span>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Welcome to CarePulse</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Profile set up completed successfully. Get started online.</p>
                      <span className="text-[8px] text-slate-350 block mt-1">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <div className="flex items-center gap-2 border-l border-slate-100 dark:border-slate-800 pl-3">
              <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                <img
                  src={currentProfile?.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40"}
                  alt={currentProfile?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden lg:block text-xs font-bold text-slate-800 dark:text-slate-250 truncate max-w-[100px]">
                {currentProfile?.name.split(" ")[0]}
              </span>
            </div>

          </div>
        </header>

        {/* Content Body Pane */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
