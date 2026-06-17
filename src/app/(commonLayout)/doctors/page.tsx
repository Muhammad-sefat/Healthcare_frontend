"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CommonLayout from "../layout";
import { useAuth } from "@/providers/authProvider";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  MapPin, 
  Clock, 
  GraduationCap, 
  ArrowRight,
  Filter
} from "lucide-react";

function DoctorDirectoryContent() {
  const { doctors, specialties } = useAuth();
  const searchParams = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [maxFee, setMaxFee] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>("rating"); // "rating" | "experience" | "fee_low" | "fee_high"

  // Load URL query parameters if present
  useEffect(() => {
    const specParam = searchParams.get("specialty");
    const searchParam = searchParams.get("search");
    if (specParam) setSelectedSpecialty(specParam);
    if (searchParam) setSearchTerm(searchParam);
  }, [searchParams]);

  // Filter and sort doctor list
  const filteredDoctors = doctors
    .filter((doc) => {
      if (doc.isDeleted) return false;
      
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.currentWorkplace.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = 
        !selectedSpecialty || 
        doc.specialties.some((ds) => ds.specialtyId === selectedSpecialty);

      const matchesFee = doc.appointmentFee <= maxFee;

      return matchesSearch && matchesSpecialty && matchesFee;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.averageRating - a.averageRating;
      if (sortBy === "experience") return b.experience - a.experience;
      if (sortBy === "fee_low") return a.appointmentFee - b.appointmentFee;
      if (sortBy === "fee_high") return b.appointmentFee - a.appointmentFee;
      return 0;
    });

  return (
    <CommonLayout>
      <div className="bg-slate-50 dark:bg-slate-950 py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Find & Book Doctor Consultations
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Search the directory of premium clinical staff, customize filter tags, review credentials, and secure your video session slots.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Filters Sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-850">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-slate-950 dark:text-white text-base">Filter Search</h2>
              </div>

              {/* Specialty Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Maximum Fee Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-455 dark:text-slate-500">
                  <span>Max Fee</span>
                  <span className="text-primary font-bold">৳{maxFee}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>৳500</span>
                  <span>৳3,000</span>
                </div>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="experience">Years of Experience</option>
                  <option value="fee_low">Price: Low to High</option>
                  <option value="fee_high">Price: High to Low</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("");
                  setMaxFee(2000);
                  setSortBy("rating");
                }}
                className="w-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 rounded-xl text-xs font-bold text-slate-505 hover:text-slate-800 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>

            {/* Doctor Listings Grid */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by doctor name, workplace, degree, or designation..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xs text-sm focus:outline-hidden focus:border-primary transition-colors dark:text-white"
                />
              </div>

              {/* Active Filters Summary */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div>
                  Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredDoctors.length}</span> doctors available
                </div>
              </div>

              {/* Doctors Grid */}
              {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full"
                    >
                      {/* Doctor Profile Header */}
                      <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                        <img
                          src={doc.profilePhoto}
                          alt={doc.name}
                          className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-950 dark:text-white text-base hover:text-primary">
                            <Link href={`/doctors/${doc.id}`}>{doc.name}</Link>
                          </h3>
                          <p className="text-xs text-slate-505 font-medium">{doc.designation}</p>
                          <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {doc.specialties[0]?.specialty?.title}
                          </span>
                        </div>
                      </div>

                      {/* Credentials */}
                      <div className="py-4 space-y-2 text-xs text-slate-500 flex-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="line-clamp-1">{doc.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="line-clamp-1">{doc.currentWorkplace}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span>{doc.experience} Years Experience</span>
                        </div>
                      </div>

                      {/* Ratings and Fees Card */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between mb-4">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Consultation Fee</span>
                          <span className="text-base font-bold text-primary">৳{doc.appointmentFee}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Average Rating</span>
                          <span className="text-sm font-bold text-amber-500 flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 fill-amber-500" />
                            {doc.averageRating}
                          </span>
                        </div>
                      </div>

                      {/* Book CTA */}
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-primary/15 hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Book Appointment
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-150 dark:border-slate-800 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full inline-block">
                    <Filter className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Doctors Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    We couldn't find any doctor matching your current filters. Try relaxing your fee restrictions or clearing your search term.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSpecialty("");
                      setMaxFee(2000);
                      setSortBy("rating");
                    }}
                    className="bg-primary text-white hover:bg-primary/95 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}

export default function DoctorDirectory() {
  return (
    <Suspense fallback={
      <CommonLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </CommonLayout>
    }>
      <DoctorDirectoryContent />
    </Suspense>
  );
}

