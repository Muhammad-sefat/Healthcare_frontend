"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  FlaskConical, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin,
  AlertCircle
} from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface TestItem {
  id: string;
  name: string;
  category: "blood" | "imaging" | "cardiology" | "preventive";
  description: string;
  requirements: string;
  duration: string;
  price: number;
  icon: React.ReactNode;
}

export function DiagnosticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "blood" | "imaging" | "cardiology" | "preventive">("all");
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Booking Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 11:00 AM");
  const [homeCollection, setHomeCollection] = useState(true);
  const [formError, setFormError] = useState("");

  const categories = [
    { id: "all", label: "All Tests" },
    { id: "blood", label: "Blood Tests" },
    { id: "imaging", label: "Imaging & Scans" },
    { id: "cardiology", label: "Cardiology" },
    { id: "preventive", label: "Preventive Packages" }
  ] as const;

  const tests: TestItem[] = [
    {
      id: "diag-1",
      name: "Complete Blood Count (CBC)",
      category: "blood",
      description: "Evaluates overall health and detects a wide range of disorders including anemia and leukemia.",
      requirements: "No specific preparation required.",
      duration: "Results in 12 Hours",
      price: 450,
      icon: <FlaskConical className="h-5 w-5 text-rose-500" />
    },
    {
      id: "diag-2",
      name: "Lipid Profile (Cholesterol Test)",
      category: "blood",
      description: "Measures total cholesterol, LDL, HDL, and triglycerides to evaluate cardiovascular risk.",
      requirements: "10-12 hours of overnight fasting required.",
      duration: "Results in 24 Hours",
      price: 850,
      icon: <FlaskConical className="h-5 w-5 text-rose-500" />
    },
    {
      id: "diag-3",
      name: "MRI Brain (Contrast/Non-Contrast)",
      category: "imaging",
      description: "High-resolution imaging to evaluate structural brain abnormalities, stroke, tumor, or headaches.",
      requirements: "Remove all metal objects. Previous medical reports recommended.",
      duration: "Results in 36 Hours",
      price: 8500,
      icon: <Activity className="h-5 w-5 text-indigo-500" />
    },
    {
      id: "diag-4",
      name: "HRCT Chest (High Resolution CT)",
      category: "imaging",
      description: "Advanced CT scan providing detailed images of lung parenchyma for chronic respiratory issues.",
      requirements: "No metal. Fasting for 4 hours if contrast is prescribed.",
      duration: "Results in 24 Hours",
      price: 6500,
      icon: <Activity className="h-5 w-5 text-indigo-500" />
    },
    {
      id: "diag-5",
      name: "12-Lead Electrocardiogram (ECG)",
      category: "cardiology",
      description: "Standard cardiac tracing to monitor heart rhythm and electrical conduction patterns.",
      requirements: "Comfortable loose-fitting clothing recommended.",
      duration: "Results in 1 Hour",
      price: 600,
      icon: <Heart className="h-5 w-5 text-emerald-500" />
    },
    {
      id: "diag-6",
      name: "2D Echocardiogram (Color Doppler)",
      category: "cardiology",
      description: "Ultrasound imaging of the heart valves and muscles to assess cardiac ejection fraction.",
      requirements: "No special preparation needed.",
      duration: "Results in 2 Hours",
      price: 2500,
      icon: <Heart className="h-5 w-5 text-emerald-500" />
    },
    {
      id: "diag-7",
      name: "CarePulse Premium Health Checkup",
      category: "preventive",
      description: "Comprehensive package consisting of 68 parameters including Liver, Kidney, Blood Sugar, and Thyroid profiles.",
      requirements: "12 hours overnight fasting mandatory.",
      duration: "Results in 24 Hours",
      price: 4999,
      icon: <ShieldCheck className="h-5 w-5 text-amber-500" />
    },
    {
      id: "diag-8",
      name: "Diabetes Care Screening Package",
      category: "preventive",
      description: "HbA1c, Fasting Blood Glucose, Urine Microalbumin, and Creatinine checks to track diabetic wellness.",
      requirements: "10 hours fasting required.",
      duration: "Results in 12 Hours",
      price: 1500,
      icon: <ShieldCheck className="h-5 w-5 text-amber-500" />
    }
  ];

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            test.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || test.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleOpenBooking = (test: TestItem) => {
    setSelectedTest(test);
    setBookingModalOpen(true);
    setFullName("");
    setPhone("");
    setDate("");
    setFormError("");
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date) {
      setFormError("Please fill in all the required fields.");
      return;
    }
    setFormError("");
    setBookingModalOpen(false);
    setSuccessModalOpen(true);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Banner Section */}
        <div className="bg-gradient-to-br from-primary/10 via-blue-50/50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Diagnostic & Pathology Services
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Get Lab Tests Done from the Comfort of Your Home
            </h1>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
              Book sample collections online, consult verified doctors, and receive highly detailed, certified reports within hours. Experience seamless diagnostic assessments.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-xl shadow-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>NABL Accredited Labs</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-xl shadow-xs">
              <Clock className="h-5 w-5 text-primary" />
              <span>Report in 12-24 Hrs</span>
            </div>
          </div>
        </div>

        {/* Search and Category Filter Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-955 dark:text-white">
              Browse Diagnostic Tests
            </h2>
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tests, symptoms, or packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Grid */}
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div 
                key={test.id} 
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Test Header */}
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl group-hover:scale-105 transition-transform">
                      {test.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {test.category === "blood" && "Blood Test"}
                      {test.category === "imaging" && "Scan / Radiology"}
                      {test.category === "cardiology" && "Cardiology"}
                      {test.category === "preventive" && "Health Package"}
                    </span>
                  </div>

                  {/* Test Info */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {test.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Logistics Detail */}
                  <div className="text-[11px] text-slate-450 dark:text-slate-400 font-medium space-y-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1.5 leading-normal">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Pre-test: {test.requirements}
                    </span>
                  </div>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850 mt-6 pt-4">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Test Price</span>
                    <span className="text-base font-extrabold text-primary">৳{test.price}</span>
                  </div>
                  <button 
                    onClick={() => handleOpenBooking(test)}
                    className="bg-primary/5 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Book Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl space-y-4">
            <FlaskConical className="h-12 w-12 text-slate-300 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Lab Tests Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any diagnostic checks matching your search query. Please try searching something else.
            </p>
          </div>
        )}
      </div>

      {/* Booking Form Dialog */}
      <CustomModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Diagnostic Booking Details"
      >
        {selectedTest && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex justify-between text-xs text-slate-550 gap-4">
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-350">Selected Checkup:</span>
                <span className="font-medium text-slate-900 dark:text-white block mt-0.5">{selectedTest.name}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="block font-bold text-slate-700 dark:text-slate-350">Test Charge:</span>
                <span className="text-primary font-extrabold text-sm block mt-0.5">৳{selectedTest.price}</span>
              </div>
            </div>

            {formError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 p-3 rounded-xl flex gap-2 items-start text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +88017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Preferred Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="home-collection"
                  checked={homeCollection}
                  onChange={(e) => setHomeCollection(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
                />
                <label htmlFor="home-collection" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  Opt for Free Home Sample Collection
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </CustomModal>

      {/* Booking Success Dialog */}
      <CustomModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Appointment Confirmed!"
      >
        <div className="text-center py-6 space-y-4">
          <div className="h-16 w-16 bg-green-50 dark:bg-green-955 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lab Test Registered</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Dr. Alex has scheduled a representative to verify details. You will receive a confirmation phone call on <span className="font-bold text-primary">{phone}</span> to finalize your sample collection slot on <span className="font-bold text-slate-700 dark:text-slate-350">{date}</span>.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="bg-primary hover:bg-primary/95 text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors w-full sm:w-auto"
            >
              Done
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default DiagnosticsPage;
