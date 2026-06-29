"use client";

import React from "react";
import { User, UserStatus, Role } from "@/types";

interface UserControlsProps {
  users: User[];
  currentProfile: any;
  changeUserStatus: (id: string, status: UserStatus) => void;
  changeUserRole: (id: string, role: Role) => void;
}

export function UserControls({
  users,
  currentProfile,
  changeUserStatus,
  changeUserRole,
}: UserControlsProps) {
  const targetUsers = users.filter(u => u.email !== currentProfile?.email);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs animate-fadeIn space-y-6">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-850">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role & Status Moderation Controls</h2>
        <p className="text-xs text-slate-400 mt-1">Super Admin overrides. Lock user status clinic-wide or switch roles between ADMIN and SUPER_ADMIN.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-855 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-4">User Account Email</th>
              <th className="py-4 px-4">Active Role</th>
              <th className="py-4 px-4">System Status</th>
              <th className="py-4 px-4 text-center">Modify Status</th>
              <th className="py-4 px-4 text-right">Modify Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-855/50">
            {targetUsers.map(u => {
              const isStaff = u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN;
              return (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{u.email}</td>
                  <td className="py-4 px-4 text-slate-500">
                    <span className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-sm font-semibold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      u.status === UserStatus.ACTIVE ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450" : "bg-red-100 text-red-700 dark:bg-red-955/20 dark:text-red-400"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <select
                      value={u.status}
                      onChange={(e) => changeUserStatus(u.id, e.target.value as UserStatus)}
                      className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value={UserStatus.ACTIVE}>ACTIVE</option>
                      <option value={UserStatus.BLOCKED}>BLOCKED</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {isStaff ? (
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                        className="bg-slate-50 dark:bg-slate-850 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        <option value={Role.ADMIN}>ADMIN</option>
                        <option value={Role.SUPER_ADMIN}>SUPER_ADMIN</option>
                      </select>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium italic">Role Locked</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
