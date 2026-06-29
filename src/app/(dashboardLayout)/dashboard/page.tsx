"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { Role } from "@/types";

export default function UnifiedDashboardPage() {
  const router = useRouter();
  const { activeRole, currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (activeRole === Role.PATIENT) {
      router.push("/dashboard/patient");
    } else if (activeRole === Role.DOCTOR) {
      router.push("/dashboard/doctor");
    } else if (activeRole === Role.ADMIN) {
      router.push("/dashboard/admin");
    } else if (activeRole === Role.SUPER_ADMIN) {
      router.push("/dashboard/super-admin");
    }
  }, [activeRole, currentUser, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
