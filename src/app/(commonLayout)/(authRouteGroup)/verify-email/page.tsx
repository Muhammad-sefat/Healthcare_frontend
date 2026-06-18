import React, { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
