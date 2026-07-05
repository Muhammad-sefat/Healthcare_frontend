"use client";

import React, { Suspense } from "react";
import { PaymentSuccess } from "@/features/dashboard/patient/components/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-955">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccess />
    </Suspense>
  );
}
