"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { Stethoscope, LogOut, Menu, X, ArrowRight, User, LayoutDashboard } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function Navbar() {
  const { currentUser, logout, currentProfile } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = currentProfile?.name || (currentUser as any)?.name || "User";
  const userEmail = currentProfile?.email || currentUser?.email || "";

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Find Doctors", href: "/doctors" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Medicine", href: "/medicine" },
    { name: "Health Plans", href: "/health-plans" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      {" "}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-150 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-xl text-white shadow-md">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  CarePulse
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-4">
              {currentUser ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:ring-2 hover:ring-primary/20 transition-all duration-200 cursor-pointer overflow-hidden group">
                      {currentProfile?.profilePhoto ? (
                        <img
                          src={currentProfile.profilePhoto}
                          alt={userName || "Profile"}
                          className="h-full w-full rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {getInitials(userName) || <User className="h-5 w-5 text-slate-500" />}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl z-50">
                    <div className="flex flex-col gap-3">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 px-2 py-1.5">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                          {currentProfile?.profilePhoto ? (
                            <img
                              src={currentProfile.profilePhoto}
                              alt={userName || "Profile"}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(userName) || <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {userEmail}
                          </p>
                          {currentUser?.role && (
                            <span className="mt-1 inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 uppercase tracking-wider">
                              {currentUser.role.toLowerCase().replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <hr className="border-slate-150 dark:border-slate-800" />
                      
                      {/* Menu Actions */}
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-850 dark:hover:text-white transition-all"
                        >
                          <LayoutDashboard className="h-4.5 w-4.5 text-slate-500" />
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={logout}
                          className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        >
                          <LogOut className="h-4.5 w-4.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-100 dark:border-slate-800 my-4" />
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium shadow-md"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 py-3 rounded-xl font-medium text-slate-500 hover:text-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-primary text-white py-3 rounded-xl font-medium shadow-md shadow-primary/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
