"use client";

import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function Footer() {
  return (
    <>
      {" "}
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
                Empowering patients and doctors with digital tools for
                accessible, high-quality, and remote healthcare consultations.
              </p>
              <div className="text-xs text-slate-500 leading-normal">
                CarePulse Medical Center
                <br />
                Dhaka, Bangladesh
                <br />
                support@carepulse.com
              </div>
            </div>

            {/* Column 2 - Specialties */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Specialties
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Cardiology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Neurology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Pediatrics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Orthopedics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Dermatology
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctors"
                    className="hover:text-white transition-colors"
                  >
                    Our Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Doctor Portal
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Diagnostics Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                Stay Connected
              </h4>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Subscribe to our newsletter for health tips, specialty openings,
                and hospital announcements.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Newsletter sub");
                }}
                className="flex gap-2"
              >
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
              &copy; {new Date().getFullYear()} CarePulse Healthcare Systems.
              All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-400">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-400">
                Cookies Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
