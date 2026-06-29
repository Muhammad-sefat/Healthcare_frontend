"use client";

import React from "react";
import { User, Role } from "@/types";
import { ShieldCheck, Users, UserCheck } from "lucide-react";

interface SuperAdminOverviewProps {
  users: User[];
  admins: any[];
}

export function SuperAdminOverview({
  users,
  admins,
}: SuperAdminOverviewProps) {
  const adminCount = admins.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-605 dark:bg-rose-950/20 dark:text-rose-400 rounded-2xl"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admins</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {users.filter(u => u.role === Role.SUPER_ADMIN).length}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><Users className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Admins</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{adminCount}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><UserCheck className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Accounts</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Super Admin Security Console
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Super Admins possess security clearance keys. You can register new administrators, override admin roles, lock blocked accounts clinic-wide, and review central database metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
