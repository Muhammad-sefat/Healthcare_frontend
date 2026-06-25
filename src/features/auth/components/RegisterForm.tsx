/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stethoscope, User, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { registerSchema } from "../validation/register.schema";
import { RegisterSchema } from "../types/auth.type";
import { useRegister } from "../hooks/useRegister";
import { toast } from "sonner";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/providers/authProvider";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const registerMutation = useRegister();
  const { setRealSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PATIENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const response = await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      dispatch(
        loginSuccess({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        }),
      );

      setRealSession(response.data.user, response.data.patient);

      toast.success(response.message);

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
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
            Create patient account
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in to your account
            </Link>
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                {...formRegister("name")}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                {...formRegister("email")}
                placeholder="johndoe@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...formRegister("password")}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-450 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer focus:outline-hidden"
              >
                {showPassword ? (
                  <Eye className="h-4.5 w-4.5" />
                ) : (
                  <EyeOff className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role Radio Group Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider">
              Register As
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label
                className={`flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border cursor-pointer hover:border-primary dark:hover:border-primary transition-all text-xs font-bold ${
                  selectedRole === "PATIENT"
                    ? "border-primary bg-primary/5 text-primary dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                }`}
              >
                <input
                  type="radio"
                  value="PATIENT"
                  {...formRegister("role")}
                  className="sr-only"
                />
                Patient
              </label>
              <label
                className={`flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border cursor-pointer hover:border-primary dark:hover:border-primary transition-all text-xs font-bold ${
                  selectedRole === "DOCTOR"
                    ? "border-primary bg-primary/5 text-primary dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                }`}
              >
                <input
                  type="radio"
                  value="DOCTOR"
                  {...formRegister("role")}
                  className="sr-only"
                />
                Doctor
              </label>
              <label
                className={`flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border cursor-pointer hover:border-primary dark:hover:border-primary transition-all text-xs font-bold ${
                  selectedRole === "ADMIN"
                    ? "border-primary bg-primary/5 text-primary dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350"
                }`}
              >
                <input
                  type="radio"
                  value="ADMIN"
                  {...formRegister("role")}
                  className="sr-only"
                />
                Admin
              </label>
            </div>
            {errors.role && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start">
              <input
                id="agreeTerms"
                type="checkbox"
                {...formRegister("agreeTerms")}
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded-sm mt-0.5 cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2.5 block text-xs text-slate-500 dark:text-slate-400 cursor-pointer"
              >
                I agree to the CarePulse{" "}
                <a
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.agreeTerms.message}
              </p>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
