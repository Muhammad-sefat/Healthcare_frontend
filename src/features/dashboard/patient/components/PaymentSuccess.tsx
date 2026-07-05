"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const paymentId = searchParams.get("payment_id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-955">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 dark:bg-slate-955 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 animate-fadeIn text-center relative overflow-hidden">
        {/* Top Decorative Color Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Success Icon Animation container */}
        <div className="space-y-4">
          <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your consultation appointment has been successfully scheduled and payment has been processed.
            </p>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Dynamic transaction info metadata boxes */}
        {(appointmentId || paymentId) && (
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 text-left space-y-3.5 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[9px]">Status</span>
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-sm font-extrabold uppercase tracking-wide text-[9px] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Paid
              </span>
            </div>
            {appointmentId && (
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-450" /> Appointment ID
                </span>
                <span className="font-mono text-slate-850 dark:text-slate-200 truncate select-all">{appointmentId}</span>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold text-slate-400 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-slate-450" /> Payment Token
                </span>
                <span className="font-mono text-slate-850 dark:text-slate-200 truncate select-all">{paymentId}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions / CTA redirects */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/dashboard/patient/appointments"
            className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            Go to My Appointments
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 py-3.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
          >
            Return to Main Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
