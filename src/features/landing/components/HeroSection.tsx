"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSpecialties } from "@/features/landing/hooks/useSpecialties";
import { motion } from "framer-motion";
import { Search, ArrowRight, CheckCircle2, TrendingUp, ChevronDown } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { data: specialtiesResponse } = useSpecialties();
  const specialtiesData = specialtiesResponse?.data || [];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Search state
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchName) query.set("search", searchName);
    if (selectedSpecialty) query.set("specialty", selectedSpecialty);
    router.push(`/doctors?${query.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-950 pt-10 pb-20 sm:pt-16 sm:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Modern Healthcare, Simplified
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white"
            >
              Book Trusted <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Doctors Online</span> & Get Consultation
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Skip the waiting rooms. Connect with certified medical practitioners via high-definition video consultations, receive prescription guides, and manage all your reports in one secure platform.
            </motion.p>

            {/* Search Widget */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-4 max-w-2xl mx-auto lg:mx-0 border border-slate-150 dark:border-slate-800"
            >
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-450" />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search doctor by name or qualification..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>
                <div className="relative sm:w-52">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
                  >
                    <span className={selectedSpecialty ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                      {selectedSpecialty 
                        ? specialtiesData?.find(s => s.id === selectedSpecialty)?.title 
                        : "Select Specialty"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto py-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSpecialty("");
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          Select Specialty
                        </button>
                        {specialtiesData?.map(spec => (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => {
                              setSelectedSpecialty(spec.id);
                              setDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 ${
                              selectedSpecialty === spec.id
                                ? "text-primary font-bold bg-primary/5 dark:bg-primary/10"
                                : "text-slate-700 dark:text-slate-350"
                            }`}
                          >
                            <img src={spec.icon} alt={spec.title} className="h-4.5 w-4.5 object-contain opacity-75 animate-none" />
                            {spec.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* Quick Action Links */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm"
            >
              <Link href="/doctors" className="flex items-center gap-1 font-semibold text-primary hover:underline">
                Find Doctor Directory <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/register" className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Join as a Patient
              </Link>
            </motion.div>
          </div>

          {/* Hero Right Image / Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="lg:col-span-5 hidden lg:flex justify-center"
          >
            <div className="relative w-80 h-96 sm:w-96 sm:h-[450px]">
              {/* Background decorative circles */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-blue-500 rounded-3xl blur-2xl opacity-10 animate-pulse" />
              
              {/* Main doctor photo box with overlays */}
              <div className="relative w-full h-full bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                  alt="Doctor Consultation"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Metric 1 */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-950 p-2.5 rounded-xl text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-555 font-medium">Verified Staff Only</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">100% Certified Doctors</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
