"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stethoscope, Lock, CheckCircle2, ArrowRight } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must match")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"]
});

type ResetFormData = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetFormData) => {
    console.log("Reset Password Submission Payload:", { email, password: data.password });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
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
            Set new password
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Define a secure password for profile <span className="font-semibold">{email}</span>.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Password Updated!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your credentials have been successfully updated in memory. Use your new password to sign in.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              Sign In Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Credentials Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
