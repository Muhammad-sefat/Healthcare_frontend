"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/providers/authProvider";
import { Role } from "@/types";
import { 
  Stethoscope, 
  Mail, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building,
  Heart,
  KeyRound
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "password123" // mock default
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Guess role from email for mock database, or default to Patient
    let role = Role.PATIENT;
    if (data.email.includes("sarah")) role = Role.DOCTOR;
    else if (data.email.includes("admin")) role = Role.ADMIN;
    else if (data.email.includes("super") || data.email.includes("sefat")) role = Role.SUPER_ADMIN;

    const success = login(data.email, role);
    if (success) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    } else {
      setLoginError("This user account is BLOCKED. Contact system admins.");
    }
  };

  const handleQuickLogin = (email: string, role: Role) => {
    setValue("email", email);
    login(email, role);
    const redirect = searchParams.get("redirect") || "/dashboard";
    router.push(redirect);
  };

  const demoAccounts = [
    {
      roleName: "Patient Portal",
      email: "johndoe@gmail.com",
      role: Role.PATIENT,
      icon: <Heart className="h-4 w-4 text-emerald-500" />,
      bg: "bg-emerald-50 hover:bg-emerald-100/70 dark:bg-emerald-950/20 border-emerald-150 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300"
    },
    {
      roleName: "Doctor Portal",
      email: "sarah.j@clinic.com",
      role: Role.DOCTOR,
      icon: <Stethoscope className="h-4 w-4 text-sky-500" />,
      bg: "bg-sky-50 hover:bg-sky-100/70 dark:bg-sky-950/20 border-sky-150 dark:border-sky-900/40 text-sky-700 dark:text-sky-300"
    },
    {
      roleName: "Clinic Admin",
      email: "admin.alex@clinic.com",
      role: Role.ADMIN,
      icon: <Building className="h-4 w-4 text-purple-500" />,
      bg: "bg-purple-50 hover:bg-purple-100/70 dark:bg-purple-950/20 border-purple-150 dark:border-purple-900/40 text-purple-700 dark:text-purple-300"
    },
    {
      roleName: "Super Admin",
      email: "super.sefat@clinic.com",
      role: Role.SUPER_ADMIN,
      icon: <ShieldCheck className="h-4 w-4 text-rose-500" />,
      bg: "bg-rose-50 hover:bg-rose-100/70 dark:bg-rose-950/20 border-rose-150 dark:border-rose-900/40 text-rose-700 dark:text-rose-300"
    }
  ];

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
            Sign in to your account
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Or{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              register a new patient profile
            </Link>
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl p-3 flex gap-2 items-center text-xs text-red-600 dark:text-red-400 font-semibold animate-pulse">
            <span>{loginError}</span>
          </div>
        )}

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
                {...register("email")}
                placeholder="johndoe@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>
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
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Selector */}
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Quick Demo Sign In</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickLogin(acc.email, acc.role)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${acc.bg}`}
              >
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold leading-tight">{acc.roleName}</span>
                  <span className="block text-[9px] opacity-75 font-mono truncate max-w-[120px]">{acc.email}</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg flex-shrink-0 shadow-xs">
                  {acc.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
