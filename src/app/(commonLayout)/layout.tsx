"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { Stethoscope, LogOut, Menu, X, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout } = useAuth();
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-150 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-xl text-white shadow-md">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  CarePulse
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-4">
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
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/95 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
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
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

      {/* Main Content */}
      <main className="flex-grow flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1 - Brand Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary p-2 rounded-xl text-white">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  CarePulse
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Empowering patients and doctors with digital tools for accessible, high-quality, and remote healthcare consultations.
              </p>
              <div className="text-xs text-slate-500 leading-normal">
                CarePulse Medical Center<br />
                Dhaka, Bangladesh<br />
                support@carepulse.com
              </div>
            </div>

            {/* Column 2 - Specialties */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Specialties</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/doctors" className="hover:text-white transition-colors">Cardiology</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Neurology</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Pediatrics</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Orthopedics</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Dermatology</Link></li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">Our Doctors</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Doctor Portal</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Diagnostics Portal</Link></li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Stay Connected</h4>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Subscribe to our newsletter for health tips, specialty openings, and hospital announcements.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); console.log("Newsletter sub"); }} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  className="bg-slate-800 text-white rounded-xl px-4 py-2 text-sm w-full border border-slate-700 focus:outline-hidden focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <hr className="border-slate-800 mb-8" />

          {/* Copyright section */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} CarePulse Healthcare Systems. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
              <a href="#" className="hover:text-slate-400">Cookies Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
