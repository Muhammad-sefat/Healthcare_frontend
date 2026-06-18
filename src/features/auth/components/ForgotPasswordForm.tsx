"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stethoscope, Mail, ArrowRight } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: ForgotFormData) => {
    // Simulate sending OTP
    console.log("Forgot Password Request Payload:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to verify email OTP
    router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
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
            Reset your password
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            We will send a 6-digit OTP code to verify your profile credentials.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                required
                {...register("email")}
                placeholder="johndoe@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
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
                Sending OTP...
              </>
            ) : (
              <>
                Send Verification Code
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
