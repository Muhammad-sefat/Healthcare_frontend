"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { getMe } from "../api/auth.api";
import { useAuth } from "@/providers/authProvider";
import { toast } from "sonner";
import { Stethoscope, ShieldAlert, ArrowRight } from "lucide-react";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be exactly 6 digits")
});

type VerifyFormData = z.infer<typeof verifySchema>;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const verifyEmailMutation = useVerifyEmail();
  const { setRealSession } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema)
  });

  const onSubmit = async (data: VerifyFormData) => {
    setErrorMsg(null);
    try {
      await verifyEmailMutation.mutateAsync({
        email: email as string,
        otp: data.code,
      });

      toast.success("Email verified successfully!");

      // Fetch fresh user profile if we have a token stored in localStorage
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (savedToken) {
        try {
          const meResponse = await getMe();
          if (meResponse && meResponse.success) {
            const userData = meResponse.data;
            let profile = null;
            if (userData.role === "PATIENT") {
              profile = userData.patient;
            } else if (userData.role === "DOCTOR") {
              profile = userData.doctor;
            } else {
              profile = userData.admin;
            }
            setRealSession(userData, profile);
          }
        } catch (meErr) {
          console.error("Error fetching me after verification:", meErr);
        }
        router.push("/dashboard");
      } else {
        // Redirect to login if token is not set
        router.push("/login");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Invalid or expired verification code.");
      toast.error(err?.response?.data?.message || "Verification failed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CarePulse
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Verify verification code
          </h2>
          <p className="mt-1.5 text-xs text-slate-450 dark:text-slate-400 font-medium">
          Please enter the code below to verify your account. 
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl p-3 flex gap-2 items-center text-xs text-red-650 dark:text-red-400 font-semibold">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* OTP Code Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
              Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              {...register("code")}
              placeholder="••••••"
              className="w-full text-center tracking-[0.5em] font-mono text-lg px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-primary transition-colors animate-none"
            />
            {errors.code && (
              <p className="text-[11px] text-destructive font-medium text-center">{errors.code.message}</p>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={verifyEmailMutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {verifyEmailMutation.isPending ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Verifying Code...
              </>
            ) : (
              <>
                Confirm Verification Code
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
            Return to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
