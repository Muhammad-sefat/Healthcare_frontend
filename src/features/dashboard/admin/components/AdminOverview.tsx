"use client";

import React from "react";
import { Appointment, User, Doctor, UserStatus, PaymentStatus } from "@/types";
import { Calendar, Users, DollarSign, Stethoscope } from "lucide-react";

interface AdminOverviewProps {
  appointments: Appointment[];
  users: User[];
  doctors: Doctor[];
}

export function AdminOverview({
  appointments,
  users,
  doctors,
}: AdminOverviewProps) {
  const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE);
  const totalRevenue = appointments.filter(a => a.paymentStatus === PaymentStatus.PAID).reduce((sum, a) => sum + (a.doctor?.appointmentFee || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Appointments</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{appointments.length}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-2xl"><Users className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Users</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{activeUsers.length}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Revenue</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">৳{totalRevenue}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 rounded-2xl"><Stethoscope className="h-6 w-6" /></div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Doctors</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{doctors.filter(d => !d.isDeleted).length}</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart and Donut charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Monthly Appointment Traffic
          </h3>
          
          {/* SVG Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between px-2 pt-4">
            {[
              { month: "Jan", count: 20 },
              { month: "Feb", count: 25 },
              { month: "Mar", count: 32 },
              { month: "Apr", count: 38 },
              { month: "May", count: 42 },
              { month: "Jun", count: 27 }
            ].map((item, idx) => {
              const maxVal = 50;
              const heightPercent = (item.count / maxVal) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="relative w-8 bg-primary/10 group-hover:bg-primary/20 rounded-t-lg flex items-end h-48 transition-colors">
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all duration-500" 
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Hover Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-6 uppercase tracking-wider border-b border-slate-50 dark:border-slate-850 pb-2">
            Appointments Distribution
          </h3>
          <div className="space-y-4 py-4">
            {["COMPLETED", "SCHEDULED", "CANCELED"].map(status => {
              const count = appointments.filter(a => a.status === status).length;
              const total = appointments.length || 1;
              const percent = Math.round((count / total) * 100);
              const colors = {
                COMPLETED: "bg-emerald-500",
                SCHEDULED: "bg-primary",
                CANCELED: "bg-rose-500"
              };
              return (
                <div key={status} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-500">{status}</span>
                    <span className="text-slate-800 dark:text-slate-200">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[status as keyof typeof colors]}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
