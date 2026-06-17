"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommonLayout from "./(commonLayout)/layout";
import { useAuth } from "@/providers/authProvider";
import { motion } from "framer-motion";
import { 
  Search, 
  UserCheck, 
  Video, 
  FileText, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  HelpCircle,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { doctors, specialties } = useAuth();
  
  // Search state
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Filter out deleted doctors
  const activeDoctors = doctors.filter(d => !d.isDeleted).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchName) query.set("search", searchName);
    if (selectedSpecialty) query.set("specialty", selectedSpecialty);
    router.push(`/doctors?${query.toString()}`);
  };

  const steps = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Find a Doctor",
      desc: "Search by specialty, location, or name to find the right medical provider."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: "Book Appointment",
      desc: "Select a convenient time slot from the doctor's claimed availability calendar."
    },
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: "Video Consultation",
      desc: "Conduct safe, high-definition online video sessions from your dashboard."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Get Prescription",
      desc: "Receive digital clinical guidelines, prescriptions, and pdf downloads instantly."
    }
  ];

  const faqs = [
    {
      q: "How does the video call consultation work?",
      a: "Once you book an appointment, a 'Join Video Call' button will become active in your Patient Dashboard when the time arrives. Simply click it to launch the secure video panel directly in your browser without downloading extra software."
    },
    {
      q: "Can I pay with credit cards?",
      a: "Yes, CarePulse integrates with Stripe to handle secure card payments. You can choose to 'Pay and Book' immediately via credit card, or select 'Book and Pay Later' to settle the balance from your dashboard within 30 minutes."
    },
    {
      q: "How do I download my prescription?",
      a: "After the doctor completes your appointment and inputs instructions, it appears in the 'My Prescriptions' tab on your Patient Dashboard. You will see a detailed list with a 'Download PDF' option."
    },
    {
      q: "Can I manage multiple medical reports?",
      a: "Absolutely. In your Health Profile tab, there is a Medical Reports Uploader where you can drag and drop up to 5 medical record files (PDFs/Images) which your consulting doctors can view during appointments."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <CommonLayout>
      {/* 1. Hero Section */}
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
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Search doctor by name or qualification..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="sm:w-52">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.title}</option>
                      ))}
                    </select>
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
                      <div className="text-xs text-slate-500 font-medium">Verified Staff Only</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">100% Certified Doctors</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Specialties Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Consult by Medical Specialty
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Find specialists immediately across multiple disciplines. Our qualified doctors are ready to address your concerns online.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((spec) => (
              <Link
                key={spec.id}
                href={`/doctors?specialty=${spec.id}`}
                className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="h-16 w-16 bg-slate-50 group-hover:bg-primary/10 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-3 mb-4 transition-colors">
                  <img src={spec.icon} alt={spec.title} className="h-full w-full object-contain" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {spec.title}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1 dark:text-slate-500 font-medium">
                  View Doctors
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How CarePulse Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Four easy steps to connect with trusted clinical assistance. Our flow ensures rapid feedback and complete medical audit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative group text-center space-y-4">
                <div className="mx-auto h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shadow-xs border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-700 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Medical Specialists
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Highly recommended doctors available for online video consultations.
              </p>
            </div>
            <Link 
              href="/doctors" 
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all"
            >
              See All Doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Doctor Head */}
                <div className="p-6 pb-4 flex gap-4 items-center">
                  <img
                    src={doc.profilePhoto}
                    alt={doc.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-primary">
                      <Link href={`/doctors/${doc.id}`}>{doc.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{doc.designation}</p>
                    <p className="text-xs text-primary font-semibold mt-0.5">{doc.specialties[0]?.specialty?.title}</p>
                  </div>
                </div>

                {/* Info divider */}
                <div className="px-6 py-4 border-t border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Exp</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{doc.experience} Years</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fee</span>
                    <span className="font-bold text-sm text-primary">৳{doc.appointmentFee}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Rating</span>
                    <span className="font-bold text-sm text-amber-500 flex items-center justify-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {doc.averageRating}
                    </span>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-6 mt-auto flex flex-col gap-2">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {doc.qualification} &bull; Currently working as {doc.designation} at {doc.currentWorkplace}.
                  </p>
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="mt-4 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-3 rounded-xl text-xs font-bold tracking-wide transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Book Appointment
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">100+</div>
              <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Certified Doctors</div>
            </div>
            <div className="space-y-2">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">10K+</div>
              <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Registered Patients</div>
            </div>
            <div className="space-y-2">
              <Video className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">50K+</div>
              <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Consultations Done</div>
            </div>
            <div className="space-y-2">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-extrabold text-white">24/7</div>
              <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">Support Operations</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Clear answers to the most common questions about the CarePulse platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-150 dark:border-slate-700/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      {faq.q}
                    </span>
                    <span className="text-slate-400 ml-4">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      <p className="mt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Section */}
      <section className="py-20 bg-gradient-to-tr from-primary to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Ready to Book Your Consultation?
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Find qualified specialists, book within minutes, upload your health history, and conduct secure, remote consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/doctors"
                className="bg-white text-primary hover:bg-slate-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-black/10 transition-all cursor-pointer"
              >
                Find & Book Now
              </Link>
              <Link
                href="/register"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-white px-8 py-3.5 rounded-xl border border-white/30 font-semibold text-sm transition-all cursor-pointer"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </CommonLayout>
  );
}
