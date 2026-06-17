"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/providers/authProvider";
import { Stethoscope, Lock, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";

const changeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must match")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords must match",
  path: ["confirmPassword"]
});

type ChangeFormData = z.infer<typeof changeSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { changePassword, needsPasswordChange } = useAuth();
  
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ChangeFormData>({
    resolver: zodResolver(changeSchema)
  });

  const onSubmit = async (data: ChangeFormData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    changePassword(data.currentPassword, data.newPassword);
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
            Change your password
          </h2>
          {needsPasswordChange ? (
            <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-3 flex gap-2 items-start text-left text-xs text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>First-Time Login Security:</strong> Please change your temporary credentials before proceeding to your dashboard.
              </span>
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-slate-400">
              Update password credentials for your security.
            </p>
          )}
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Password Updated!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your account password has been successfully updated in memory.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="w-full bg-primary hover:bg-primary/95 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Credentials Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  {...register("currentPassword")}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive font-medium">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  {...register("newPassword")}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-destructive font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                Confirm New Password
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
                  Change Password
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
