import React from "react";
import Link from "next/link";

export function CTASection() {
  return (
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
  );
}
